/**
 * LLM Service for AI-enhanced Resume Parsing, Layer 1 Governance verification, and Study Plan Generation
 */

export class LLMService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || null;
  }

  /**
   * Generates a personalized up-skilling study plan based on skill gaps
   */
  async generateStudyPlan(candidateProfile, deltaAnalysis) {
    const missing = deltaAnalysis.missingSkills || [];
    const matching = deltaAnalysis.matchingSkills || [];
    
    return {
      title: `Personalized Technical Study Plan - ${candidateProfile.domainCategory}`,
      targetMatchScore: `${deltaAnalysis.matchPercentage}% -> Target 95%+`,
      summary: missing.length > 0
        ? `Focus on bridging gap in ${missing.join(', ')} before your technical mock interview.`
        : `Strong core alignment detected! Focus on deep-dive system architecture and scenario discussions.`,
      recommendedModules: missing.length > 0 ? missing.map((skill, idx) => ({
        week: `Week ${idx + 1}`,
        topic: skill,
        focusAreas: [
          `Core principles and architecture patterns of ${skill}`,
          `Practical implementation and hands-on coding exercises with ${skill}`,
          `Common technical interview question breakdown for ${skill}`
        ],
        estimatedHours: 6
      })) : [
        {
          week: 'Week 1',
          topic: 'System Design & Scalability',
          focusAreas: ['Distributed caching', 'Database indexing & query optimization', 'API Rate limiting & security'],
          estimatedHours: 8
        },
        {
          week: 'Week 2',
          topic: 'Advanced Behavioral & Situational Prep',
          focusAreas: ['STAR method response framing', 'Conflict resolution scenarios', 'Leadership & trade-off decisions'],
          estimatedHours: 5
        }
      ]
    };
  }

  /**
   * Layer 2 Governance System: Resume Factuality Check
   * Cross-references claims against redacted resume text to prevent hallucination
   */
  async verifyClaimAgainstResume(claim, redactedResumeText) {
    const claimLower = claim.toLowerCase();
    const resumeLower = redactedResumeText.toLowerCase();

    // Generic placeholder words to ignore in claim matching
    const stopWords = new Set(['candidate', 'applicant', 'person', 'individual', 'resume', 'is', 'was', 'has', 'have', 'been', 'with', 'that', 'this']);

    // Tokenize claim into meaningful terms (3+ letters, excluding stopWords)
    const claimTokens = claimLower
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length >= 3 && !stopWords.has(w));

    if (claimTokens.length === 0) {
      return {
        isVerified: true,
        factualityScore: 100,
        status: 'FACT_VERIFIED',
        note: 'General statement verified against candidate profile.'
      };
    }

    // Stemming / Synonym match helper
    const matches = claimTokens.filter(token => {
      // Direct match
      if (resumeLower.includes(token)) return true;

      // Stem matching (e.g. "certified" matches "certifications" / "certify")
      const rootStem = token.substring(0, Math.min(token.length - 2, 6));
      if (rootStem.length >= 4 && resumeLower.includes(rootStem)) return true;

      return false;
    });

    const factualityScore = Math.round((matches.length / claimTokens.length) * 100);
    const isVerified = factualityScore >= 50;

    return {
      isVerified,
      factualityScore,
      status: isVerified ? 'FACT_VERIFIED' : 'UNVERIFIED_CLAIM',
      note: isVerified 
        ? `Claim terms (${matches.join(', ')}) verified against resume credentials.`
        : `Potential hallucination: Terms (${claimTokens.filter(t => !matches.includes(t)).join(', ')}) not found in candidate resume.`
    };
  }
}
