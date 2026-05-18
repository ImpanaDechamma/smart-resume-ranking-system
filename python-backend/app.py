import os
import re
import datetime
import bcrypt
import jwt
from functools import wraps
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from parser import extract_text, parse_resume
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Database Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/smart_resume_ranking")
client = MongoClient(MONGO_URI)
db = client.get_database()

JWT_SECRET = os.getenv("JWT_SECRET", "super_secret_jwt_key_12345")

# Auth Middleware
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            token = token.split(" ")[1] if " " in token else token
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = db.users.find_one({"_id": ObjectId(data['id'])})
            if not current_user:
                return jsonify({'error': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'error': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def find_job_anywhere(job_id):
    """Helper to find a job in either benchmarks (jobs) or live_jobs collection."""
    if not job_id: return None, None
    try:
        oid = ObjectId(job_id) if isinstance(job_id, str) else job_id
        job = db.jobs.find_one({"_id": oid})
        if job:
            job['is_benchmark'] = True
            job['company_id'] = str(job.get('company_id', ''))
            job['company_name'] = job.get('company_name', 'Unknown')
            return job, db.jobs
        job = db.live_jobs.find_one({"_id": oid})
        if job:
            job['is_benchmark'] = False
            job['company_id'] = str(job.get('company_id', ''))
            job['company_name'] = job.get('company_name', 'Unknown')
            return job, db.live_jobs
    except Exception as e:
        print("Error in find_job_anywhere:", e)
    return None, None

def normalize_skill(skill):
    s = skill.lower().strip()
    s = s.replace('.js', '').replace('js', '').replace('-', '').replace(' ', '')
    if s.endswith('s') and len(s) > 3:
        s = s[:-1] # De-pluralize
    return s

def get_skill_match_score(required_skill, resume_text):
    """
    Returns a score of 1.0 for a perfect/direct match,
    0.5 for a strong semantic/relevance match,
    and 0.0 for no match.
    """
    req_norm = normalize_skill(required_skill)
    resume_lower = resume_text.lower()
    
    # Direct match of normalized string or regex word boundary
    if req_norm in resume_lower.replace(' ', '').replace('.js', '').replace('js', ''):
        return 1.0
    if re.search(r'\b' + re.escape(required_skill.lower()) + r'\b', resume_lower):
        return 1.0
        
    # Check common abbreviations and strong semantic links
    abbreviations = {
        'api': ['api', 'apis', 'restful', 'soap', 'flask', 'django', 'fastapi', 'express'],
        'node': ['node', 'nodejs', 'express', 'javascript', 'js'],
        'react': ['react', 'reactjs', 'nextjs', 'javascript', 'js', 'frontend', 'html', 'css'],
        'ml': ['machinelearning', 'ml', 'deeplearning', 'dl', 'ai', 'artificialintelligence', 'tensorflow', 'pytorch'],
        'db': ['database', 'sql', 'mongodb', 'postgres', 'nosql', 'dynamodb'],
        'aws': ['aws', 'amazon', 'cloud', 'gcp', 'azure'],
        'gcp': ['gcp', 'googlecloud', 'cloud', 'aws'],
        'kubernetes': ['k8s', 'kubernetes', 'docker', 'devops'],
        'java': ['java', 'spring', 'springboot', 'oop'],
        'python': ['python', 'django', 'flask', 'fastapi', 'ml', 'machinelearning'],
        'testing': ['testing', 'selenium', 'pytest', 'qa', 'automation']
    }
    
    for key, aliases in abbreviations.items():
        if req_norm == key or req_norm in aliases:
            for alias in aliases:
                if alias in resume_lower.replace(' ', ''):
                    return 0.5 # Semantic partial match
                    
    return 0.0

# ─────────────────────────────────────────────────────────────
# Authentication Endpoints
# ─────────────────────────────────────────────────────────────
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'candidate')
    
    if db.users.find_one({"email": email}):
        return jsonify({'error': 'User already exists'}), 400
        
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_id = db.users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_pw,
        "role": role,
        "created_at": datetime.datetime.utcnow()
    }).inserted_id
    
    token = jwt.encode({
        'id': str(user_id),
        'email': email,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, JWT_SECRET)
    
    return jsonify({
        'id': str(user_id),
        'name': name,
        'email': email,
        'role': role,
        'token': token
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = db.users.find_one({"email": email})
    if user:
        db_password = user['password']
        if isinstance(db_password, str):
            db_password = db_password.encode('utf-8')
            
        if bcrypt.checkpw(password.encode('utf-8'), db_password):
            token = jwt.encode({
                'id': str(user['_id']),
                'email': email,
                'role': user['role'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
            }, JWT_SECRET)
            
            return jsonify({
                'id': str(user['_id']),
                'name': user['name'],
                'email': email,
                'role': user['role'],
                'token': token
            })
    
    return jsonify({'error': 'Invalid credentials'}), 401

# ─────────────────────────────────────────────────────────────
# Jobs Endpoints
# ─────────────────────────────────────────────────────────────
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    benchmarks = list(db.jobs.find())
    live_jobs = list(db.live_jobs.find())
    
    for b in benchmarks: b['is_benchmark'] = True
    for l in live_jobs: l['is_benchmark'] = False
    
    all_jobs = benchmarks + live_jobs
    result = []
    
    for job in all_jobs:
        job['id'] = str(job['_id'])
        del job['_id']
        job['company_id'] = str(job.get('company_id', ''))
        job['company'] = job.get('company_name', 'Unknown')
        job['skills'] = job.get('mandatory_skills', [])
        job['is_benchmark'] = job.get('is_benchmark', False)
        job['applicants'] = db.applications.count_documents({"job_id": ObjectId(job['id'])})
        job['posted'] = "Just now"
        if 'created_by' in job:
            job['created_by'] = str(job['created_by'])
        if 'created_at' in job:
            job['created_at'] = str(job['created_at'])
        job['vacancies'] = job.get('vacancies', 0)
        job['remaining_vacancies'] = job.get('remaining_vacancies', job.get('vacancies', 0))
        result.append(job)
    return jsonify(result)

@app.route('/api/jobs', methods=['POST'])
@token_required
def create_job(current_user):
    if current_user.get('role') not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403

    try:
        title       = request.form.get('title', '').strip()
        company     = request.form.get('company', '').strip()
        description = request.form.get('description', '').strip()
        skills_raw  = request.form.get('skills', '')
        is_benchmark = request.form.get('is_benchmark', 'false').lower() == 'true'
        vacancies    = int(request.form.get('vacancies', '0'))

        if not title or not company:
            return jsonify({'error': 'title and company are required'}), 400

        skills_list = [s.strip() for s in skills_raw.split(',') if s.strip()]

        logo_url = ''
        if 'logo' in request.files and request.files['logo'].filename:
            logo_file = request.files['logo']
            os.makedirs('uploads', exist_ok=True)
            logo_filename = secure_filename(f"logo_{company}_{logo_file.filename}")
            logo_path = os.path.join('uploads', logo_filename)
            logo_file.save(logo_path)
            logo_url = f"http://localhost:5000/uploads/{logo_filename}"
        elif request.form.get('logo'):
            logo_url = request.form.get('logo')
        else:
            domain = company.lower().replace(' ', '') + '.com'
            logo_url = f"https://www.google.com/s2/favicons?domain={domain}&sz=128"

        banner_url = ''
        if 'banner' in request.files and request.files['banner'].filename:
            banner_file = request.files['banner']
            os.makedirs('uploads', exist_ok=True)
            banner_filename = secure_filename(f"banner_{company}_{banner_file.filename}")
            banner_path = os.path.join('uploads', banner_filename)
            banner_file.save(banner_path)
            banner_url = f"http://localhost:5000/uploads/{banner_filename}"
        elif request.form.get('banner'):
            banner_url = request.form.get('banner')
        else:
            banner_url = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000"

        existing_company = db.companies.find_one({"name": company})
        if existing_company:
            company_id = existing_company['_id']
        else:
            company_id = db.companies.insert_one({
                "name": company,
                "logo": logo_url,
                "banner": banner_url
            }).inserted_id

        target_collection = db.jobs if is_benchmark else db.live_jobs
        
        job_id = target_collection.insert_one({
            "company_id": company_id,
            "company_name": company,
            "title": title,
            "mandatory_skills": skills_list,
            "preferred_skills": [],
            "min_cgpa": 0.0,
            "experience": 0,
            "description": description,
            "is_benchmark": is_benchmark,
            "banner": banner_url,
            "logo": logo_url,
            "vacancies": vacancies,
            "remaining_vacancies": vacancies,
            "created_by": str(current_user['_id']),
            "created_at": str(datetime.datetime.utcnow())
        }).inserted_id

        return jsonify({
            "message": "Job created successfully",
            "jobId": str(job_id),
            "company": company,
            "title": title,
            "is_benchmark": is_benchmark,
        }), 201

    except Exception as e:
        return jsonify({'error': f'Failed to create job: {str(e)}'}), 500

@app.route('/uploads/<filename>', methods=['GET'])
def serve_upload(filename):
    from flask import send_from_directory
    return send_from_directory(os.path.abspath('uploads'), filename)

@app.route('/api/jobs/<job_id>', methods=['PUT'])
@token_required
def edit_job(current_user, job_id):
    if current_user.get('role') not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    try:
        job, collection = find_job_anywhere(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404

        if str(job.get('created_by', '')) != str(current_user['_id']):
            return jsonify({'error': 'You can only edit jobs you have posted'}), 403

        data = request.get_json()
        update_fields = {}
        if 'title' in data:
            update_fields['title'] = data['title'].strip()
        if 'description' in data:
            update_fields['description'] = data['description'].strip()
        if 'skills' in data:
            skills_list = [s.strip() for s in data['skills'].split(',') if s.strip()]
            update_fields['mandatory_skills'] = skills_list
        update_fields['updated_at'] = str(datetime.datetime.utcnow())

        collection.update_one({"_id": ObjectId(job_id)}, {"$set": update_fields})
        return jsonify({'message': 'Job updated successfully', 'jobId': job_id}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/<job_id>', methods=['DELETE'])
@token_required
def delete_job(current_user, job_id):
    if current_user.get('role') not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    try:
        job, collection = find_job_anywhere(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404

        if str(job.get('created_by', '')) != str(current_user['_id']):
            return jsonify({'error': 'You can only delete jobs you have posted'}), 403

        collection.delete_one({"_id": ObjectId(job_id)})
        db.applications.delete_many({"job_id": ObjectId(job_id)})
        return jsonify({'message': 'Job deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/resume/view/<app_id>')
def view_resume(app_id):
    try:
        app_doc = db.applications.find_one({"_id": ObjectId(app_id)})
        if not app_doc or 'resume_path' not in app_doc:
            return "Resume not found", 404
        
        # Use basename to handle path mismatches between environments
        filename = os.path.basename(app_doc['resume_path'])
        file_path = os.path.join(os.getcwd(), 'uploads', filename)
        
        if not os.path.exists(file_path):
            return f"File not found on server at {file_path}", 404
            
        return send_file(file_path)
    except Exception as e:
        return str(e), 500

# ─────────────────────────────────────────────────────────────
# Screening & Applications
# ─────────────────────────────────────────────────────────────
@app.route('/api/applications/<job_id>', methods=['POST'])
@token_required
def screen_resume(current_user, job_id):
    try:
        job_doc, _ = find_job_anywhere(job_id)
        if not job_doc:
            return jsonify({'error': 'Job not found'}), 404
            
        if job_doc and not job_doc.get('is_benchmark', False):
            existing = db.applications.find_one({
                "job_id": ObjectId(job_id),
                "candidate_id": current_user['_id']
            })
            if existing:
                # Delete existing application to allow re-uploading and re-screening with a new resume
                db.applications.delete_one({"_id": existing["_id"]})
                # Re-increment vacancy since the old application is deleted (the new insert will decrement it again)
                _, collection = find_job_anywhere(job_id)
                collection.update_one({"_id": ObjectId(job_id)}, {"$inc": {"remaining_vacancies": 1}})
            
            if job_doc.get('remaining_vacancies', 0) <= 0 and not existing:
                return jsonify({'error': 'No vacancies left for this job'}), 403

        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file'}), 400
            
        file = request.files['resume']
        os.makedirs('uploads', exist_ok=True)
        filename = secure_filename(f"{current_user['_id']}_{file.filename}")
        file_path = os.path.join('uploads', filename)
        file.save(os.path.join(os.getcwd(), file_path))
        
        try:
            text = extract_text(file_path)
            parsed_data = parse_resume(text)
        except Exception as e:
            return jsonify({'error': f'Parsing failed: {str(e)}'}), 500
        
        # ── Advanced Scoring Algorithm ──────────────────────────────────────
        job = job_doc
        text_lower = text.lower()
        
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

        application_id = db.applications.insert_one({
            "job_id": ObjectId(job_id),
            "candidate_id": current_user['_id'],
            "candidate_name": current_user['name'],
            "candidate_email": current_user['email'],
            "resume_path": file_path,
            "score": total_score,
            "status": status,
            "details": {
                "matched_skills": mandatory_matches + preferred_matches,
                "missing_skills": [s for s in mandatory_skills if s not in mandatory_matches],
                "candidate_skills": parsed_data.get('skills', []),
                "cgpa": cand_cgpa,
                "experience": cand_exp,
                "breakdown": {
                    "skills": round(m_score + p_score, 1),
                    "education": round(c_score, 1),
                    "experience": round(e_score, 1)
                }
            },
            "applied_at": datetime.datetime.utcnow()
        }).inserted_id

        # Create Notification for Candidate
        db.notifications.insert_one({
            "user_id": current_user['_id'],
            "type": "application_submitted",
            "message": f"Your application for {job.get('title')} at {job.get('company_name')} has been submitted with a score of {total_score}%. Status: {status}.",
            "job_id": ObjectId(job_id),
            "is_read": False,
            "created_at": datetime.datetime.utcnow()
        })

        # Create Notification for HR
        if 'created_by' in job:
            db.notifications.insert_one({
                "user_id": ObjectId(job['created_by']),
                "type": "new_application",
                "message": f"New application received from {current_user['name']} for {job.get('title')}. Score: {total_score}%.",
                "job_id": ObjectId(job_id),
                "application_id": application_id,
                "is_read": False,
                "created_at": datetime.datetime.utcnow()
            })

        # Update vacancies if live job
        if job_doc and not job_doc.get('is_benchmark', False):
            _, collection = find_job_anywhere(job_id)
            collection.update_one({"_id": ObjectId(job_id)}, {"$inc": {"remaining_vacancies": -1}})
            
            # Trigger Urgency Notification
            updated_job = collection.find_one({"_id": ObjectId(job_id)})
            remaining = updated_job.get('remaining_vacancies', 0)
            if remaining <= 3 and remaining > 0:
                interested_users = list(db.interests.find({"job_id": ObjectId(job_id)}))
                for interest in interested_users:
                    # Don't notify the person who just applied
                    if str(interest['user_id']) == str(current_user['_id']):
                        continue
                    db.notifications.insert_one({
                        "user_id": interest['user_id'],
                        "type": "low_vacancy",
                        "message": f"Only {remaining} seats left for {updated_job.get('title')}! Apply fast!",
                        "job_id": ObjectId(job_id),
                        "is_read": False,
                        "created_at": datetime.datetime.utcnow()
                    })

        return jsonify({
            "message": "Screening completed", 
            "applicationId": str(application_id), 
            "score": total_score, 
            "status": status,
            "details": {
                "missing_skills": [s for s in mandatory_skills if s not in mandatory_matches],
                "breakdown": {
                    "skills": round(m_score + p_score, 1),
                    "education": round(c_score, 1),
                    "experience": round(e_score, 1)
                }
            }
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications/my', methods=['GET'])
@token_required
def get_my_screenings(current_user):
    screenings = list(db.applications.find({"candidate_id": current_user['_id']}))
    results = []
    for s in screenings:
        job, _ = find_job_anywhere(s['job_id'])
        applied_at = s['applied_at'].isoformat() if hasattr(s.get('applied_at'), 'isoformat') else str(s.get('applied_at', ''))
        results.append({
            "id": str(s['_id']),
            "jobId": str(s['job_id']),
            "jobTitle": job['title'] if job else "Unknown",
            "company": job['company_name'] if job else "Unknown",
            "appliedAt": applied_at,
            "appliedDate": applied_at,
            "status": s['status'],
            "score": s['score'],
            "resumeFile": s.get('resume_path', ''),
            "candidateSkills": s.get('details', {}).get('candidate_skills', []),
            "missingSkills": s.get('details', {}).get('missing_skills', []),
        })
    return jsonify(results)

@app.route('/api/applications/job/<job_id>', methods=['GET'])
@token_required
def get_job_applications(current_user, job_id):
    if current_user.get('role') not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    try:
        apps = list(db.applications.find({"job_id": ObjectId(job_id)}))
        results = []
        for a in apps:
            candidate = db.users.find_one({"_id": a['candidate_id']})
            applied_at = a['applied_at'].isoformat() if hasattr(a.get('applied_at'), 'isoformat') else str(a.get('applied_at', ''))
            results.append({
                "id": str(a['_id']),
                "jobId": str(a['job_id']),
                "appliedAt": applied_at,
                "appliedDate": applied_at,
                "status": a.get('status', 'pending'),
                "score": a.get('score', 0),
                "candidateName": a.get('candidate_name', candidate.get('name', '') if candidate else ''),
                "candidateEmail": a.get('candidate_email', candidate.get('email', '') if candidate else ''),
                "resumeFile": a.get('resume_path', ''),
                "candidateSkills": a.get('details', {}).get('candidate_skills', []),
                "missingSkills": a.get('details', {}).get('missing_skills', []),
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications/<app_id>/status', methods=['PUT'])
@token_required
def update_application_status(current_user, app_id):
    if current_user.get('role') not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    try:
        data = request.get_json()
        new_status = data.get('status', '').lower().strip()
        interview_date = data.get('interview_date')
        update_data = {"status": new_status, "updated_at": datetime.datetime.utcnow()}
        if interview_date:
            update_data["interview_date"] = interview_date
        db.applications.update_one({"_id": ObjectId(app_id)}, {"$set": update_data})
        
        # Create Notification for Candidate
        app_doc = db.applications.find_one({"_id": ObjectId(app_id)})
        if app_doc:
            job_doc, _ = find_job_anywhere(app_doc['job_id'])
            message = f"Your application for {job_doc['title'] if job_doc else 'a job'} has been updated to '{new_status}'."
            if new_status == "shortlisted" and interview_date:
                message = f"Congratulations! You have been shortlisted for {job_doc['title'] if job_doc else 'a job'}. Your interview is scheduled for {interview_date}."
            
            db.notifications.insert_one({
                "user_id": app_doc['candidate_id'],
                "type": "status_update",
                "message": message,
                "job_id": app_doc['job_id'],
                "application_id": ObjectId(app_id),
                "is_read": False,
                "created_at": datetime.datetime.utcnow()
            })

        return jsonify({'message': f'Status updated to {new_status}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─────────────────────────────────────────────────────────────
# Notifications Endpoints
# ─────────────────────────────────────────────────────────────
@app.route('/api/notifications/my', methods=['GET'])
@token_required
def get_my_notifications(current_user):
    try:
        notifications = list(db.notifications.find({"user_id": current_user['_id']}).sort("created_at", -1))
        result = []
        for n in notifications:
            result.append({
                "id": str(n['_id']),
                "type": n.get('type'),
                "message": n.get('message'),
                "is_read": n.get('is_read', False),
                "created_at": n['created_at'].isoformat() if hasattr(n.get('created_at'), 'isoformat') else str(n.get('created_at', '')),
                "job_id": str(n.get('job_id', '')),
                "application_id": str(n.get('application_id', ''))
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notifications/<notification_id>/read', methods=['PATCH'])
@token_required
def mark_notification_read(current_user, notification_id):
    try:
        db.notifications.update_one(
            {"_id": ObjectId(notification_id), "user_id": current_user['_id']},
            {"$set": {"is_read": True}}
        )
        return jsonify({'message': 'Notification marked as read'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notifications/clear', methods=['DELETE'])
@token_required
def clear_notifications(current_user):
    try:
        db.notifications.delete_many({"user_id": current_user['_id']})
        return jsonify({'message': 'Notifications cleared'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/skills/stats', methods=['GET'])
@token_required
def get_skills_stats(current_user):
    if current_user['role'] not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    pipeline = [{"$project": {"all_skills": {"$concatArrays": ["$mandatory_skills", "$preferred_skills"]}}}, {"$unwind": "$all_skills"}, {"$group": {"_id": "$all_skills", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}, {"$limit": 10}, {"$project": {"skill": "$_id", "count": 1, "_id": 0}}]
    stats_benchmarks = list(db.jobs.aggregate(pipeline))
    stats_live = list(db.live_jobs.aggregate(pipeline))
    merged = {}
    for s in stats_benchmarks + stats_live:
        skill = s['skill']
        merged[skill] = merged.get(skill, 0) + s['count']
    final_stats = [{"skill": k, "count": v} for k, v in merged.items()]
    final_stats.sort(key=lambda x: x['count'], reverse=True)
    return jsonify(final_stats[:10])

# ─────────────────────────────────────────────────────────────
# Interests Endpoints
# ─────────────────────────────────────────────────────────────
@app.route('/api/jobs/<job_id>/interest', methods=['POST'])
@token_required
def toggle_interest(current_user, job_id):
    try:
        existing = db.interests.find_one({
            "user_id": current_user['_id'],
            "job_id": ObjectId(job_id)
        })
        if existing:
            db.interests.delete_one({"_id": existing['_id']})
            return jsonify({'message': 'Removed from interests', 'is_interested': False})
        else:
            db.interests.insert_one({
                "user_id": current_user['_id'],
                "job_id": ObjectId(job_id),
                "created_at": datetime.datetime.utcnow()
            })
            return jsonify({'message': 'Added to interests', 'is_interested': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/interests/my', methods=['GET'])
@token_required
def get_my_interests(current_user):
    try:
        interests = list(db.interests.find({"user_id": current_user['_id']}))
        return jsonify([str(i['job_id']) for i in interests])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
