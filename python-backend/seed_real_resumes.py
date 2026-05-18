import os
import re
import shutil
import random
import datetime
import bcrypt
from pymongo import MongoClient
from bson.objectid import ObjectId

# Import parser functions directly
from parser import extract_text, parse_resume
from app import get_skill_match_score

client = MongoClient("mongodb://localhost:27017/")
db = client["smart_resume_ranking"]

RESUMES_DIR = r"c:\Users\Impana Dechamma\Downloads\40_sample_resumes"
UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Common password hash for all created candidate users
HASHED_PASSWORD = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt())

def get_or_create_candidate(name):
    email = f"{name.lower().replace(' ', '.')}@gmail.com"
    user = db.users.find_one({"email": email})
    if user:
        return user
    
    # Create new candidate user
    user_doc = {
        "name": name,
        "email": email,
        "password": HASHED_PASSWORD,
        "role": "candidate",
        "created_at": datetime.datetime.utcnow()
    }
    res = db.users.insert_one(user_doc)
    user_doc["_id"] = res.inserted_id
    return user_doc

def calculate_score(job, parsed_data, text_lower):
    # 1. Mandatory Skills (45%)
    mandatory_skills = job.get('mandatory_skills', [])
    mandatory_matches = []
    mandatory_match_points = 0.0
    for s in mandatory_skills:
        match_val = get_skill_match_score(s, text_lower)
        if match_val >= 1.0:
            mandatory_matches.append(s)
            mandatory_match_points += 1.0
        elif match_val >= 0.5:
            mandatory_matches.append(f"{s} (Partial)")
            mandatory_match_points += 0.5
            
    m_count = len(mandatory_skills)
    if m_count > 0:
        m_score = (mandatory_match_points / m_count) * 45
    else:
        m_score = 45 # Default if no requirements specified

    # 2. Preferred Skills (25%)
    preferred_skills = job.get('preferred_skills', [])
    preferred_matches = []
    preferred_match_points = 0.0
    for s in preferred_skills:
        match_val = get_skill_match_score(s, text_lower)
        if match_val >= 1.0:
            preferred_matches.append(s)
            preferred_match_points += 1.0
        elif match_val >= 0.5:
            preferred_matches.append(f"{s} (Partial)")
            preferred_match_points += 0.5
            
    p_count = len(preferred_skills)
    if p_count > 0:
        p_score = (preferred_match_points / p_count) * 25
    else:
        # Base of 10, plus up to 15 points scaled by number of extracted skills to reward diverse backgrounds
        cand_skills_count = len(parsed_data.get('skills', []))
        p_score = 10 + min(15, cand_skills_count * 2.0)

    # 3. CGPA Score (15%)
    min_cgpa = float(job.get('min_cgpa', 0.0))
    cand_cgpa = float(parsed_data.get('cgpa', 0.0))
    if min_cgpa > 0:
        if cand_cgpa >= min_cgpa:
            c_score = 10 + min(5, (cand_cgpa - min_cgpa) * 2)
        else:
            c_score = max(0, 10 - (min_cgpa - cand_cgpa) * 5)
    else:
        # Scale dynamically out of 15 based directly on CGPA (e.g. 8.5 CGPA gets 12.75 points)
        c_score = min(15, round(cand_cgpa * 1.5, 2))

    # 4. Experience Score (15%)
    req_exp = int(job.get('experience', 0))
    cand_exp = int(parsed_data.get('experience', 0))
    if req_exp > 0:
        if cand_exp >= req_exp:
            e_score = 10 + min(5, (cand_exp - req_exp))
        else:
            e_score = max(0, 10 - (req_exp - cand_exp) * 3)
    else:
        # If no experience required, freshers are welcome but experienced get a small boost
        e_score = 10 + min(5, cand_exp)

    total_score = round(min(100, m_score + p_score + c_score + e_score), 1)
    status = "shortlisted" if total_score >= 75 else "pending"
    
    return total_score, status, mandatory_matches + preferred_matches, [s for s in mandatory_skills if s not in mandatory_matches], m_score + p_score, c_score, e_score

