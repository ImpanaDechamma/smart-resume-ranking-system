import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import jwt
import datetime
import bcrypt
from functools import wraps
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
    if not job_id: return None
    try:
        oid = ObjectId(job_id) if isinstance(job_id, str) else job_id
        # Check benchmarks first
        job = db.jobs.find_one({"_id": oid})
        if job:
            job['is_benchmark'] = True
            return job, db.jobs
        # Check live jobs
        job = db.live_jobs.find_one({"_id": oid})
        if job:
            job['is_benchmark'] = False
            return job, db.live_jobs
    except:
        pass
    return None, None

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
    # Fetch from both "tables"
    benchmarks = list(db.jobs.find())
    live_jobs = list(db.live_jobs.find())
    
    # Mark types
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
        # Convert any remaining ObjectId fields to strings to prevent JSON serialization errors
        if 'created_by' in job:
            job['created_by'] = str(job['created_by'])
        if 'created_at' in job:
            job['created_at'] = str(job['created_at'])
        result.append(job)
    return jsonify(result)

@app.route('/api/jobs', methods=['POST'])
@token_required
def create_job(current_user):
    """HR creates a new job opening or benchmark."""
    if current_user.get('role') not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403

    try:
        # Read form fields
        title       = request.form.get('title', '').strip()
        company     = request.form.get('company', '').strip()
        description = request.form.get('description', '').strip()
        skills_raw  = request.form.get('skills', '')
        is_benchmark = request.form.get('is_benchmark', 'false').lower() == 'true'

        if not title or not company:
            return jsonify({'error': 'title and company are required'}), 400

        skills_list = [s.strip() for s in skills_raw.split(',') if s.strip()]

        # Handle logo upload
        logo_url = ''
        if 'logo' in request.files and request.files['logo'].filename:
            from werkzeug.utils import secure_filename
            logo_file = request.files['logo']
            os.makedirs('uploads', exist_ok=True)
            logo_filename = secure_filename(f"logo_{company}_{logo_file.filename}")
            logo_path = os.path.join('uploads', logo_filename)
            logo_file.save(logo_path)
            logo_url = f"http://localhost:5000/uploads/{logo_filename}"
        elif request.form.get('logo'):
            logo_url = request.form.get('logo')
        else:
            # Fallback: Google favicon
            domain = company.lower().replace(' ', '') + '.com'
            logo_url = f"https://www.google.com/s2/favicons?domain={domain}&sz=128"

        # Handle banner upload
        banner_url = ''
        if 'banner' in request.files and request.files['banner'].filename:
            from werkzeug.utils import secure_filename
            banner_file = request.files['banner']
            os.makedirs('uploads', exist_ok=True)
            banner_filename = secure_filename(f"banner_{company}_{banner_file.filename}")
            banner_path = os.path.join('uploads', banner_filename)
            banner_file.save(banner_path)
            banner_url = f"http://localhost:5000/uploads/{banner_filename}"
        elif request.form.get('banner'):
            banner_url = request.form.get('banner')
        else:
            # Fallback: generic office banner
            banner_url = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000"

        # Create or reuse company document
        existing_company = db.companies.find_one({"name": company})
        if existing_company:
            company_id = existing_company['_id']
        else:
            company_id = db.companies.insert_one({
                "name": company,
                "logo": logo_url,
                "banner": banner_url
            }).inserted_id

        # Insert job into the appropriate "table"
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
        print(f"Create job error: {e}")
        return jsonify({'error': f'Failed to create job: {str(e)}'}), 500

@app.route('/uploads/<filename>', methods=['GET'])
def serve_upload(filename):
    """Serve uploaded logo/banner images."""
    from flask import send_from_directory
    return send_from_directory(os.path.abspath('uploads'), filename)

