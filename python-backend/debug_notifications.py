import pymongo
from bson import ObjectId

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["smart_resume_ranking"]

print("=== NOTIFICATIONS COLLECTION ===")
count = db.notifications.count_documents({})
print(f"Total notifications in DB: {count}")

latest = list(db.notifications.find().sort("_id", -1).limit(5))
for n in latest:
    print("---")
    uid = n.get("user_id")
    print(f"  user_id type: {type(uid).__name__} = {uid}")
    print(f"  is_read: {n.get('is_read')}")
    print(f"  type field: {n.get('type')}")

print("\n=== USERS ===")
users = list(db.users.find({}, {"_id": 1, "email": 1, "role": 1}))
for u in users:
    print(f"  _id type: {type(u['_id']).__name__} = {u['_id']} | {u.get('email')} | {u.get('role')}")

print("\n=== MATCH TEST ===")
for u in users:
    matched = db.notifications.count_documents({"user_id": u["_id"]})
    matched_str = db.notifications.count_documents({"user_id": str(u["_id"])})
    print(f"  user {u.get('email')}: ObjectId match={matched}, string match={matched_str}")

print("\n=== APPLICATION candidate_id types ===")
apps = list(db.applications.find({}, {"candidate_id": 1, "status": 1}).limit(3))
for a in apps:
    cid = a.get("candidate_id")
    print(f"  candidate_id type={type(cid).__name__} val={cid} status={a.get('status')}")
