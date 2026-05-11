import pymongo
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["smart_resume_ranking"]

# Find jobs that are NOT benchmarks
live_jobs = list(db.jobs.find({"is_benchmark": {"$ne": True}}))
print(f"Found {len(live_jobs)} live jobs in the main collection.")

if live_jobs:
    # Insert into live_jobs collection
    db.live_jobs.insert_many(live_jobs)
    # Remove from main jobs collection
    db.jobs.delete_many({"is_benchmark": {"$ne": True}})
    print(f"Successfully migrated {len(live_jobs)} jobs to 'live_jobs' collection.")
else:
    print("No live jobs to migrate.")
