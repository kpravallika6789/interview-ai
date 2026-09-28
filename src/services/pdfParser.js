import pdfParse from 'pdf-parse';

/**
 * Extracts raw text from uploaded PDF buffer or plain text string
 * @param {Buffer|string} fileBuffer 
 * @returns {Promise<string>}
 */
export async function parsePdfToText(fileBuffer) {
  if (typeof fileBuffer === 'string') {
    return fileBuffer;
  }
  try {
    const data = await pdfParse(fileBuffer);
    return data.text || '';
  } catch (error) {
    console.error('PDF parsing error, falling back to text decoder:', error);
    return fileBuffer.toString('utf-8');
  }
}
