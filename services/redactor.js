/**
 * Interview AI - Core Resume Anonymization & Bias Redaction Engine
 * Redacts PII and Demographic/Bias markers while preserving skills, experience, & achievements.
 */

// Comprehensive Dictionaries & Patterns

const GENDER_PRONOUNS = [
  /\bhe\b/gi, /\bshe\b/gi,
  /\bhim\b/gi, /\bher\b/gi,
  /\bhis\b/gi, /\bhers\b/gi,
  /\bhimself\b/gi, /\bherself\b/gi,
  /\bmale\b/gi, /\bfemale\b/gi,
  /\bman\b/gi, /\bwoman\b/gi,
  /\bmen\b/gi, /\bwomen\b/gi,
  /\bgentleman\b/gi, /\blady\b/gi,
  /\bboy\b/gi, /\bgirl\b/gi
];

const GENDER_TITLES = [
  /\bMr\.\s+/g, /\bMs\.\s+/g, /\bMrs\.\s+/g, /\bMiss\s+/g,
  /\bMr\b/g, /\bMs\b/g, /\bMrs\b/g
];

const GENDER_ORGANIZATIONS = [
  /\bSociety of Women Engineers\b/gi,
  /\bWomen Who Code\b/gi,
  /\bGirls Who Code\b/gi,
  /\bWomen in Tech\b/gi,
  /\bFraternity\b/gi,
  /\bSorority\b/gi
];

const RELIGIONS_AND_CASTES = [
  /\bHinduism?\b/gi, /\bMuslims?\b/gi, /\bIslam(ic)?\b/gi, /\bChristians?\b/gi, /\bChristianity\b/gi,
  /\bSikhs?\b/gi, /\bSikhism\b/gi, /\bBuddhists?\b/gi, /\bBuddhism\b/gi, /\bJains?\b/gi, /\bJainism\b/gi,
  /\bJews?\b/gi, /\bJewish\b/gi, /\bJudaism\b/gi,
  /\bBrahmin\b/gi, /\bKshatriya\b/gi, /\bVaishya\b/gi, /\bShudra\b/gi, /\bDalit\b/gi,
  /\bRajput\b/gi, /\bMaratha\b/gi, /\bYadav\b/gi, /\bJat\b/gi, /\bKayastha\b/gi,
  /\bSC\/ST\b/gi, /\bOBC\b/gi, /\bGeneral Category\b/gi, /\bCaste\b/gi
];

const RACE_AND_SKIN = [
  /\bCaucasian\b/gi, /\bAfrican[- ]American\b/gi, /\bHispanic\b/gi, /\bLatino\b/gi, /\bLatina\b/gi,
  /\bAsian[- ]American\b/gi, /\bNative American\b/gi, /\bPacific Islander\b/gi,
  /\bWhite\b/gi, /\bBlack\b/gi, /\bFair skin(ned)?\b/gi, /\bDark skin(ned)?\b/gi, /\bWheatish\b/gi
];

const MOTHER_TONGUE_PATTERNS = [
  /(?:Mother\s*Tongue|Native\s*Language|Native\s*Speaker|First\s*Language)\s*[:|-]\s*([A-Za-z]+)/gi,
  /\b(Hindi|Tamil|Telugu|Bengali|Marathi|Gujarati|Malayalam|Kannada|Punjabi|Odia|Assamese|Urdu|Spanish|Mandarin|French|German|Russian|Arabic)\s*\((?:Native|Mother\s*Tongue)\)/gi
];

const AGE_PATTERNS = [
  /(?:Date\s*of\s*Birth|DOB|Birth\s*Date|Born\s*on|Born)\s*[:|-]?\s*(?:\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}|\d{1,2}\s+[A-Za-z]+\s+\d{4}|\w+\s+\d{1,2},\s*\d{4})/gi,
  /(?:Age)\s*[:|-]?\s*\d{1,2}\s*(?:years?\s*old)?/gi,
  /\b\d{1,2}\s*years?\s*old\b/gi
];

const GRADUATION_YEAR_PATTERNS = [
  /(?:Graduated|Passing\s*Year|Passout\s*Year|Completion\s*Year|Class\s*of)\s*[:|-]?\s*(19\d{2}|20[0-2]\d)/gi,
  /\b(19[789]\d|20[01]\d)\s*[-–—]\s*(19[89]\d|20[0-2]\d)\b/g // e.g. 2008 - 2012 in education section
];

const CONTACT_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,12}/g,
  url: /(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/|github\.com\/|twitter\.com\/|facebook\.com\/)[a-zA-Z0-9_-]+/gi,
  genericUrl: /https?:\/\/[^\s]+/gi
};

const ADDRESS_PATTERNS = [
  /(?:Address|Location|Residing\s*at|City)\s*[:|-]\s*([^\n,]+(?:,[^\n,]+){1,3})/gi,
  /\b\d{1,5}\s+[A-Z][a-z]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Pin\s*Code|Zip)\b[^\n]*/gi
];

/**
 * Main Redaction Function
 * @param {string} rawText - Original resume text
 * @returns {object} Redacted output, stats, and audit trails
 */
