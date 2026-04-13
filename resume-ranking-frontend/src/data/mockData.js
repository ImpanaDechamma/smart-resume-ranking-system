export const mockJobs = [
  { id: 1, title: "Full Stack Developer", company: "TechCorp", description: "Looking for a full stack developer with React and Node.js experience.", skills: ["React", "Node.js", "SQL"], postedDate: "2024-01-10" },
  { id: 2, title: "Backend Engineer", company: "DataSoft", description: "Backend engineer with strong Python and database skills.", skills: ["Python", "SQL", "Linux"], postedDate: "2024-01-15" },
];

export const mockApplications = [
  { id: 1, candidateId: 2, candidateName: "Alice Johnson", email: "alice@email.com", jobId: 1, score: 88, skills: ["React", "Node.js", "SQL"], experience: 4, education: "B.Tech CS", resumeFile: "alice_resume.pdf", status: "Shortlisted", appliedDate: "2024-01-12" },
  { id: 2, candidateId: 3, candidateName: "Bob Smith", email: "bob@email.com", jobId: 1, score: 72, skills: ["Python", "SQL"], experience: 3, education: "M.Tech AI", resumeFile: "bob_resume.pdf", status: "Applied", appliedDate: "2024-01-13" },
  { id: 3, candidateId: 3, candidateName: "Bob Smith", email: "bob@email.com", jobId: 2, score: 91, skills: ["Python", "SQL", "Linux"], experience: 3, education: "M.Tech AI", resumeFile: "bob_resume.pdf", status: "Applied", appliedDate: "2024-01-16" },
];
