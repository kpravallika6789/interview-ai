/**
 * Extracts candidate skills, tools, experience years, and calculates delta against Target Job Description
 */

const KNOWN_SKILLS = [
  // Frontend
  'React', 'React.js', 'Vue', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'JavaScript',
  'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'GraphQL', 'REST API', 'Vite', 'Webpack',
  // Backend & DB
  'Node.js', 'Express', 'Express.js', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot',
  'C++', 'C#', '.NET', 'Go', 'Rust', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Prisma', 'SQL',
  // DevOps & Cloud
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'Linux', 'Terraform',
  // AI & ML
  'PyTorch', 'TensorFlow', 'LLMs', 'NLP', 'Scikit-Learn', 'LangChain', 'Ollama', 'Pandas', 'NumPy',
  // General Software Engineering
  'System Design', 'Microservices', 'Unit Testing', 'Jest', 'Mocha', 'Agile', 'Scrum'
];

export class SkillExtractor {
  /**
   * Extract skills and experience from redacted text
   * @param {string} redactedText 
   */
  extract(redactedText) {
    const textLower = redactedText.toLowerCase();
    const detectedSkills = [];

    KNOWN_SKILLS.forEach(skill => {
      const regex = new RegExp(`\\b${this.escapeRegExp(skill)}\\b`, 'i');
      if (regex.test(redactedText)) {
        detectedSkills.push(skill);
      }
    });

    // Estimate years of experience from timeline regex (e.g. 2018 - 2022)
    const yearMatches = [...redactedText.matchAll(/\b(20[0-2]\d|199\d)\b/g)].map(m => parseInt(m[0]));
    let estimatedYears = 0;
    if (yearMatches.length >= 2) {
      const minYear = Math.min(...yearMatches);
      const maxYear = Math.max(...yearMatches);
      estimatedYears = Math.max(1, maxYear - minYear);
    }

    return {
      skills: [...new Set(detectedSkills)],
      estimatedExperienceYears: estimatedYears || 3,
      domainCategory: this.inferDomain(detectedSkills)
    };
  }

  /**
   * Calculates delta between Candidate Skills and Job Description
   * @param {Array<string>} candidateSkills 
   * @param {string} jobDescription 
   */
  calculateDelta(candidateSkills, jobDescription) {
    if (!jobDescription || !jobDescription.trim()) {
      return {
        requiredSkills: [],
        matchingSkills: candidateSkills,
        missingSkills: [],
        matchPercentage: 100,
        gapAnalysis: "No job description provided; full resume skills retained."
      };
    }

    const jdRequiredSkills = [];
    KNOWN_SKILLS.forEach(skill => {
      const regex = new RegExp(`\\b${this.escapeRegExp(skill)}\\b`, 'i');
      if (regex.test(jobDescription)) {
        jdRequiredSkills.push(skill);
      }
    });

    const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase());
    const matchingSkills = jdRequiredSkills.filter(s => candidateSkillsLower.includes(s.toLowerCase()));
    const missingSkills = jdRequiredSkills.filter(s => !candidateSkillsLower.includes(s.toLowerCase()));

    const matchPercentage = jdRequiredSkills.length > 0 
      ? Math.round((matchingSkills.length / jdRequiredSkills.length) * 100) 
      : 85;

    return {
      requiredSkills: jdRequiredSkills,
      matchingSkills,
      missingSkills,
      matchPercentage,
      gapAnalysis: missingSkills.length > 0 
        ? `Candidate is missing ${missingSkills.length} key requirement(s): ${missingSkills.join(', ')}.` 
        : 'Candidate matches all explicitly stated tech stack requirements in the job description.'
    };
  }

  inferDomain(skills) {
    const s = skills.join(' ').toLowerCase();
    if (s.includes('react') || s.includes('vue') || s.includes('html') || s.includes('tailwind')) return 'Frontend Engineering';
    if (s.includes('node') || s.includes('express') || s.includes('python') || s.includes('postgres')) return 'Full Stack / Backend Engineering';
    if (s.includes('docker') || s.includes('aws') || s.includes('kubernetes')) return 'DevOps & Cloud Engineering';
    if (s.includes('pytorch') || s.includes('llm') || s.includes('nlp')) return 'AI / Machine Learning Engineering';
    return 'Software Engineering';
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
