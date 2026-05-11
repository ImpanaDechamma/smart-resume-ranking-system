from parser import parse_resume

# Simulate a Software Engineer resume
sample_resume = """
John Smith
john.smith@email.com

EDUCATION
B.Tech in Computer Science
CGPA: 8.7/10

EXPERIENCE
Software Engineer - TechCorp (2021 - Present)
Junior Developer - StartupABC (2019 - 2021)
2 years of experience in backend development

SKILLS
Python, Java, C++, Data Structures, Algorithms, SQL, AWS, Docker,
Machine Learning, React, Node.js, Distributed Systems

CERTIFICATIONS
AWS Certified Developer
"""

result = parse_resume(sample_resume)
print("=== PARSER RESULTS ===")
print(f"Email:      {result['email']}")
print(f"CGPA:       {result['cgpa']}")
print(f"Experience: {result['experience']} years")
print(f"Skills ({len(result['skills'])} found):")
for s in result['skills']:
    print(f"  - {s}")

# Simulate scoring against Google's job
google_job = {
    "mandatory_skills": ["Java", "Python", "C++", "Data Structures", "Algorithms"],
    "preferred_skills": ["Distributed Systems", "Cloud Computing", "Machine Learning"],
    "min_cgpa": 8.0,
    "experience": 0,
}

candidate_skills = result['skills']  # already lowercase from parser

mandatory_matches = [s for s in google_job['mandatory_skills'] if s.lower() in candidate_skills]
preferred_matches = [s for s in google_job['preferred_skills'] if s.lower() in candidate_skills]

m_score = (len(mandatory_matches) / len(google_job['mandatory_skills'])) * 50
p_score = (len(preferred_matches) / len(google_job['preferred_skills'])) * 20
ed_score = 20 if result['cgpa'] >= google_job['min_cgpa'] else (result['cgpa'] / google_job['min_cgpa']) * 20
exp_score = 10  # 0 required

total = round(m_score + p_score + ed_score + exp_score, 1)

print(f"\n=== SCORING vs Google SWE ===")
print(f"Mandatory matched: {mandatory_matches} => {m_score:.1f}/50")
print(f"Preferred matched: {preferred_matches} => {p_score:.1f}/20")
print(f"Education (CGPA {result['cgpa']}): {ed_score:.1f}/20")
print(f"Experience ({result['experience']}yr): {exp_score:.1f}/10")
print(f"TOTAL SCORE: {total}/100")
status = "Shortlisted" if total >= 70 else "Needs Improvement" if total >= 45 else "Rejected"
print(f"STATUS: {status}")
