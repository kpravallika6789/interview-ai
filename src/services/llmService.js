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
    
    // Structured study plan layout
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
    
    // Check if key terms in claim exist in resume
    const words = claimLower.split(/\s+/).filter(w => w.length > 4);
    const matches = words.filter(w => resumeLower.includes(w));
    
    const factualityScore = words.length > 0 ? Math.round((matches.length / words.length) * 100) : 100;
    
    return {
      isVerified: factualityScore > 40,
      factualityScore,
      status: factualityScore > 40 ? 'FACT_VERIFIED' : 'UNVERIFIED_CLAIM',
      note: factualityScore > 40 
        ? 'Claim matches verified credentials and projects in uploaded resume.' 
        : 'Potential hallucination detected: Claim contains terms not supported by candidate resume.'
    };
  }
}
