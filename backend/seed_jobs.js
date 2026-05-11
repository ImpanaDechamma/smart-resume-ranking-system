const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const jobsData = [
  {
    company: "Google",
    title: "Software Engineer",
    skills: ["Data Structures", "Algorithms", "Java", "Python", "DBMS", "OOP", "System Design", "Cloud", "Kubernetes"],
    location: "Mountain View, CA",
    salary: "$150k - $250k",
    logo: "https://www.google.com/s2/favicons?domain=google.com&sz=128",
    banner: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1000&auto=format&fit=crop",
    description: "Join the team that builds the world's most powerful search engine and cloud infrastructure. We are looking for engineers who are passionate about scale and efficiency."
  },
  {
    company: "Microsoft",
    title: "Backend Developer",
    skills: ["C#", "SQL", "APIs", "OOP", "Azure", "Docker", "Microservices"],
    location: "Redmond, WA",
    salary: "$140k - $230k",
    logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
    description: "Build the next generation of cloud services on Azure. You will design and implement highly scalable backend systems using .NET and modern cloud architectures."
  },
  {
    company: "Amazon",
    title: "SDE",
    skills: ["DSA", "Java", "AWS Basics", "DBMS", "Distributed Systems"],
    location: "Seattle, WA",
    salary: "$130k - $210k",
    logo: "https://www.google.com/s2/favicons?domain=amazon.com&sz=128",
    banner: "https://images.unsplash.com/photo-1523240715632-d984bb4b9749?q=80&w=1000&auto=format&fit=crop",
    description: "Amazon is looking for Software Development Engineers to join our core retail and AWS teams. Tackle complex problems in distributed systems and massive data processing."
  },
  {
    company: "Meta",
    title: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB", "GraphQL"],
    location: "Menlo Park, CA",
    salary: "$160k - $260k",
    logo: "https://www.google.com/s2/favicons?domain=meta.com&sz=128",
    banner: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
    description: "Build the future of social connection. Work across the stack on products like Facebook, Instagram, and WhatsApp."
  },
  {
    company: "Netflix",
    title: "Backend Engineer",
    skills: ["Java", "Spring Boot", "Microservices", "AWS"],
    location: "Los Gatos, CA",
    salary: "$200k - $350k",
    logo: "https://www.google.com/s2/favicons?domain=netflix.com&sz=128",
    banner: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop",
    description: "Join the streaming leader and solve unique scaling challenges. We value freedom and responsibility in a high-performance culture."
  },
  {
    company: "Tesla",
    title: "AI Engineer",
    skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow"],
    location: "Palo Alto, CA",
    salary: "$155k - $240k",
    logo: "https://www.google.com/s2/favicons?domain=tesla.com&sz=128",
    banner: "https://images.unsplash.com/photo-1533561052604-c3beb6d4579d?q=80&w=1000&auto=format&fit=crop",
    description: "Build the brains of autonomous vehicles. We are looking for experts in computer vision and deep learning to push the boundaries of AI."
  },
  {
    company: "NVIDIA",
    title: "ML Engineer",
    skills: ["Python", "CUDA", "AI/ML", "Computer Vision"],
    location: "Santa Clara, CA",
    salary: "$170k - $270k",
    logo: "https://www.google.com/s2/favicons?domain=nvidia.com&sz=128",
    banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    description: "Be at the forefront of the AI revolution. Optimize machine learning models to run on the world's most powerful GPUs."
  },
  {
    company: "Apple",
    title: "iOS Developer",
    skills: ["Swift", "Objective-C", "iOS SDK", "Xcode"],
    location: "Cupertino, CA",
    salary: "$150k - $240k",
    logo: "https://www.google.com/s2/favicons?domain=apple.com&sz=128",
    banner: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1000&auto=format&fit=crop",
    description: "Create applications for the world's most advanced mobile operating system. Join the team that builds experiences for millions of users."
  },
  {
    company: "Intel",
    title: "Embedded Engineer",
    skills: ["C", "C++", "Operating Systems", "IoT"],
    location: "Portland, OR",
    salary: "$120k - $190k",
    logo: "https://www.google.com/s2/favicons?domain=intel.com&sz=128",
    banner: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=1000&auto=format&fit=crop",
    description: "Write code that runs close to the metal. Help us design the software that powers the next generation of processors."
  },
  {
    company: "Adobe",
    title: "Frontend Developer",
    skills: ["JavaScript", "React", "CSS", "UI/UX"],
    location: "San Jose, CA",
    salary: "$145k - $220k",
    logo: "https://www.google.com/s2/favicons?domain=adobe.com&sz=128",
    banner: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    description: "Help us build the world's most creative tools. We need frontend experts who can create beautiful, performant user interfaces using React."
  },
  {
    company: "Flipkart",
    title: "SDE",
    skills: ["Java", "SQL", "APIs", "Scalability"],
    location: "Bangalore, India",
    salary: "₹18L - ₹35L",
    logo: "https://www.google.com/s2/favicons?domain=flipkart.com&sz=128",
    banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop",
    description: "Engineer the future of e-commerce in India. Solve problems in logistics, payments, and high-concurrency systems."
  },
  {
    company: "Infosys",
    title: "Systems Engineer",
    skills: ["Java", "Python", "SQL", "Communication Skills", "Cloud", "Web Development"],
    location: "Bangalore, India",
    salary: "₹6L - ₹12L",
    logo: "https://www.google.com/s2/favicons?domain=infosys.com&sz=128",
    banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
    description: "Start your career with one of the global leaders in next-generation digital services and consulting."
  },
  {
    company: "Accenture",
    title: "Associate Software Engineer",
    skills: ["Web Development", "SQL", "APIs", "Cloud", "DevOps"],
    location: "Hyderabad, India",
    salary: "₹6L - ₹11L",
    logo: "https://www.google.com/s2/favicons?domain=accenture.com&sz=128",
    banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    description: "Deliver on the promise of technology and human ingenuity. Work with our Cloud First team."
  },
  {
    company: "Wipro",
    title: "Project Engineer",
    skills: ["Python", "Java", "SQL", "Problem Solving", "AI/ML Basics"],
    location: "Pune, India",
    salary: "₹5L - ₹9L",
    logo: "https://www.google.com/s2/favicons?domain=wipro.com&sz=128",
    banner: "https://images.unsplash.com/photo-1504384308090-c89e1220abe4?q=80&w=1000&auto=format&fit=crop",
    description: "Develop innovative solutions for clients across the globe. We are looking for problem solvers."
  },
  {
    company: "TCS",
    title: "Assistant System Engineer",
    skills: ["Aptitude", "DBMS", "OOP", "Java", "React", "Node.js"],
    location: "Mumbai, India",
    salary: "₹4L - ₹8L",
    logo: "https://www.google.com/s2/favicons?domain=tcs.com&sz=128",
    banner: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop",
    description: "Join India's largest IT services company. Work on global projects and gain experience."
  },
  {
    company: "Oracle",
    title: "Database Developer",
    skills: ["SQL", "PL/SQL", "DBMS", "Oracle Cloud"],
    location: "Austin, TX",
    salary: "$125k - $190k",
    logo: "https://www.google.com/s2/favicons?domain=oracle.com&sz=128",
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    description: "Work on the world's #1 database technology. Design and optimize complex SQL and PL/SQL procedures."
  },
  {
    company: "IBM",
    title: "Data Engineer",
    skills: ["Python", "SQL", "Data Analysis", "Hadoop", "Spark"],
    location: "New York, NY",
    salary: "$110k - $180k",
    logo: "https://www.google.com/s2/favicons?domain=ibm.com&sz=128",
    banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    description: "Help build the foundations for AI and big data analytics. Handle massive datasets using Spark."
  },
  {
    company: "Tesla",
    title: "AI Engineer",
    skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow"],
    location: "Palo Alto, CA",
    salary: "$155k - $240k",
    logo: "https://logo.clearbit.com/tesla.com",
    banner: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1000&auto=format&fit=crop",
    description: "Build the brains of autonomous vehicles. Experts in computer vision and deep learning wanted."
  },
  {
    company: "Samsung",
    title: "Software Developer",
    skills: ["C++", "Java", "DBMS", "Android"],
    location: "Seoul, South Korea",
    salary: "$90k - $160k",
    logo: "https://www.google.com/s2/favicons?domain=samsung.com&sz=128",
    banner: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop",
    description: "Develop software for the world's most popular consumer electronics."
  },
  {
    company: "PayPal",
    title: "Backend Developer",
    skills: ["Java", "Spring", "SQL", "Security"],
    location: "San Jose, CA",
    salary: "$140k - $210k",
    logo: "https://www.google.com/s2/favicons?domain=paypal.com&sz=128",
    banner: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000&auto=format&fit=crop",
    description: "Secure the world's digital payments. Experts obsessed with security wanted."
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    let systemHR = await User.findOne({ email: 'system_hr@resumerank.com' });
    if (!systemHR) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('system123', salt);
      systemHR = await User.create({
        name: "System Recruiter",
        email: "system_hr@resumerank.com",
        password: hashedPassword,
        role: "hr"
      });
    }

    // Clear and re-seed to ensure all have banners
    await Job.deleteMany({ recruiter: systemHR._id });

    for (const job of jobsData) {
      await Job.create({
        ...job,
        recruiter: systemHR._id,
        required_skills: job.skills.map(s => s.toLowerCase())
      });
      console.log(`Added: ${job.company}`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedDB();
