const calculateRankingScore = (candidateData, jobRequirements) => {
  const { candidateSkills, candidateExp, candidateEduLevel } = candidateData;
  const { requiredSkills, minExp } = jobRequirements;

  // 1. Skills Match Score (Max 50 points)
  let skillsScore = 0;
  if (requiredSkills.length > 0) {
    const matchedSkills = candidateSkills.filter(skill => requiredSkills.includes(skill.toLowerCase()));
    skillsScore = (matchedSkills.length / requiredSkills.length) * 50;
  } else {
    skillsScore = 50; // If no required skills, give full points
  }

  // 2. Experience Match Score (Max 30 points)
  let expScore = 0;
  if (minExp > 0) {
    if (candidateExp >= minExp) {
      expScore = 30; // Meets or exceeds
    } else {
      expScore = (candidateExp / minExp) * 30; // Partial score
    }
  } else {
    expScore = 30; // If no min exp required, give full points
  }

  // 3. Education Match Score (Max 20 points)
  // Let's assume Level 2 (Bachelor) is standard expectation = 15 pts.
  // Level 3/4 = 20 pts.
  // Level 1 = 10 pts.
  // Level 0 = 5 pts.
  let eduScore = 5;
  if (candidateEduLevel === 1) eduScore = 10;
  if (candidateEduLevel === 2) eduScore = 15;
  if (candidateEduLevel >= 3) eduScore = 20;

  // Total Score (Max 100 points)
  const totalScore = skillsScore + expScore + eduScore;

  return {
    skillsScore: parseFloat(skillsScore.toFixed(2)),
    experienceScore: parseFloat(expScore.toFixed(2)),
    educationScore: parseFloat(eduScore.toFixed(2)),
    totalScore: parseFloat(totalScore.toFixed(2))
  };
};

module.exports = {
  calculateRankingScore
};
