import pymongo

def seed_skill_tags():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["smart_resume_ranking"]
    
    print("Seeding skill_tags collection...")
    db.skill_tags.drop()

    skills = [
        # ── Programming Languages
        {"name": "Python", "category": "Programming"},
        {"name": "Java", "category": "Programming"},
        {"name": "C++", "category": "Programming"},
        {"name": "C#", "category": "Programming"},
        {"name": "JavaScript", "category": "Programming"},
        {"name": "TypeScript", "category": "Programming"},
        {"name": "Swift", "category": "Programming"},
        {"name": "Kotlin", "category": "Programming"},
        {"name": "Go", "category": "Programming"},
        {"name": "Rust", "category": "Programming"},
        {"name": "R", "category": "Programming"},
        {"name": "Scala", "category": "Programming"},
        {"name": "Elixir", "category": "Programming"},
        {"name": "PHP", "category": "Programming"},
        {"name": "Ruby", "category": "Programming"},

        # ── Web & Frontend
        {"name": "React", "category": "Frontend"},
        {"name": "Next.js", "category": "Frontend"},
        {"name": "Vue.js", "category": "Frontend"},
        {"name": "Angular", "category": "Frontend"},
        {"name": "HTML", "category": "Frontend"},
        {"name": "CSS", "category": "Frontend"},
        {"name": "Tailwind CSS", "category": "Frontend"},
        {"name": "Design Systems", "category": "Frontend"},
        {"name": "Web Performance", "category": "Frontend"},
        {"name": "Server Side Rendering", "category": "Frontend"},

        # ── Backend & APIs
        {"name": "Node.js", "category": "Backend"},
        {"name": "Express", "category": "Backend"},
        {"name": "Spring Boot", "category": "Backend"},
        {"name": "Django", "category": "Backend"},
        {"name": "Flask", "category": "Backend"},
        {"name": ".NET Core", "category": "Backend"},
        {"name": "GraphQL", "category": "Backend"},
        {"name": "REST APIs", "category": "Backend"},
        {"name": "Microservices", "category": "Backend"},
        {"name": "Web APIs", "category": "Backend"},

        # ── Databases
        {"name": "MongoDB", "category": "Database"},
        {"name": "SQL", "category": "Database"},
        {"name": "PL/SQL", "category": "Database"},
        {"name": "PostgreSQL", "category": "Database"},
        {"name": "MySQL", "category": "Database"},
        {"name": "Oracle DB", "category": "Database"},
        {"name": "SQL Server", "category": "Database"},
        {"name": "DynamoDB", "category": "Database"},
        {"name": "Cassandra", "category": "Database"},
        {"name": "Redis", "category": "Database"},
        {"name": "CosmosDB", "category": "Database"},

        # ── Cloud & DevOps
        {"name": "AWS", "category": "Cloud"},
        {"name": "Azure", "category": "Cloud"},
        {"name": "Google Cloud", "category": "Cloud"},
        {"name": "Docker", "category": "DevOps"},
        {"name": "Kubernetes", "category": "DevOps"},
        {"name": "Terraform", "category": "DevOps"},
        {"name": "CI/CD", "category": "DevOps"},
        {"name": "Powershell", "category": "DevOps"},
        {"name": "Linux", "category": "DevOps"},
        {"name": "Networking", "category": "DevOps"},
        {"name": "Security", "category": "DevOps"},

        # ── AI / ML / Data
        {"name": "Machine Learning", "category": "AI/ML"},
        {"name": "Deep Learning", "category": "AI/ML"},
        {"name": "Neural Networks", "category": "AI/ML"},
        {"name": "NLP", "category": "AI/ML"},
        {"name": "Computer Vision", "category": "AI/ML"},
        {"name": "PyTorch", "category": "AI/ML"},
        {"name": "TensorFlow", "category": "AI/ML"},
        {"name": "Scikit-Learn", "category": "AI/ML"},
        {"name": "Pandas", "category": "AI/ML"},
        {"name": "CUDA", "category": "AI/ML"},
        {"name": "Recommendation Systems", "category": "AI/ML"},
        {"name": "Qiskit", "category": "AI/ML"},

        # ── Data Engineering
        {"name": "Big Data", "category": "Data"},
        {"name": "Spark", "category": "Data"},
        {"name": "Kafka", "category": "Data"},
        {"name": "Statistics", "category": "Data"},
        {"name": "Predictive Modeling", "category": "Data"},

        # ── Design
        {"name": "Figma", "category": "Design"},
        {"name": "Adobe XD", "category": "Design"},
        {"name": "Adobe Creative Cloud", "category": "Design"},
        {"name": "User Research", "category": "Design"},
        {"name": "Interaction Design", "category": "Design"},
        {"name": "Prototyping", "category": "Design"},
        {"name": "UI Components", "category": "Design"},
        {"name": "Visual Design", "category": "Design"},
        {"name": "Motion Design", "category": "Design"},

        # ── Mobile
        {"name": "iOS SDK", "category": "Mobile"},
        {"name": "Xcode", "category": "Mobile"},
        {"name": "SwiftUI", "category": "Mobile"},
        {"name": "Objective-C", "category": "Mobile"},
        {"name": "Android SDK", "category": "Mobile"},

        # ── Hardware / Systems
        {"name": "Verilog", "category": "Hardware"},
        {"name": "VLSI", "category": "Hardware"},
        {"name": "FPGA", "category": "Hardware"},
        {"name": "ASIC Design", "category": "Hardware"},
        {"name": "Real-time Systems", "category": "Hardware"},
        {"name": "Embedded Systems", "category": "Hardware"},

        # ── Soft Skills / Management
        {"name": "Product Strategy", "category": "Management"},
        {"name": "Agile", "category": "Management"},
        {"name": "Scrum", "category": "Management"},
        {"name": "Communication", "category": "Soft Skills"},
        {"name": "Problem Solving", "category": "Soft Skills"},
        {"name": "Data Structures", "category": "Computer Science"},
        {"name": "Algorithms", "category": "Computer Science"},
        {"name": "OOP Design", "category": "Computer Science"},
        {"name": "Distributed Systems", "category": "Computer Science"},
        {"name": "Quantum Physics", "category": "Science"},
        {"name": "Mathematics", "category": "Science"},
        {"name": "Physics", "category": "Science"},
    ]

    db.skill_tags.insert_many(skills)
    print(f"Inserted {len(skills)} skill tags.")
    
    # Create index for fast prefix search
    db.skill_tags.create_index([("name", pymongo.ASCENDING)])
    print("Created index on skill_tags.name")
    print("Done!")

if __name__ == "__main__":
    seed_skill_tags()
