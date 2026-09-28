import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { redactResume } from './services/redactor.js';
import { SAMPLE_RESUMES } from './data/sampleResumes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Multer in-memory storage for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Interview AI Resume Anonymizer Engine',
    timestamp: new Date().toISOString()
  });
});

// Get sample candidate resumes for one-click testing
app.get('/api/samples', (req, res) => {
  res.json({
    success: true,
    samples: SAMPLE_RESUMES
  });
});

// Redact Plain Text Resume
app.post('/api/redact/text', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "text" field in request body' });
    }

    const result = redactResume(text);
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error redacting text:', error);
    return res.status(500).json({ error: 'Failed to process resume text', details: error.message });
  }
});

// Redact PDF Resume File
app.post('/api/redact/pdf', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded. Please send file in "resume" field.' });
    }

    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text || '';

    const result = redactResume(extractedText);

    return res.json({
      success: true,
      filename: req.file.originalname,
      pages: pdfData.numpages,
      data: result
    });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return res.status(500).json({ error: 'Failed to extract or redact PDF file', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Interview AI Backend Server running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(` - POST /api/redact/text`);
  console.log(` - POST /api/redact/pdf`);
  console.log(` - GET  /api/samples`);
  console.log(`====================================================`);
});
