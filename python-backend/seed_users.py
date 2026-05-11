import os
import bcrypt
import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/smart_resume_ranking")
client = MongoClient(MONGO_URI)
db = client.get_database()

def seed_users():
    print("Seeding demo users...")
    
    demo_users = [
        {
            "name": "HR Manager",
            "email": "hr@company.com",
            "password": "hr123",
            "role": "hr"
        },
        {
            "name": "John Candidate",
            "email": "candidate@email.com",
            "password": "cand123",
            "role": "candidate"
        }
    ]
    
    for user_data in demo_users:
        existing = db.users.find_one({"email": user_data["email"]})
        hashed_pw = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt())
        
        user_doc = {
            "name": user_data["name"],
            "email": user_data["email"],
            "password": hashed_pw, # Stored as bytes (Binary in MongoDB)
            "role": user_data["role"],
            "created_at": datetime.datetime.utcnow()
        }
        
        if existing:
            db.users.update_one({"email": user_data["email"]}, {"$set": user_doc})
            print(f"Updated user: {user_data['email']}")
        else:
            db.users.insert_one(user_doc)
            print(f"Created user: {user_data['email']}")

    print("User seeding complete!")

if __name__ == "__main__":
    seed_users()
