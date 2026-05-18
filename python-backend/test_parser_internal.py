from parser import parse_resume

test_resumes = [
    "John Doe\nPython, Java, SQL\nExperience: 5 years",
    "Jane Smith\nReact, TypeScript, Node.js\nCGPA: 9.0",
    "Empty resume"
]

for i, text in enumerate(test_resumes):
    print(f"--- Test {i+1} ---")
    data = parse_resume(text)
    print(data)