def seed_candidates():
    if not os.path.exists(RESUMES_DIR):
        print(f"Error: Sample resumes directory {RESUMES_DIR} not found.")
        return

    # List all PDF files
    all_files = [f for f in os.listdir(RESUMES_DIR) if f.endswith(".pdf")]
    if not all_files:
        print("Error: No PDF resumes found in sample directory.")
        return
        
    print(f"Found {len(all_files)} sample resumes.")
    
    # Get all jobs from both collections
    benchmark_jobs = list(db.jobs.find())
    live_jobs = list(db.live_jobs.find())
    all_jobs = []
    
    for job in benchmark_jobs:
        job["_is_benchmark"] = True
        all_jobs.append(job)
    for job in live_jobs:
        job["_is_benchmark"] = False
        all_jobs.append(job)
        
    print(f"Loaded {len(all_jobs)} jobs to seed candidates for ({len(benchmark_jobs)} benchmark, {len(live_jobs)} live).")
    
    total_apps_created = 0
    
    for job in all_jobs:
        job_id = job["_id"]
        job_title = job.get("title", "Unknown Role")
        company = job.get("company_name", job.get("company", "Unknown Company"))
        
        # Check current applications count
        existing_apps = db.applications.count_documents({"job_id": ObjectId(job_id)})
        needed = max(0, 10 - existing_apps)
        
        if needed == 0:
            print(f"Job '{job_title}' at {company} already has {existing_apps} applications. Skipping.")
            continue
            
        print(f"Seeding {needed} candidates for '{job_title}' at {company}...")
        
        # Randomly choose files for this job (unique choices per job if possible)
        chosen_files = random.sample(all_files, min(needed, len(all_files)))
        if len(chosen_files) < needed:
            # Allow duplicates if we need more than 40
            chosen_files += random.choices(all_files, k=(needed - len(chosen_files)))
            
        for pdf_name in chosen_files:
            # 1. Parse candidate name from PDF filename (e.g. "Aarav_Shetty_Resume.pdf" -> "Aarav Shetty")
            candidate_name = pdf_name.replace("_Resume.pdf", "").replace("_", " ")
            
            # 2. Get or create candidate user
            candidate = get_or_create_candidate(candidate_name)
            candidate_id = candidate["_id"]
            
            # 3. Double check if candidate has already applied to this specific job
            app_exists = db.applications.find_one({"job_id": ObjectId(job_id), "candidate_id": ObjectId(candidate_id)})
            if app_exists:
                continue
                
            # 4. Copy PDF file to uploads folder
            src_path = os.path.join(RESUMES_DIR, pdf_name)
            dst_filename = f"{candidate_id}_{pdf_name}"
            dst_path = os.path.join(UPLOADS_DIR, dst_filename)
            shutil.copy(src_path, dst_path)
            
            # 5. Extract and parse resume content
            text = extract_text(dst_path)
            parsed_data = parse_resume(text)
            text_lower = text.lower()
            
            # 6. Calculate advanced scores
            total_score, status, matched_skills, missing_skills, s_breakdown, c_breakdown, e_breakdown = calculate_score(job, parsed_data, text_lower)
            
            # 7. Create application document
            app_doc = {
                "job_id": ObjectId(job_id),
                "candidate_id": ObjectId(candidate_id),
                "candidate_name": candidate["name"],
                "candidate_email": candidate["email"],
                "resume_path": dst_path.replace("\\", "/"),
                "score": total_score,
                "status": status,
                "details": {
                    "matched_skills": matched_skills,
                    "missing_skills": missing_skills,
                    "candidate_skills": parsed_data.get('skills', []),
                    "cgpa": float(parsed_data.get('cgpa', 0.0)),
                    "experience": int(parsed_data.get('experience', 0)),
                    "breakdown": {
                        "skills": round(s_breakdown, 1),
                        "education": round(c_breakdown, 1),
                        "experience": round(e_breakdown, 1)
                    }
                },
                "applied_at": datetime.datetime.utcnow()
            }
            db.applications.insert_one(app_doc)
            
            # 8. Create notifications
            db.notifications.insert_one({
                "user_id": ObjectId(candidate_id),
                "type": "application_submitted",
                "message": f"Your application for {job_title} at {company} has been submitted with a score of {total_score}%. Status: {status}.",
                "job_id": ObjectId(job_id),
                "is_read": False,
                "created_at": datetime.datetime.utcnow()
            })
            
            if 'created_by' in job:
                try:
                    db.notifications.insert_one({
                        "user_id": ObjectId(job['created_by']),
                        "type": "new_application",
                        "message": f"New application received from {candidate['name']} for {job_title}. Score: {total_score}%.",
                        "job_id": ObjectId(job_id),
                        "is_read": False,
                        "created_at": datetime.datetime.utcnow()
                    })
                except Exception:
                    pass
            
            total_apps_created += 1
            
        # 9. Update vacancies and remaining_vacancies for live jobs if needed
        if not job["_is_benchmark"]:
            db.live_jobs.update_one(
                {"_id": ObjectId(job_id)},
                {"$set": {"remaining_vacancies": max(0, job.get("vacancies", 10) - db.applications.count_documents({"job_id": ObjectId(job_id)}))}}
            )

    print(f"SUCCESS: Seeded {total_apps_created} total applications across all jobs!")

if __name__ == "__main__":
    seed_candidates()