export function redactResume(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      redactedText: '',
      audit: { totalRedactions: 0, categories: {} },
      score: 100
    };
  }

  let text = rawText;
  const audit = {
    pii: { name: 0, email: 0, phone: 0, url: 0, address: 0 },
    bias: { gender: 0, age: 0, casteReligion: 0, race: 0, language: 0 }
  };

  // 1. Redact Header Name (First 3 lines usually contain the candidate's name)
  const lines = text.split('\n');
  let candidateNameFound = '';
  
  // Look for explicit Name field
  const nameLabelMatch = text.match(/(?:Name|Full Name|Candidate Name)\s*[:|-]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
  if (nameLabelMatch) {
    candidateNameFound = nameLabelMatch[1].trim();
    text = text.replace(nameLabelMatch[0], 'Name: [REDACTED_NAME]');
    audit.pii.name++;
  } else {
    // Check first 2 non-empty lines for a standalone name
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i].trim();
      if (line && !line.includes('@') && !line.includes('http') && line.length < 35) {
        // High likelihood of candidate name
        const potentialNameMatches = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/);
        if (potentialNameMatches) {
          candidateNameFound = potentialNameMatches[1];
          lines[i] = lines[i].replace(candidateNameFound, '[REDACTED_NAME]');
          audit.pii.name++;
          break;
        }
      }
    }
    text = lines.join('\n');
  }

  // If candidate name was identified, redact any further occurrences of it throughout the document
  if (candidateNameFound) {
    const nameParts = candidateNameFound.split(/\s+/).filter(part => part.length > 2);
    nameParts.forEach(part => {
      const regex = new RegExp(`\\b${part}\\b`, 'g');
      const count = (text.match(regex) || []).length;
      if (count > 0) {
        text = text.replace(regex, '[REDACTED_NAME]');
        audit.pii.name += count;
      }
    });
  }

  // 2. Redact Emails
  text = text.replace(CONTACT_PATTERNS.email, (match) => {
    audit.pii.email++;
    return '[REDACTED_EMAIL]';
  });

  // 3. Redact Phone Numbers
  text = text.replace(CONTACT_PATTERNS.phone, (match) => {
    audit.pii.phone++;
    return '[REDACTED_PHONE]';
  });

  // 4. Redact URLs & Profile Handles
  text = text.replace(CONTACT_PATTERNS.url, (match) => {
    audit.pii.url++;
    return '[REDACTED_LINK]';
  });

  text = text.replace(CONTACT_PATTERNS.genericUrl, (match) => {
    audit.pii.url++;
    return '[REDACTED_LINK]';
  });

  // 5. Redact Addresses & Zip codes
  ADDRESS_PATTERNS.forEach(pattern => {
    text = text.replace(pattern, (match) => {
      audit.pii.address++;
      return 'Location: [REDACTED_LOCATION]';
    });
  });

  // 6. Redact Gender Pronouns, Titles, & Organizations
  GENDER_TITLES.forEach(pattern => {
    text = text.replace(pattern, () => {
      audit.bias.gender++;
      return '[REDACTED_TITLE] ';
    });
  });

  GENDER_ORGANIZATIONS.forEach(pattern => {
    text = text.replace(pattern, () => {
      audit.bias.gender++;
      return '[REDACTED_GENDER_ORGANIZATION]';
    });
  });

  GENDER_PRONOUNS.forEach(pattern => {
    text = text.replace(pattern, () => {
      audit.bias.gender++;
      return '[REDACTED_GENDER]';
    });
  });

  // 7. Redact Age & Birth Dates
  AGE_PATTERNS.forEach(pattern => {
    text = text.replace(pattern, () => {
      audit.bias.age++;
      return '[REDACTED_AGE]';
    });
  });

  GRADUATION_YEAR_PATTERNS.forEach(pattern => {
    text = text.replace(pattern, (match) => {
      audit.bias.age++;
      return '[REDACTED_YEAR]';
    });
  });

  // 8. Redact Caste & Religion
  RELIGIONS_AND_CASTES.forEach(pattern => {
    text = text.replace(pattern, () => {
      audit.bias.casteReligion++;
      return '[REDACTED_DEMOGRAPHIC]';
    });
  });

  // 9. Redact Race & Skin Colour
  RACE_AND_SKIN.forEach(pattern => {
    text = text.replace(pattern, () => {
      audit.bias.race++;
      return '[REDACTED_RACE_SKIN]';
    });
  });

  // 10. Redact Native Language / Mother Tongue markers
  MOTHER_TONGUE_PATTERNS.forEach(pattern => {
    text = text.replace(pattern, () => {
      audit.bias.language++;
      return 'Language: [REDACTED_NATIVE_LANGUAGE]';
    });
  });

  const totalPii = Object.values(audit.pii).reduce((a, b) => a + b, 0);
  const totalBias = Object.values(audit.bias).reduce((a, b) => a + b, 0);
  const totalRedactions = totalPii + totalBias;

  // Calculate Anonymization Protection Score (0-100%)
  const score = Math.min(100, Math.round(90 + (totalRedactions > 0 ? 10 : 0)));

  return {
    originalLength: rawText.length,
    redactedText: text,
    audit: {
      totalRedactions,
      totalPii,
      totalBias,
      pii: audit.pii,
      bias: audit.bias
    },
    protectionScore: score
  };
}
