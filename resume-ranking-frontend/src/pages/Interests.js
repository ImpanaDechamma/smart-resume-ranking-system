import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const INTEREST_FIELDS = [
  { category: "Engineering & Development", options: ["Frontend Development", "Backend Development", "Full Stack Development", "Mobile Development", "DevOps & Cloud", "Embedded Systems", "Data Engineering"] },
  { category: "Data & AI", options: ["Data Science", "Machine Learning", "Artificial Intelligence", "Business Intelligence", "Data Analytics", "Computer Vision", "NLP"] },
  { category: "Design & Product", options: ["UI/UX Design", "Product Management", "Graphic Design", "Motion Design", "Brand Strategy"] },
  { category: "Business & Management", options: ["Project Management", "Business Analysis", "Operations", "Human Resources", "Finance & Accounting", "Marketing", "Sales"] },
  { category: "Cybersecurity & Networking", options: ["Cybersecurity", "Network Engineering", "Cloud Security", "Ethical Hacking", "IT Support"] },
];

export default function Interests() {
  const { user, saveInterests, skipInterests } = useAuth();
  const [selected, setSelected] = useState([]);

  const toggle = (option) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <div className="interests-container">
      <div className="interests-card">
        <div className="interests-header">
          <h2>Welcome, {user?.name}</h2>
          <p>Select the fields you are interested in. This helps us show you the most relevant jobs.</p>
        </div>

        <div className="interests-body">
          {INTEREST_FIELDS.map((group) => (
            <div key={group.category} className="interest-group">
              <p className="interest-category">{group.category}</p>
              <div className="interest-options">
                {group.options.map((option) => (
                  <button
                    key={option}
                    className={`interest-chip ${selected.includes(option) ? "selected" : ""}`}
                    onClick={() => toggle(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="interests-footer">
          {selected.length > 0 && (
            <span className="selected-count">{selected.length} selected</span>
          )}
          <div className="interests-actions">
            <button className="btn-secondary" onClick={skipInterests}>Skip for now</button>
            <button className="btn-primary" onClick={() => saveInterests(selected)}>
              {selected.length === 0 ? "Continue" : "Save & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
