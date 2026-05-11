import pymongo
from bson import ObjectId
import datetime

def seed_benchmarks():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["smart_resume_ranking"]
    
    print("Clearing existing benchmarks...")
    db.jobs.delete_many({})
    db.companies.delete_many({})
    db.applications.delete_many({})

    def get_logo(domain):
        return f"https://www.google.com/s2/favicons?domain={domain}&sz=128"

    # Benchmark Companies & Jobs (Top Tier Simulation)
    companies = [
        {
            "name": "Google",
            "logo": get_logo("google.com"),
            "jobs": [
                {
                    "title": "Software Engineer",
                    "mandatory_skills": ["Java", "Python", "C++", "Data Structures", "Algorithms"],
                    "preferred_skills": ["Distributed Systems", "Cloud Computing", "Machine Learning"],
                    "min_cgpa": 8.0,
                    "experience": 0,
                    "description": "Develop next-generation technologies that change how billions of users connect.",
                    "banner": "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Microsoft",
            "logo": get_logo("microsoft.com"),
            "jobs": [
                {
                    "title": "Azure Cloud Engineer",
                    "mandatory_skills": ["Azure", "Networking", "Security", "Powershell", "Python"],
                    "preferred_skills": ["Kubernetes", "Docker", "Terraform"],
                    "min_cgpa": 7.5,
                    "experience": 3,
                    "description": "Design and implement complex cloud architectures on Microsoft Azure.",
                    "banner": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Amazon",
            "logo": get_logo("amazon.com"),
            "jobs": [
                {
                    "title": "SDE - II",
                    "mandatory_skills": ["Java", "Distributed Systems", "SQL", "OOP Design"],
                    "preferred_skills": ["AWS", "DynamoDB", "Messaging Queues"],
                    "min_cgpa": 7.5,
                    "experience": 3,
                    "description": "Build high-scale systems that power the world's most customer-centric company.",
                    "banner": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Apple",
            "logo": get_logo("apple.com"),
            "jobs": [
                {
                    "title": "iOS Developer",
                    "mandatory_skills": ["Swift", "SwiftUI", "Objective-C", "iOS SDK", "Xcode"],
                    "preferred_skills": ["Core Animation", "Combine", "Metal"],
                    "min_cgpa": 8.0,
                    "experience": 2,
                    "description": "Create amazing apps for iPhone, iPad, and Mac.",
                    "banner": "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Netflix",
            "logo": get_logo("netflix.com"),
            "jobs": [
                {
                    "title": "Backend Engineer",
                    "mandatory_skills": ["Java", "Spring Boot", "Microservices", "Cassandra", "Kafka"],
                    "preferred_skills": ["Chaos Engineering", "Performance Tuning"],
                    "min_cgpa": 7.5,
                    "experience": 5,
                    "description": "Help us entertain millions of people around the world.",
                    "banner": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Meta",
            "logo": get_logo("meta.com"),
            "jobs": [
                {
                    "title": "Product Manager",
                    "mandatory_skills": ["Product Strategy", "Data Analysis", "User Research", "Agile", "Roadmap"],
                    "preferred_skills": ["SQL", "A/B Testing", "Mobile Experience"],
                    "min_cgpa": 8.0,
                    "experience": 4,
                    "description": "Build the future of social connection and the metaverse.",
                    "banner": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Tesla",
            "logo": get_logo("tesla.com"),
            "jobs": [
                {
                    "title": "Autopilot Engineer",
                    "mandatory_skills": ["C++", "Python", "Deep Learning", "Computer Vision", "Control Systems"],
                    "preferred_skills": ["PyTorch", "CUDA", "Robotics"],
                    "min_cgpa": 9.0,
                    "experience": 3,
                    "description": "Develop the brain of autonomous driving vehicles.",
                    "banner": "https://images.unsplash.com/photo-1562184552-997c461abbe6?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Adobe",
            "logo": get_logo("adobe.com"),
            "jobs": [
                {
                    "title": "UX Designer",
                    "mandatory_skills": ["Figma", "Interaction Design", "User Psychology", "Visual Design"],
                    "preferred_skills": ["Adobe Creative Cloud", "Prototyping"],
                    "min_cgpa": 7.0,
                    "experience": 2,
                    "description": "Create intuitive experiences for Adobe's creative suite.",
                    "banner": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "NVIDIA",
            "logo": get_logo("nvidia.com"),
            "jobs": [
                {
                    "title": "AI Researcher",
                    "mandatory_skills": ["Machine Learning", "Neural Networks", "Python", "C++", "PyTorch"],
                    "preferred_skills": ["CUDA", "GPU Architecture", "NLP"],
                    "min_cgpa": 9.0,
                    "experience": 0,
                    "description": "Push the boundaries of AI research with NVIDIA's powerful compute.",
                    "banner": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Spotify",
            "logo": get_logo("spotify.com"),
            "jobs": [
                {
                    "title": "Full Stack Engineer",
                    "mandatory_skills": ["React", "Java", "Python", "Node.js", "SQL"],
                    "preferred_skills": ["Google Cloud", "Microservices", "Audio Engineering"],
                    "min_cgpa": 7.5,
                    "experience": 3,
                    "description": "Build the platforms that bring music and podcasts to everyone.",
                    "banner": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Uber",
            "logo": get_logo("uber.com"),
            "jobs": [
                {
                    "title": "Data Scientist",
                    "mandatory_skills": ["Statistics", "Python", "R", "SQL", "Predictive Modeling"],
                    "preferred_skills": ["Big Data", "Spark", "Econimics"],
                    "min_cgpa": 8.0,
                    "experience": 2,
                    "description": "Solve complex transportation problems with data science.",
                    "banner": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Airbnb",
            "logo": get_logo("airbnb.com"),
            "jobs": [
                {
                    "title": "Frontend Engineer",
                    "mandatory_skills": ["React", "TypeScript", "JavaScript", "CSS", "Design Systems"],
                    "preferred_skills": ["Next.js", "Server Side Rendering", "Accessiblity"],
                    "min_cgpa": 7.5,
                    "experience": 3,
                    "description": "Build beautiful and performant web experiences for hosts and guests.",
                    "banner": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Slack",
            "logo": get_logo("slack.com"),
            "jobs": [
                {
                    "title": "Customer Success Manager",
                    "mandatory_skills": ["Client Relations", "Strategy", "Communication", "Problem Solving"],
                    "preferred_skills": ["SaaS", "Project Management", "Technical Support"],
                    "min_cgpa": 6.5,
                    "experience": 3,
                    "description": "Help organizations transform their communication with Slack.",
                    "banner": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Salesforce",
            "logo": get_logo("salesforce.com"),
            "jobs": [
                {
                    "title": "Cloud Architect",
                    "mandatory_skills": ["Cloud Architecture", "CRM", "Java", "Security", "Networking"],
                    "preferred_skills": ["Apex", "LWC", "AWS"],
                    "min_cgpa": 7.5,
                    "experience": 5,
                    "description": "Design enterprise-grade solutions on the Salesforce platform.",
                    "banner": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Oracle",
            "logo": get_logo("oracle.com"),
            "jobs": [
                {
                    "title": "Database Engineer",
                    "mandatory_skills": ["SQL", "PL/SQL", "Oracle DB", "Performance Tuning", "Backup & Recovery"],
                    "preferred_skills": ["Cloud Infrastructure", "NoSQL", "Python"],
                    "min_cgpa": 7.0,
                    "experience": 4,
                    "description": "Build the most powerful database systems in the world.",
                    "banner": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Intel",
            "logo": get_logo("intel.com"),
            "jobs": [
                {
                    "title": "Hardware Engineer",
                    "mandatory_skills": ["Verilog", "VLSI", "Architecture", "FPGA", "Python"],
                    "preferred_skills": ["ASIC Design", "Signal Integrity"],
                    "min_cgpa": 8.5,
                    "experience": 0,
                    "description": "Design the processors that power the digital world.",
                    "banner": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "IBM",
            "logo": get_logo("ibm.com"),
            "jobs": [
                {
                    "title": "Quantum Researcher",
                    "mandatory_skills": ["Quantum Physics", "Algorithms", "Python", "Qiskit", "Mathematics"],
                    "preferred_skills": ["Research Papers", "C++", "Complex Analysis"],
                    "min_cgpa": 9.5,
                    "experience": 0,
                    "description": "Build the world's first practical quantum computers.",
                    "banner": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "SpaceX",
            "logo": get_logo("spacex.com"),
            "jobs": [
                {
                    "title": "Flight Software Engineer",
                    "mandatory_skills": ["C++", "Linux", "Real-time Systems", "Python", "Physics"],
                    "preferred_skills": ["Aerospace Systems", "Embedded Systems"],
                    "min_cgpa": 9.0,
                    "experience": 2,
                    "description": "Build the software that powers rockets and spacecraft.",
                    "banner": "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Discord",
            "logo": get_logo("discord.com"),
            "jobs": [
                {
                    "title": "Infra Engineer",
                    "mandatory_skills": ["Rust", "Elixir", "Python", "Kubernetes", "Redis"],
                    "preferred_skills": ["Distributed Systems", "WebRTC"],
                    "min_cgpa": 7.5,
                    "experience": 4,
                    "description": "Scale the platform that connects millions of gamers and communities.",
                    "banner": "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "TikTok",
            "logo": get_logo("tiktok.com"),
            "jobs": [
                {
                    "title": "Algorithm Engineer",
                    "mandatory_skills": ["Recommendation Systems", "Machine Learning", "Big Data", "Java", "Python"],
                    "preferred_skills": ["Deep Learning", "Spark"],
                    "min_cgpa": 8.5,
                    "experience": 2,
                    "description": "Optimize the algorithms that power the world's most engaging content feed.",
                    "banner": "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "Dropbox",
            "logo": get_logo("dropbox.com"),
            "jobs": [
                {
                    "title": "Product Designer",
                    "mandatory_skills": ["Product Design", "Figma", "User Journey", "UI Components"],
                    "preferred_skills": ["Interaction Design", "Design Thinking"],
                    "min_cgpa": 7.0,
                    "experience": 3,
                    "description": "Design simpler, more meaningful ways for people to work together.",
                    "banner": "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        }
    ]

    active_jobs = [
        {
            "name": "StartupX",
            "logo": get_logo("startup.com"),
            "jobs": [
                {
                    "title": "Full Stack Developer",
                    "mandatory_skills": ["React", "Node.js", "MongoDB", "Express"],
                    "preferred_skills": ["Tailwind CSS", "AWS"],
                    "min_cgpa": 7.0,
                    "experience": 1,
                    "description": "Join our fast-paced startup and build the future of fintech.",
                    "banner": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000"
                },
                {
                    "title": "UI/UX Designer",
                    "mandatory_skills": ["Figma", "User Research", "Adobe XD", "Prototyping"],
                    "preferred_skills": ["Motion Design", "Storyboarding"],
                    "min_cgpa": 0.0,
                    "experience": 2,
                    "description": "Design beautiful and functional interfaces for our global user base.",
                    "banner": "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        },
        {
            "name": "GlobalTech Solutions",
            "logo": get_logo("globaltech.com"),
            "jobs": [
                {
                    "title": "Data Scientist",
                    "mandatory_skills": ["Python", "Machine Learning", "Pandas", "Scikit-Learn"],
                    "preferred_skills": ["TensorFlow", "NLP"],
                    "min_cgpa": 8.5,
                    "experience": 2,
                    "description": "Help us derive insights from massive datasets using state-of-the-art AI.",
                    "banner": "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=1000"
                }
            ]
        }
    ]

    print("Seeding benchmark simulations...")
    for comp_data in companies:
        company_id = db.companies.insert_one({
            "name": comp_data["name"],
            "logo": comp_data["logo"],
            "banner": comp_data["jobs"][0]["banner"]
        }).inserted_id
        
        for job_data in comp_data["jobs"]:
            db.jobs.insert_one({
                "company_id": company_id,
                "company_name": comp_data["name"],
                "title": job_data["title"],
                "mandatory_skills": job_data["mandatory_skills"],
                "preferred_skills": job_data["preferred_skills"],
                "min_cgpa": job_data["min_cgpa"],
                "experience": job_data["experience"],
                "description": job_data["description"],
                "is_benchmark": True,
                "banner": job_data["banner"],
                "logo": comp_data["logo"]
            })

    print("Seeding active job openings...")
    for comp_data in active_jobs:
        company_id = db.companies.insert_one({
            "name": comp_data["name"],
            "logo": comp_data["logo"],
            "banner": comp_data["jobs"][0]["banner"]
        }).inserted_id
        
        for job_data in comp_data["jobs"]:
            db.jobs.insert_one({
                "company_id": company_id,
                "company_name": comp_data["name"],
                "title": job_data["title"],
                "mandatory_skills": job_data["mandatory_skills"],
                "preferred_skills": job_data["preferred_skills"],
                "min_cgpa": job_data["min_cgpa"],
                "experience": job_data["experience"],
                "description": job_data["description"],
                "is_benchmark": False,
                "banner": job_data["banner"],
                "logo": comp_data["logo"]
            })
            
    print("Seeding complete!")

if __name__ == "__main__":
    seed_benchmarks()
