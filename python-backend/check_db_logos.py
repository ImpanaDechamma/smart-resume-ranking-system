import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["smart_resume_ranking"]

print("=== JOB INSPECTOR ===")
all_jobs = list(db.jobs.find())
print(f"Total jobs in database: {len(all_jobs)}")

for job in all_jobs:
    jtype = "BENCHMARK" if job.get("is_benchmark") else "LIVE JOB"
    print(f"[{jtype}] Company: {job.get('company_name')} | Title: {job.get('title')}")
    print(f"   ID: {job.get('_id')}")
    print(f"   Logo: {job.get('logo')[:50]}...")
    print("-" * 30)
