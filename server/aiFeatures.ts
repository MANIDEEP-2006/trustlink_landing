/**
 * Mock AI Features for TrustLink
 * In production, these would call actual AI/ML services
 */

/**
 * Mock OCR Data Extraction
 * Simulates extracting data from identity documents
 */
export function mockOCRExtraction(documentUrl: string) {
  // Simulate OCR processing
  const documentTypes = ["passport", "national_id", "driver_license"];
  const randomType = documentTypes[Math.floor(Math.random() * documentTypes.length)];

  return {
    success: true,
    documentType: randomType,
    extractedData: {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-15",
      documentNumber: "AB123456789",
      expiryDate: "2030-12-31",
      issuingCountry: "US",
      confidence: Math.random() * 0.2 + 0.8, // 80-100% confidence
    },
    ocrScore: Math.random() * 0.15 + 0.85, // 85-100%
    processedAt: new Date(),
  };
}

/**
 * Mock Face Matching
 * Simulates comparing face in document with selfie
 */
export function mockFaceMatching(documentUrl: string, selfieUrl: string) {
  const matchScore = Math.random() * 0.2 + 0.75; // 75-95% match
  const isMatch = matchScore > 0.80; // 80% threshold

  return {
    success: true,
    matchScore,
    isMatch,
    confidence: Math.random() * 0.1 + 0.9, // 90-100% confidence
    details: {
      facialFeatures: {
        eyeDistance: "match",
        noseBridge: "match",
        chinShape: "match",
        facialStructure: isMatch ? "match" : "mismatch",
      },
      livenessDetection: {
        isLive: true,
        confidence: Math.random() * 0.1 + 0.95,
      },
    },
    processedAt: new Date(),
  };
}

/**
 * Mock Fraud Detection
 * Simulates detecting fraudulent documents or spoofing
 */
export function mockFraudDetection(documentUrl: string, selfieUrl: string, ocrData: any) {
  const fraudRiskFactors = [];
  const fraudScore = Math.random() * 0.3; // 0-30% fraud risk

  // Simulate fraud detection logic
  if (Math.random() > 0.8) {
    fraudRiskFactors.push("unusual_document_pattern");
  }
  if (Math.random() > 0.85) {
    fraudRiskFactors.push("potential_spoofing_detected");
  }
  if (Math.random() > 0.9) {
    fraudRiskFactors.push("document_tampering_signs");
  }

  const isFraudulent = fraudScore > 0.15 || fraudRiskFactors.length > 1;

  return {
    success: true,
    isFraudulent,
    fraudScore,
    fraudRiskFactors,
    detectionMethods: [
      "document_authenticity_check",
      "anti_spoofing_analysis",
      "pattern_recognition",
      "metadata_validation",
    ],
    confidence: Math.random() * 0.1 + 0.9, // 90-100% confidence
    processedAt: new Date(),
  };
}

/**
 * Calculate Trust Score
 * Combines all verification factors into a single score
 */
export function calculateTrustScore(
  ocrScore: number,
  faceMatchScore: number,
  fraudScore: number,
  additionalFactors?: {
    documentExpiry?: boolean;
    livenessScore?: number;
  }
) {
  let trustScore = 0;

  // Weight the factors
  trustScore += ocrScore * 0.3; // 30% - OCR accuracy
  trustScore += faceMatchScore * 0.4; // 40% - Face matching
  trustScore += (1 - fraudScore) * 0.3; // 30% - Fraud detection (inverse)

  // Apply additional factors
  if (additionalFactors?.documentExpiry === false) {
    trustScore -= 0.05; // Penalty for expired document
  }

  if (additionalFactors?.livenessScore) {
    trustScore = trustScore * 0.95 + additionalFactors.livenessScore * 0.05;
  }

  // Normalize to 0-100
  const finalScore = Math.min(100, Math.max(0, trustScore * 100));

  return Math.round(finalScore);
}

/**
 * Determine Verification Status based on scores
 */
export function determineVerificationStatus(
  trustScore: number,
  fraudDetected: boolean,
  faceMatch: boolean
) {
  if (fraudDetected) {
    return "rejected";
  }

  if (!faceMatch) {
    return "rejected";
  }

  if (trustScore >= 85) {
    return "verified";
  }

  if (trustScore >= 70) {
    return "pending"; // Manual review needed
  }

  return "rejected";
}

/**
 * Generate verification summary
 */
export function generateVerificationSummary(
  ocrData: any,
  faceMatchData: any,
  fraudData: any,
  trustScore: number
) {
  return {
    documentType: ocrData.documentType,
    extractedName: `${ocrData.extractedData.firstName} ${ocrData.extractedData.lastName}`,
    ocrAccuracy: Math.round(ocrData.ocrScore * 100),
    faceMatchPercentage: Math.round(faceMatchData.matchScore * 100),
    fraudRiskLevel: fraudData.fraudScore > 0.2 ? "high" : fraudData.fraudScore > 0.1 ? "medium" : "low",
    trustScore,
    verificationStatus: determineVerificationStatus(
      trustScore,
      fraudData.isFraudulent,
      faceMatchData.isMatch
    ),
    timestamp: new Date(),
  };
}
