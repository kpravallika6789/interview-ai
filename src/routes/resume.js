import { Router } from 'express';
import multer from 'multer';
import { parsePdfToText } from '../services/pdfParser.js';
import { ResumeRedactor } from '../services/redactor.js';
import { SkillExtractor } from '../services/skillExtractor.js';
import { LLMService } from '../services/llmService.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const redactor = new ResumeRedactor();
const skillExtractor = new SkillExtractor();
const llmService = new LLMService();

/**
 * POST /api/resume/parse-and-redact
 * Ingests PDF resume or raw text, redacts PII & demographic bias triggers, extracts skills & skill gap delta
 */
router.post('/parse-and-redact', upload.single('resumeFile'), async (req, res) => {
  try {
    let rawText = req.body.resumeText || '';
    const jobDescription = req.body.jobDescription || '';

    // Handle PDF upload if provided
    if (req.file) {
      rawText = await parsePdfToText(req.file.buffer);
    }

    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'Please provide a valid PDF resume or resume text.' });
    }

    // Step 1: Execute Layer 1 Governance (Privacy & Bias Redaction)
    const redactionResult = redactor.redact(rawText);

    // Step 2: Skill Parsing & Experience Extraction
    const candidateProfile = skillExtractor.extract(redactionResult.redactedText);

    // Step 3: Delta Analysis against Target Job Description
    const deltaAnalysis = skillExtractor.calculateDelta(candidateProfile.skills, jobDescription);

    // Step 4: Up-skilling & Study Plan Generation
    const studyPlan = await llmService.generateStudyPlan(candidateProfile, deltaAnalysis);

    res.json({
      success: true,
      originalText: rawText,
      redactedText: redactionResult.redactedText,
      auditLog: redactionResult.auditLog,
      stats: redactionResult.stats,
      candidateProfile,
      deltaAnalysis,
      studyPlan,
      processedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ error: 'Failed to parse and redact resume: ' + error.message });
  }
});

/**
 * POST /api/resume/verify-factuality
 * Layer 2 Governance: Hallucination Checker cross-referencing candidate claims against PDF resume
 */
router.post('/verify-factuality', async (req, res) => {
  try {
    const { claim, redactedResumeText } = req.body;
    if (!claim || !redactedResumeText) {
      return res.status(400).json({ error: 'Missing claim or redactedResumeText parameters.' });
    }
    const verification = await llmService.verifyClaimAgainstResume(claim, redactedResumeText);
    res.json({ success: true, verification });
  } catch (error) {
    res.status(500).json({ error: 'Factuality check failed: ' + error.message });
  }
});

export default router;