@app.route('/api/jobs/<job_id>', methods=['PUT'])
@token_required
def edit_job(current_user, job_id):
    """HR edits a job they posted. Ownership check enforced."""
    if current_user.get('role') not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    try:
        job, collection = find_job_anywhere(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404

        # Ownership check — only the creator can edit
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
    """HR deletes a job they posted. Ownership check enforced."""
    if current_user.get('role') not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    try:
        job, collection = find_job_anywhere(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404

        # Ownership check
        if str(job.get('created_by', '')) != str(current_user['_id']):
            return jsonify({'error': 'You can only delete jobs you have posted'}), 403

        collection.delete_one({"_id": ObjectId(job_id)})
        # Also clean up applications for this job
        db.applications.delete_many({"job_id": ObjectId(job_id)})
        return jsonify({'message': 'Job deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─────────────────────────────────────────────────────────────
# Screening & Applications
# ─────────────────────────────────────────────────────────────
@app.route('/api/applications/<job_id>', methods=['POST'])
@token_required
def screen_resume(current_user, job_id):
    try:
        # ── Duplicate Application Guard ────────────────────────────────────
        job_doc, _ = find_job_anywhere(job_id)
        if job_doc and not job_doc.get('is_benchmark', False):
            # Live job — only one application allowed per candidate
            existing = db.applications.find_one({
                "job_id": ObjectId(job_id),
                "candidate_id": current_user['_id']
            })
            if existing:
                return jsonify({
                    'error': 'You have already applied to this job. Each live job allows only one application.',
                    'code': 'ALREADY_APPLIED'
                }), 409
        # Benchmarks → no restriction, allow unlimited simulations
        # ──────────────────────────────────────────────────────────────────

        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file in request'}), 400
            
        file = request.files['resume']
        if not file or file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        os.makedirs('uploads', exist_ok=True)
        from werkzeug.utils import secure_filename
        filename = secure_filename(f"{current_user['_id']}_{file.filename}")
        file_path = os.path.abspath(os.path.join('uploads', filename))
        file.save(file_path)
        print(f"Saved resume to: {file_path}")
        
        # Parse Resume
        try:
            text = extract_text(file_path)
            if not text:
                return jsonify({'error': 'Could not extract text from resume'}), 400
            parsed_data = parse_resume(text)
        except Exception as e:
            print(f"Parser error: {e}")
            return jsonify({'error': f'Resume parsing failed: {str(e)}'}), 500
        
        # Get Job Requirements
        job, _ = find_job_anywhere(job_id)
        if not job:
            return jsonify({'error': 'Job profile not found'}), 404

        # ── Weighted Scoring Logic (fixed) ─────────────────────────────────
        # parser.py now stores skills in lowercase — compare lowercase consistently
        candidate_skills_lower = [s.lower() for s in parsed_data.get('skills', [])]

        # Mandatory Skills — 50 points
        mandatory_skills = job.get('mandatory_skills', [])
        mandatory_matches = [s for s in mandatory_skills if s.lower() in candidate_skills_lower]
        m_count = len(mandatory_skills)
        mandatory_score = (len(mandatory_matches) / m_count) * 50 if m_count > 0 else 50

        # Preferred Skills — 20 points
        preferred_skills = job.get('preferred_skills', [])
        preferred_matches = [s for s in preferred_skills if s.lower() in candidate_skills_lower]
        p_count = len(preferred_skills)
        preferred_score = (len(preferred_matches) / p_count) * 20 if p_count > 0 else 20

        # Education (CGPA) — 20 points
        candidate_cgpa = parsed_data.get('cgpa', 0.0)
        min_cgpa = job.get('min_cgpa', 0.0)
        if min_cgpa == 0:
            ed_score = 20
        elif candidate_cgpa >= min_cgpa:
            ed_score = 20
        else:
            ed_score = round((candidate_cgpa / min_cgpa) * 20, 1)

        # Experience — 10 points (proportional, not binary)
        candidate_exp = parsed_data.get('experience', 0)
        required_exp = job.get('experience', 0)
        if required_exp == 0:
            exp_score = 10
        elif candidate_exp >= required_exp:
            exp_score = 10
        else:
            exp_score = round((candidate_exp / required_exp) * 10, 1)

        total_score = round(mandatory_score + preferred_score + ed_score + exp_score, 1)
        status = "Shortlisted" if total_score >= 70 else "Needs Improvement" if total_score >= 45 else "Rejected"

        # Recommendations
        missing_skills = [s for s in mandatory_skills if s not in mandatory_matches]
        title = job.get('title', '')
        if any(k in title for k in ["Data", "AI", "ML", "Research", "Quantum"]):
            suggested_certs = ["Google ML Professional Certificate", "Deep Learning Specialization (Coursera)"]
        elif any(k in title for k in ["Cloud", "Azure", "Infra", "DevOps"]):
            suggested_certs = ["AWS Solutions Architect", "Microsoft Azure Fundamentals"]
        elif any(k in title for k in ["Design", "UX", "UI", "Product"]):
            suggested_certs = ["Google UX Design Certificate", "Figma Advanced Course"]
        else:
            suggested_certs = ["CompTIA Security+", "Meta Full-Stack Developer Certificate"]

        # Save screening result
        application_id = db.applications.insert_one({
            "job_id": ObjectId(job_id),
            "candidate_id": current_user['_id'],
            "candidate_name": current_user['name'],
            "candidate_email": current_user['email'],
            "resume_path": file_path,
            "score": total_score,
            "status": status,
            "details": {
                "mandatory_score": mandatory_score,
                "preferred_score": preferred_score,
                "education_score": ed_score,
                "experience_score": exp_score,
                "candidate_cgpa": candidate_cgpa,
                "candidate_exp": candidate_exp,
                "matched_skills": mandatory_matches + preferred_matches,
                "missing_skills": missing_skills,
                "suggested_certs": suggested_certs,
            },
            "applied_at": datetime.datetime.utcnow()
        }).inserted_id

        # Auto-create notification for Candidate
        icon = "🎉" if status == "Shortlisted" else "📊" if status == "Needs Improvement" else "📋"
        db.notifications.insert_one({
            "user_id": current_user['_id'],
            "title": f"{icon} Resume Screening Complete — {job.get('company_name', 'Company')}",
            "message": f"Your resume scored {total_score}% for {job.get('title', 'this role')}. Status: {status}.",
            "type": "screening_result",
            "application_id": application_id,
            "is_read": False,
            "created_at": datetime.datetime.utcnow()
        })

        # Notify HR (the job creator)
        if job.get('created_by'):
            try:
                hr_id = ObjectId(job['created_by'])
                db.notifications.insert_one({
                    "user_id": hr_id,
                    "title": f"📩 New Application — {job.get('title', 'Role')}",
                    "message": f"{current_user['name']} has applied. AI Score: {total_score}%",
                    "type": "new_application",
                    "application_id": application_id,
                    "is_read": False,
                    "created_at": datetime.datetime.utcnow()
                })
            except Exception as e:
                print(f"Error notifying HR: {e}")

        return jsonify({
            "message": "Screening completed",
            "applicationId": str(application_id),
            "score": total_score,
            "status": status,
            "missing_skills": missing_skills,
            "score_breakdown": {
                "mandatory_skills": round(mandatory_score, 1),
                "preferred_skills": round(preferred_score, 1),
                "education": round(ed_score, 1),
                "experience": round(exp_score, 1),
            },
            "matched_skills": mandatory_matches + preferred_matches,
            "candidate_info": {
                "cgpa": candidate_cgpa,
                "experience_years": candidate_exp,
                "skills_detected": candidate_skills_lower,
            }
        }), 201

    except Exception as e:
        print(f"Application error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/applications/my', methods=['GET'])
@token_required
def get_my_screenings(current_user):
    screenings = list(db.applications.find({"candidate_id": current_user['_id']}))
    results = []
    for s in screenings:
        job, _ = find_job_anywhere(s['job_id'])
        results.append({
            "id": str(s['_id']),
            "jobId": str(s['job_id']),
            "jobTitle": job['title'] if job else "Unknown",
            "company": job['company_name'] if job else "Unknown",
            "appliedDate": s['applied_at'].strftime("%Y-%m-%d") if hasattr(s.get('applied_at'), 'strftime') else "",
            "appliedAt": s['applied_at'].isoformat() if hasattr(s.get('applied_at'), 'isoformat') else str(s.get('applied_at', '')),
            "status": s['status'],
            "score": s['score'],
            "candidateName": current_user.get('name', ''),
            "candidateEmail": current_user.get('email', ''),
            "missingSkills": s.get('details', {}).get('missing_skills', []),
        })
    return jsonify(results)

@app.route('/api/applications/job/<job_id>', methods=['GET'])
@token_required
def get_job_applications(current_user, job_id):
    """HR fetches all applications for a specific job."""
    if current_user.get('role') not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    try:
        apps = list(db.applications.find({"job_id": ObjectId(job_id)}))
        results = []
        for a in apps:
            candidate = db.users.find_one({"_id": a['candidate_id']})
            results.append({
                "id": str(a['_id']),
                "jobId": str(a['job_id']),
                "jobTitle": a.get('job_title', ''),
                "company": a.get('company', ''),
                "appliedDate": a['applied_at'].strftime("%Y-%m-%d") if hasattr(a.get('applied_at'), 'strftime') else "",
                "appliedAt": a['applied_at'].isoformat() if hasattr(a.get('applied_at'), 'isoformat') else str(a.get('applied_at', '')),
                "status": a.get('status', 'pending'),
                "score": a.get('score', 0),
                "candidateName": a.get('candidate_name', candidate.get('name', '') if candidate else ''),
                "candidateEmail": a.get('candidate_email', candidate.get('email', '') if candidate else ''),
                "missingSkills": a.get('details', {}).get('missing_skills', []),
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications/<app_id>/status', methods=['PUT'])
@token_required
def update_application_status(current_user, app_id):
    """HR updates a candidate's application status and notifies the candidate."""
    if current_user.get('role') not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    try:
        data = request.get_json()
        new_status = data.get('status', '').lower().strip()
        valid = ['pending', 'reviewed', 'shortlisted', 'rejected']
        if new_status not in valid:
            return jsonify({'error': f'Invalid status. Must be one of: {valid}'}), 400

        # Update the application
        result = db.applications.update_one(
            {"_id": ObjectId(app_id)},
            {"$set": {"status": new_status, "updated_at": datetime.datetime.utcnow()}}
        )
        if result.matched_count == 0:
            return jsonify({'error': 'Application not found'}), 404

        # Fetch the application to get candidate info and job info
        app_doc = db.applications.find_one({"_id": ObjectId(app_id)})
        job_doc, _ = find_job_anywhere(app_doc['job_id']) if app_doc else (None, None)

        # Create a notification for the candidate
        if app_doc:
            status_icons = {
                'shortlisted': '🎉',
                'rejected': '❌',
                'reviewed': '👁️',
                'pending': '⏳',
            }
            status_msgs = {
                'shortlisted': f"Congratulations! You have been shortlisted for {job_doc.get('title', 'the role')} at {job_doc.get('company_name', 'the company')}.",
                'rejected': f"Your application for {job_doc.get('title', 'the role')} at {job_doc.get('company_name', 'the company')} was not selected at this time.",
                'reviewed': f"Your application for {job_doc.get('title', 'the role')} has been reviewed by the hiring team.",
                'pending': f"Your application for {job_doc.get('title', 'the role')} status has been updated to pending.",
            }
            icon = status_icons.get(new_status, '📋')
            message = status_msgs.get(new_status, f"Your application status was updated to {new_status}.")

            db.notifications.insert_one({
                "user_id": app_doc['candidate_id'],
                "title": f"{icon} Application Status Update — {job_doc.get('company_name', 'Company') if job_doc else 'Company'}",
                "message": message,
                "type": "status_update",
                "application_id": ObjectId(app_id),
                "new_status": new_status,
                "is_read": False,
                "created_at": datetime.datetime.utcnow()
            })

        return jsonify({
            'message': f'Status updated to {new_status}',
            'applicationId': app_id,
            'status': new_status
        }), 200

    except Exception as e:
        print(f"Status update error: {e}")
        return jsonify({'error': str(e)}), 500


# ─────────────────────────────────────────────────────────────
# NEW: Notifications Endpoints  (collection: notifications)
# ─────────────────────────────────────────────────────────────
@app.route('/api/notifications/my', methods=['GET'])
@token_required
def get_my_notifications(current_user):
    """Fetch all notifications for the logged-in user, newest first."""
    notifs = list(db.notifications.find(
        {"user_id": current_user['_id']},
        sort=[("created_at", -1)]
    ).limit(20))
    results = []
    for n in notifs:
        # Handle created_at whether stored as datetime or string
        created_at_raw = n.get('created_at')
        if hasattr(created_at_raw, 'strftime'):
            created_at_str = created_at_raw.strftime("%Y-%m-%d %H:%M")
        elif created_at_raw:
            created_at_str = str(created_at_raw)[:16]
        else:
            created_at_str = ""
        results.append({
            "id": str(n['_id']),
            "title": n.get('title', ''),
            "message": n.get('message', ''),
            "type": n.get('type', 'info'),
            "is_read": n.get('is_read', False),
            "created_at": created_at_str
        })
    return jsonify(results)

@app.route('/api/notifications/<notif_id>/read', methods=['PATCH'])
@token_required
def mark_notification_read(current_user, notif_id):
    """Mark a single notification as read."""
    db.notifications.update_one(
        {"_id": ObjectId(notif_id), "user_id": current_user['_id']},
        {"$set": {"is_read": True}}
    )
    return jsonify({"success": True})

@app.route('/api/notifications/clear', methods=['DELETE'])
@token_required
def clear_notifications(current_user):
    """Delete all notifications for the logged-in user."""
    db.notifications.delete_many({"user_id": current_user['_id']})
    return jsonify({"success": True})

# ─────────────────────────────────────────────────────────────
# NEW: Skill Tags Endpoints  (collection: skill_tags)
# ─────────────────────────────────────────────────────────────
@app.route('/api/skills', methods=['GET'])
def get_skills():
    """Return all skills from the master taxonomy, optionally filtered by category."""
    category = request.args.get('category')
    query = {"category": category} if category else {}
    skills = list(db.skill_tags.find(query, {"_id": 0}))
    return jsonify(skills)

@app.route('/api/skills/search', methods=['GET'])
def search_skills():
    """Search skills by prefix for autocomplete in the job form."""
    q = request.args.get('q', '')
    if not q:
        return jsonify([])
    skills = list(db.skill_tags.find(
        {"name": {"$regex": f"^{q}", "$options": "i"}},
        {"_id": 0, "name": 1, "category": 1}
    ).limit(10))
    return jsonify(skills)

@app.route('/api/skills/stats', methods=['GET'])
@token_required
def get_skills_stats(current_user):
    """Return the top 10 most demanded skills across all benchmark jobs (for HR dashboard)."""
    if current_user['role'] not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403

    pipeline = [
        {"$project": {"all_skills": {"$concatArrays": ["$mandatory_skills", "$preferred_skills"]}}},
        {"$unwind": "$all_skills"},
        {"$group": {"_id": "$all_skills", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
        {"$project": {"skill": "$_id", "count": 1, "_id": 0}}
    ]
    stats_benchmarks = list(db.jobs.aggregate(pipeline))
    stats_live = list(db.live_jobs.aggregate(pipeline))
    
    # Merge
    merged = {}
    for s in stats_benchmarks + stats_live:
        skill = s['skill']
        merged[skill] = merged.get(skill, 0) + s['count']
    
    # Re-sort and limit to 10
    final_stats = [{"skill": k, "count": v} for k, v in merged.items()]
    final_stats.sort(key=lambda x: x['count'], reverse=True)
    return jsonify(final_stats[:10])

# ─────────────────────────────────────────────────────────────
# Admin Analytics
# ─────────────────────────────────────────────────────────────
@app.route('/api/admin/analytics', methods=['GET'])
@token_required
def get_analytics(current_user):
    if current_user['role'] not in ['hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
        
    total_candidates = db.users.count_documents({"role": "candidate"})
    total_screenings = db.applications.count_documents({})
    
    # Aggregate from Benchmarks
    company_stats_bench = list(db.applications.aggregate([
        {"$lookup": {"from": "jobs", "localField": "job_id", "foreignField": "_id", "as": "job"}},
        {"$unwind": "$job"},
        {"$group": {"_id": "$job.company_name", "count": {"$sum": 1}}}
    ]))
    
    # Aggregate from Live Jobs
    company_stats_live = list(db.applications.aggregate([
        {"$lookup": {"from": "live_jobs", "localField": "job_id", "foreignField": "_id", "as": "job"}},
        {"$unwind": "$job"},
        {"$group": {"_id": "$job.company_name", "count": {"$sum": 1}}}
    ]))

    # Merge
    merged_companies = {}
    for c in company_stats_bench + company_stats_live:
        name = c['_id']
        merged_companies[name] = merged_companies.get(name, 0) + c['count']
    
    company_stats = [{"_id": k, "count": v} for k, v in merged_companies.items()]
    
    top_ranked = list(db.applications.find().sort("score", -1).limit(5))
    for t in top_ranked:
        t['id'] = str(t['_id'])
        del t['_id']
        t['job_id'] = str(t['job_id'])
        t['candidate_id'] = str(t['candidate_id'])
        
    return jsonify({
        "total_candidates": total_candidates,
        "total_screenings": total_screenings,
        "company_stats": company_stats,
        "top_ranked": top_ranked
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
