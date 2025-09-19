// Mock certificate verification service that simulates checking against external APIs
export interface VerificationResult {
  isValid: boolean;
  institution: {
    name: string;
    isAccredited: boolean;
    website?: string;
  };
  student: {
    isEnrolled: boolean;
    graduationVerified: boolean;
  };
  certificate: {
    isAuthentic: boolean;
    issueDate: string;
  };
  sources: string[];
}

// Simulated database of accredited institutions
const ACCREDITED_INSTITUTIONS = [
  'MIT', 'Stanford University', 'Harvard University', 'Oxford University', 
  'Cambridge University', 'UC Berkeley', 'Caltech', 'Princeton University',
  'Yale University', 'University of Pennsylvania', 'Columbia University',
  'Cornell University', 'University of Chicago', 'Northwestern University'
];

// Simulated API calls to external verification services
export async function verifyWithExternalSources(certificate: any): Promise<VerificationResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const institutionName = certificate.institutionName;
  const studentName = certificate.studentName;
  
  // Simulate checking against various sources
  const sources = [
    'National Student Clearinghouse',
    'Accreditation Database',
    'Institution Registry',
    'Degree Verification Network'
  ];

  // Check if institution is accredited
  const isAccredited = ACCREDITED_INSTITUTIONS.some(inst => 
    institutionName.toLowerCase().includes(inst.toLowerCase()) ||
    inst.toLowerCase().includes(institutionName.toLowerCase())
  );

  // Simulate verification results
  const verificationResult: VerificationResult = {
    isValid: isAccredited && studentName.length > 2,
    institution: {
      name: institutionName,
      isAccredited,
      website: isAccredited ? `https://${institutionName.toLowerCase().replace(/\s+/g, '')}.edu` : undefined
    },
    student: {
      isEnrolled: isAccredited && Math.random() > 0.1,
      graduationVerified: isAccredited && Math.random() > 0.2
    },
    certificate: {
      isAuthentic: isAccredited && Math.random() > 0.1,
      issueDate: certificate.issuedAt
    },
    sources
  };

  return verificationResult;
}

export async function validateCertificateData(certificate: any): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!certificate.studentName || certificate.studentName.length < 2) {
    errors.push('Student name is required and must be at least 2 characters');
  }

  if (!certificate.institutionName) {
    errors.push('Institution name is required');
  }

  if (!certificate.degreeProgram) {
    errors.push('Degree program is required');
  }

  if (!certificate.graduationDate) {
    errors.push('Graduation date is required');
  } else {
    const gradDate = new Date(certificate.graduationDate);
    const now = new Date();
    if (gradDate > now) {
      warnings.push('Graduation date is in the future');
    }
  }

  // Check if institution is known
  const isKnownInstitution = ACCREDITED_INSTITUTIONS.some(inst => 
    certificate.institutionName.toLowerCase().includes(inst.toLowerCase())
  );

  if (!isKnownInstitution) {
    warnings.push('Institution not found in accredited institutions database');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}