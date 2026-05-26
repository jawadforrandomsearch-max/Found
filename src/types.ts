/**
 * TypeScript type definitions for Sadiqon Foundation Financial Aid Portal
 */

export type ApplicationStatus = 'Pending' | 'Under Review' | 'Verified' | 'Approved' | 'Rejected';

export interface DocumentUpload {
  name: string;      // Filename
  type: string;      // MIME type
  size: number;      // File size in bytes
  dataUrl?: string;  // Base64 Data URL for display/preview
}

export interface ApplicationDocuments {
  feeSlip?: DocumentUpload;
  resultCard?: DocumentUpload;
  utilityBill?: DocumentUpload;
  studentIdCard?: DocumentUpload;
  recommendationLetters?: DocumentUpload;
  houseImages?: DocumentUpload;
}

export interface StudentApplication {
  id: string;               // Document ID in Firestore
  studentId: string;        // Auto-generated human-oriented ID (e.g. SF-2026-X83C)
  fullName: string;
  fatherName: string;
  cnic: string;             // CNIC or B-Form
  phone: string;
  address: string;
  schoolName: string;
  gradeClass: string;
  monthlyIncome: number;
  guardianOccupation: string;
  familyMembers: number;
  earningMembers: number;
  houseType: 'owned' | 'rented';
  reasonForHelp: string;
  isOrphan: boolean;
  isDisabled: boolean;
  academicMarks: number;     // academic percentage or raw marks
  stepfundNeeded: number;    // requested monthly contribution or scholarship amount from stepfund
  needScore: number;        // Auto-calculated poverty severity rating (0 to 100)
  status: ApplicationStatus;
  adminNotes?: string;
  documents?: ApplicationDocuments;
  createdAt: string;        // ISO String / Firestore server timestamp
  updatedAt: string;        // ISO String
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'SuperAdmin' | 'Reviewer';
}

export type TranslationLanguage = 'en' | 'ur';
