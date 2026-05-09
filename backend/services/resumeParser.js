const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

// Extract text from a file (PDF or DOCX)
const extractText = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else {
      throw new Error('Unsupported file format');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    return '';
  }
};

// Extract common tech skills from text
const extractSkills = (text) => {
  const commonSkills = [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'go', 'rust',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
    'html', 'css', 'typescript', 'sql', 'mysql', 'postgresql', 'mongodb', 'aws',
    'docker', 'kubernetes', 'git', 'ci/cd', 'linux', 'azure', 'gcp', 'redux'
  ];
  
  const textLower = text.toLowerCase();
  const extractedSkills = [];
  
  commonSkills.forEach(skill => {
    // Look for exact word matches (handling punctuation boundaries)
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(textLower)) {
      extractedSkills.push(skill);
    }
  });
  
  return extractedSkills;
};

// Simple heuristic to estimate years of experience based on dates or keywords
const estimateExperience = (text) => {
  // A very basic implementation: look for "X years" pattern
  const textLower = text.toLowerCase();
  const regex = /(\d+)\+?\s+years/g;
  let maxYears = 0;
  
  let match;
  while ((match = regex.exec(textLower)) !== null) {
    const years = parseInt(match[1]);
    if (years > maxYears && years < 30) { // sanity check
      maxYears = years;
    }
  }
  
  return maxYears;
};

// Detect education level
const detectEducationLevel = (text) => {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('phd') || textLower.includes('ph.d')) return 4;
  if (textLower.includes('master') || textLower.includes('m.s') || textLower.includes('mtech') || textLower.includes('mca')) return 3;
  if (textLower.includes('bachelor') || textLower.includes('b.s') || textLower.includes('btech') || textLower.includes('b.e')) return 2;
  if (textLower.includes('associate') || textLower.includes('diploma')) return 1;
  
  return 0; // Unknown
};

module.exports = {
  extractText,
  extractSkills,
  estimateExperience,
  detectEducationLevel
};
