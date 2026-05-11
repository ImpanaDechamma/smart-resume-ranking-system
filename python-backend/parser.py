import os
import re
from pdfminer.high_level import extract_text as extract_pdf_text
import docx

def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        return extract_pdf_text(file_path)
    elif ext == '.docx':
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    return ""

def parse_resume(text):
    # ── Email ───────────────────────────────────────────────────────────────
    email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_regex, text)
    email = emails[0] if emails else "Unknown"

    # ── Comprehensive Skills List ────────────────────────────────────────────
    # Covers all skills used across all 21 benchmark jobs + common extras
    ALL_SKILLS = [
        # Programming Languages
        "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "Swift",
        "Kotlin", "Go", "Rust", "R", "Scala", "Elixir", "PHP", "Ruby",
        "Objective-C", "MATLAB", "Perl", "Bash", "PowerShell",
        # Web & Frontend
        "React", "Next.js", "Vue.js", "Angular", "HTML", "CSS",
        "Tailwind CSS", "Tailwind", "Bootstrap", "SASS", "SCSS",
        "Server Side Rendering", "Design Systems", "Web Performance",
        # Backend & APIs
        "Node.js", "Express", "Spring Boot", "Django", "Flask",
        ".NET Core", "GraphQL", "REST APIs", "Microservices", "Web APIs",
        "FastAPI", "Kafka", "RabbitMQ",
        # Databases
        "MongoDB", "SQL", "PL/SQL", "PostgreSQL", "MySQL", "Oracle DB",
        "SQL Server", "DynamoDB", "Cassandra", "Redis", "CosmosDB",
        "SQLite", "Elasticsearch",
        # Cloud & DevOps
        "AWS", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes",
        "Terraform", "Ansible", "CI/CD", "Jenkins", "Powershell",
        "Linux", "Networking", "Security", "Git", "GitHub", "GitLab",
        # AI / ML / Data
        "Machine Learning", "Deep Learning", "Neural Networks", "NLP",
        "Computer Vision", "PyTorch", "TensorFlow", "Scikit-Learn",
        "Pandas", "NumPy", "CUDA", "Recommendation Systems", "Qiskit",
        "Quantum Physics", "Big Data", "Spark", "Hadoop",
        # Data Science
        "Statistics", "Predictive Modeling", "Data Analysis",
        "Data Visualization", "Tableau", "Power BI",
        # Algorithms & CS Fundamentals
        "Data Structures", "Algorithms", "OOP Design",
        "Distributed Systems", "System Design",
        # Design & UX
        "Figma", "Adobe XD", "Adobe Creative Cloud", "User Research",
        "Interaction Design", "Prototyping", "UI Components",
        "Visual Design", "Motion Design", "Storyboarding",
        # Mobile
        "iOS SDK", "Xcode", "SwiftUI", "Android SDK", "React Native",
        "Flutter", "Core Animation", "Combine", "Metal",
        # Hardware & Systems
        "Verilog", "VLSI", "FPGA", "ASIC Design", "Real-time Systems",
        "Embedded Systems", "Aerospace Systems", "Control Systems",
        # Cloud Architecture & Enterprise
        "Cloud Architecture", "CRM", "Apex", "LWC", "WebRTC",
        "Performance Tuning", "Backup & Recovery", "Cloud Infrastructure",
        "Signal Integrity", "GPU Architecture",
        # Soft Skills / Management
        "Product Strategy", "Agile", "Scrum", "Communication",
        "Problem Solving", "Client Relations", "Project Management",
        # Messaging & Streaming
        "Messaging Queues", "Chaos Engineering",
    ]

    # Store found skills in LOWERCASE so comparisons are always consistent
    text_lower = text.lower()
    skills_found = []
    for skill in ALL_SKILLS:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            skills_found.append(skill.lower())  # store lowercase

    # ── CGPA Extraction ──────────────────────────────────────────────────────
    # Patterns: "CGPA: 8.5", "GPA: 3.9", "CGPA 8.5/10", "Cumulative GPA 8.5"
    cgpa = 0.0
    cgpa_patterns = [
        r'cgpa[\s:]+(\d+(?:\.\d+)?)',
        r'gpa[\s:]+(\d+(?:\.\d+)?)',
        r'cumulative\s+gpa[\s:]+(\d+(?:\.\d+)?)',
        r'(\d+(?:\.\d+)?)\s*/\s*10',      # e.g. "8.5/10"
        r'(\d+(?:\.\d+)?)\s*/\s*4(?:\.0)?', # e.g. "3.8/4.0"
    ]
    for pat in cgpa_patterns:
        m = re.search(pat, text_lower)
        if m:
            val = float(m.group(1))
            # If it looks like a 4.0 scale, convert to 10.0 scale
            if val <= 4.0 and '/4' not in text_lower:
                cgpa = round(val * 2.5, 2)
            else:
                cgpa = val
            break

    # ── Experience Extraction ───────────────────────────────────────────────
    # Patterns: "5 years of experience", "3+ years", "2 yrs experience"
    experience = 0
    exp_patterns = [
        r'(\d+)\s*\+?\s*years?\s+of\s+experience',
        r'(\d+)\s*\+?\s*yrs?\s+experience',
        r'experience\s+of\s+(\d+)\s+years?',
        r'(\d+)\s*\+?\s*years?\s+(?:in|of|working)',
    ]
    for pat in exp_patterns:
        m = re.search(pat, text_lower)
        if m:
            experience = int(m.group(1))
            break
    
    # Fallback: count how many distinct "work experience" sections exist
    if experience == 0:
        work_sections = re.findall(
            r'\b(20\d{2})\b.*?\b(20\d{2}|present|current)\b',
            text_lower
        )
        experience = len(work_sections)

    # ── Name Extraction ──────────────────────────────────────────────────────
    # Very simple heuristic: first non-empty line that looks like a name
    name = "Unknown"
    for line in text.strip().splitlines():
        line = line.strip()
        if line and len(line.split()) in (2, 3) and line.replace(" ", "").isalpha():
            name = line
            break

    return {
        "email": email,
        "name": name,
        "skills": skills_found,   # list of LOWERCASE skill strings
        "cgpa": cgpa,
        "experience": experience,
    }
