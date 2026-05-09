const extractKeywords = (description, requiredSkillsStr) => {
  // Try parsing the required skills string which is usually comma separated
  let skills = [];
  if (requiredSkillsStr) {
    skills = requiredSkillsStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  }
  
  // Could also implement logic to extract implicit skills from the job description text
  // if requiredSkillsStr is sparse.
  return skills;
};

module.exports = {
  extractKeywords
};
