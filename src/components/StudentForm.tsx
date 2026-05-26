import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { StudentApplication, ApplicationDocuments, TranslationLanguage } from '../types';
import { translations } from '../translations';
import { calculateNeedScore, getNeedSeverity } from '../utils/povertyScorer';
import { 
  User, BookOpen, Landmark, FileText, CheckCircle2, 
  Upload, Sparkles, X, Phone, MapPin, Briefcase, Mail, Check, AlertCircle 
} from 'lucide-react';

interface StudentFormProps {
  language: TranslationLanguage;
}

export default function StudentForm({ language }: StudentFormProps) {
  const t = translations[language];

  // Form states
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [gradeClass, setGradeClass] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [guardianOccupation, setGuardianOccupation] = useState('');
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [earningMembers, setEarningMembers] = useState<number>(1);
  const [houseType, setHouseType] = useState<'owned' | 'rented'>('owned');
  const [isOrphan, setIsOrphan] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [academicMarks, setAcademicMarks] = useState<number>(0);
  const [stepfundNeeded, setStepfundNeeded] = useState<number>(0);
  const [reasonForHelp, setReasonForHelp] = useState('');

  // Loaded documents represented as Base64 strings for robust direct retrieval
  const [documents, setDocuments] = useState<ApplicationDocuments>({});
  
  // Application Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [successApp, setSuccessApp] = useState<StudentApplication | null>(null);
  const [showEmailNotice, setShowEmailNotice] = useState(false);

  // Drag and drop highlights
  const [dragActive, setDragActive] = useState<{ [key: string]: boolean }>({});

  // Trigger dynamic score calculation on change
  const currentComputedScore = calculateNeedScore({
    monthlyIncome,
    isOrphan,
    isDisabled,
    familyMembers,
    earningMembers,
    academicMarks
  });
  const severity = getNeedSeverity(currentComputedScore);

  // File to Base64 parser
  const handleFileRead = (file: File, key: keyof ApplicationDocuments) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large! Maximum limit is 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setDocuments(prev => ({
        ...prev,
        [key]: {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: e.target?.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (fieldKey: keyof ApplicationDocuments, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileRead(files[0], fieldKey);
    }
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent, key: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [key]: active }));
  };

  const handleDrop = (e: React.DragEvent, key: keyof ApplicationDocuments) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [key]: false }));

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileRead(files[0], key);
    }
  };

  const removeFile = (key: keyof ApplicationDocuments) => {
    setDocuments(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Submit form payload safely
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !fatherName || !cnic || !phone || !address || !schoolName || !gradeClass || monthlyIncome <= 0 || academicMarks <= 0 || stepfundNeeded <= 0) {
      setErrorStatus(language === 'en' ? "Please fulfill all required fields including a valid income, academic marks, and requested StepFund." : "براہ کرم تعلیمی نمبر، ماہانہ آمدنی اور مطلوبہ اسٹیپ فنڈ سمیت تمام لازمی فیلڈز مکمل کریں۔");
      return;
    }

    setIsSubmitting(true);
    setErrorStatus(null);

    // Generate standard unique IDs
    const currentYear = new Date().getFullYear();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedStudentId = `SF-${currentYear}-${randomHex}`;

    // Document ID: Align to studentId to allow secure public single document tracking gets
    const applicationDocId = generatedStudentId;

    const newApplicationPayload: StudentApplication = {
      id: applicationDocId,
      studentId: generatedStudentId,
      fullName,
      fatherName,
      cnic,
      phone,
      address,
      schoolName,
      gradeClass,
      monthlyIncome: Number(monthlyIncome),
      guardianOccupation,
      familyMembers: Number(familyMembers),
      earningMembers: Number(earningMembers),
      houseType,
      isOrphan,
      isDisabled,
      academicMarks: Number(academicMarks),
      stepfundNeeded: Number(stepfundNeeded),
      reasonForHelp,
      needScore: currentComputedScore,
      status: 'Pending',
      adminNotes: '',
      documents,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // Use setDoc for precise transactional creation
      await setDoc(doc(db, 'applications', applicationDocId), {
        ...newApplicationPayload,
        createdAt: serverTimestamp(), // Ensure server timestamps enforce rules
        updatedAt: serverTimestamp()
      });

      setSuccessApp(newApplicationPayload);
      setShowEmailNotice(true);
      
      // Auto-clear Form Inputs
      setFullName('');
      setFatherName('');
      setCnic('');
      setPhone('');
      setAddress('');
      setSchoolName('');
      setGradeClass('');
      setMonthlyIncome(0);
      setGuardianOccupation('');
      setFamilyMembers(4);
      setEarningMembers(1);
      setHouseType('owned');
      setIsOrphan(false);
      setIsDisabled(false);
      setAcademicMarks(0);
      setStepfundNeeded(0);
      setReasonForHelp('');
      setDocuments({});
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.CREATE, `applications/${applicationDocId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFileInput = (label: string, fieldKey: keyof ApplicationDocuments) => {
    const uploadedFile = documents[fieldKey];
    const isOver = dragActive[fieldKey];

    return (
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          {label}
        </label>
        <div
          onDragOver={(e) => handleDrag(e, fieldKey, true)}
          onDragLeave={(e) => handleDrag(e, fieldKey, false)}
          onDrop={(e) => handleDrop(e, fieldKey)}
          className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer ${
            uploadedFile 
              ? 'border-emerald-550 dark:border-yellow-400 bg-emerald-50/40 dark:bg-yellow-400/10' 
              : isOver
                ? 'border-emerald-500 dark:border-yellow-400 bg-emerald-50 dark:bg-yellow-400/15 scale-[0.99]'
                : 'border-gray-300 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-yellow-400/50 bg-white dark:bg-black/45'
          }`}
        >
          {uploadedFile ? (
            <div className="w-full flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-emerald-100 dark:bg-yellow-400/10 text-emerald-600 dark:text-yellow-400 rounded-lg shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-neutral-100 truncate pr-4">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 select-none">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(fieldKey);
                }}
                className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                title="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <input
                id={`file-input-${fieldKey}`}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleInputChange(fieldKey, e)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="text-gray-400 dark:text-yellow-450 mb-2 mt-1" size={24} />
              <p className="text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-0.5">
                <span className="text-emerald-600 dark:text-yellow-400 hover:underline">{t.chooseFile}</span> {t.dragAndDrop}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-neutral-500 select-none">
                PDF, JPG, PNG (Max 2MB)
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Dynamic Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-sans font-bold text-gray-900 dark:text-white tracking-tight mb-3">
          {t.studentApplicationForm}
        </h1>
        <p className="text-emerald-600 dark:text-emerald-400 font-sans font-medium text-sm">
          {language === 'en' ? 'Sadiqon Automated Poverty Indexing System v2.6' : 'صدیقون خودکار تصدیقی عمل'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Core Submission Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8 bg-white dark:bg-[#08080a] border-2 border-neutral-300 dark:border-neutral-850 rounded-3xl p-6 md:p-8 shadow-2xl">
          
          {errorStatus && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-black rounded-xl flex items-center gap-2 border-2 border-red-200 dark:border-red-900/30">
              <AlertCircle size={18} />
              <span>{errorStatus}</span>
            </div>
          )}

          {/* Section 1: Name, Guardian & Personal Identifiers */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-950 dark:text-white flex items-center gap-2 border-b-2 border-neutral-300 dark:border-neutral-800 pb-2">
              <User size={18} className="text-emerald-600 dark:text-emerald-400" />
              {t.personalInfoSection}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.fullName} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                  placeholder="e.g. Jawad Ahmad"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.fatherName} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                  placeholder="Father or guardian's full name"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.cnic} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                  placeholder="e.g. 42101-1234567-9"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.phone} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                  placeholder="e.g. +923001234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.address} <span className="text-red-500">*</span></label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white resize-none"
                placeholder="Residential permanent or present address"
              />
            </div>
          </div>

          {/* Section 2: Academic background */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-950 dark:text-white flex items-center gap-2 border-b-2 border-neutral-300 dark:border-neutral-800 pb-2">
              <BookOpen size={18} className="text-emerald-600 dark:text-emerald-400" />
              {t.academicSection}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.schoolName} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                  placeholder="Full name of target educational institution"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.gradeClass} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={gradeClass}
                  onChange={(e) => setGradeClass(e.target.value)}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                  placeholder="e.g. BS Software Dev Sem 4, Grade 12"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.academicMarks} <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={academicMarks || ''}
                  onChange={(e) => setAcademicMarks(Number(e.target.value))}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                  placeholder={t.academicMarksPlaceholder}
                />
              </div>
            </div>
          </div>
                 {/* Section 3: Financial metrics */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-950 dark:text-white flex items-center gap-2 border-b-2 border-neutral-300 dark:border-neutral-850 pb-2">
              <Landmark size={18} className="text-emerald-600 dark:text-yellow-400" />
              {t.financialSection}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.monthlyIncome} <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min="0"
                  value={monthlyIncome || ''}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                  placeholder="Monthly total household income"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.stepfundNeeded} <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stepfundNeeded || ''}
                  onChange={(e) => setStepfundNeeded(Number(e.target.value))}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                  placeholder={t.stepfundNeededPlaceholder}
                />
                <p className="text-[10px] text-gray-400 dark:text-neutral-400 mt-1 select-none">{t.stepfundHelpText}</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.guardianOccupation}</label>
                <input
                  type="text"
                  value={guardianOccupation}
                  onChange={(e) => setGuardianOccupation(e.target.value)}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                  placeholder="e.g. Laborer, Widowed cleaner"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.familyMembers}</label>
                <input
                  type="number"
                  min="1"
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(Number(e.target.value))}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.earningMembers}</label>
                <input
                  type="number"
                  min="0"
                  value={earningMembers}
                  onChange={(e) => setEarningMembers(Number(e.target.value))}
                  className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.houseType}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    key="btn-owned"
                    type="button"
                    onClick={() => setHouseType('owned')}
                    className={`py-3 px-4 text-sm font-black rounded-xl border-2 transition-all ${
                      houseType === 'owned'
                        ? 'border-emerald-600 dark:border-yellow-400 text-emerald-900 dark:text-yellow-450 bg-emerald-50 dark:bg-yellow-400/10'
                        : 'border-gray-250 dark:border-neutral-800 text-gray-700 dark:text-neutral-200 hover:dark:border-yellow-400/50 bg-white dark:bg-black/30'
                    }`}
                  >
                    {t.owned}
                  </button>
                  <button
                    key="btn-rented"
                    type="button"
                    onClick={() => setHouseType('rented')}
                    className={`py-3 px-4 text-sm font-black rounded-xl border-2 transition-all ${
                      houseType === 'rented'
                        ? 'border-emerald-600 dark:border-yellow-400 text-emerald-950 dark:text-yellow-450 bg-emerald-50 dark:bg-yellow-400/10'
                        : 'border-gray-250 dark:border-neutral-800 text-gray-700 dark:text-neutral-200 hover:dark:border-yellow-400/50 bg-white dark:bg-black/30'
                    }`}
                  >
                    {t.rented}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.isOrphan}</label>
                  <button
                    type="button"
                    onClick={() => setIsOrphan(!isOrphan)}
                    className={`w-full py-3 px-3 text-xs font-black rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 ${
                      isOrphan
                        ? 'border-emerald-600 dark:border-yellow-400 text-emerald-950 dark:text-yellow-450 bg-emerald-50 dark:bg-yellow-400/10'
                        : 'border-gray-250 dark:border-neutral-800 text-gray-700 dark:text-neutral-200 hover:dark:border-yellow-400/50 bg-white dark:bg-black/30'
                    }`}
                  >
                    <Check size={14} strokeWidth={3} className={isOrphan ? "opacity-100" : "opacity-0"} />
                    {t.isOrphanYes}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.isDisabled}</label>
                  <button
                    type="button"
                    onClick={() => setIsDisabled(!isDisabled)}
                    className={`w-full py-3 px-3 text-xs font-black rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 ${
                      isDisabled
                        ? 'border-emerald-600 dark:border-yellow-400 text-emerald-950 dark:text-yellow-450 bg-emerald-50 dark:bg-yellow-400/10'
                        : 'border-gray-250 dark:border-neutral-800 text-gray-700 dark:text-neutral-200 hover:dark:border-yellow-400/50 bg-white dark:bg-black/30'
                    }`}
                  >
                    <Check size={14} strokeWidth={3} className={isDisabled ? "opacity-100" : "opacity-0"} />
                    {t.isDisabledYes}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-2">{t.reasonForHelp}</label>
              <textarea
                value={reasonForHelp}
                onChange={(e) => setReasonForHelp(e.target.value)}
                rows={3}
                className="w-full bg-white dark:bg-black border-2 border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:dark:border-yellow-400 text-gray-900 dark:text-white"
                placeholder="Explain family hurdles, other siblings studying, etc."
              />
            </div>
          </div>

          {/* Section 4: Document scanner */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-950 dark:text-white flex items-center gap-2 border-b-2 border-neutral-300 dark:border-neutral-850 pb-2">
              <FileText size={18} className="text-emerald-600 dark:text-yellow-400" />
              {t.documentsSection}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFileInput(t.feeSlip, 'feeSlip')}
              {renderFileInput(t.resultCard, 'resultCard')}
              {renderFileInput(t.utilityBill, 'utilityBill')}
              {renderFileInput(t.studentIdCard, 'studentIdCard')}
              {renderFileInput(t.recommendationLetters, 'recommendationLetters')}
              {renderFileInput(t.houseImages, 'houseImages')}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-yellow-400 dark:hover:bg-yellow-500 cursor-pointer text-white dark:text-black font-black rounded-xl transition-all shadow-lg hover:shadow-emerald-600/25 dark:shadow-yellow-400/10 flex items-center justify-center gap-2 disabled:opacity-40 text-base"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                <span>{t.submitting}</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>{t.submitApplication}</span>
              </>
            )}
          </button>
        </form>

        {/* Dynamic Poverty Scoring Realtime Meter Panels */}
        <div className="lg:sticky lg:top-8 space-y-6">
          <div className="bg-black/90 text-white rounded-2xl p-6 shadow-xl border border-neutral-800/80 flex flex-col items-center text-center">
            <div className="p-3 bg-yellow-400/10 rounded-2xl mb-4 text-yellow-400 self-center">
              <Sparkles size={24} />
            </div>
            
            <h3 className="text-base font-bold mb-1 font-sans">{t.needScoreTitle}</h3>
            <p className="text-yellow-450 font-sans text-xs tracking-wide">Poverty Verification Diagnostics</p>
            
            {/* Visual Gauge Out of 100 */}
            <div className="relative w-36 h-36 flex items-center justify-center mt-6 select-none">
              {/* Circular track */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-neutral-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-yellow-400 transition-all duration-700 ease-out"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - currentComputedScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black font-mono leading-none text-white">{currentComputedScore}</span>
                <span className="text-[10px] text-yellow-400 font-semibold tracking-wider mt-1">PKR WEIGHT</span>
              </div>
            </div>

            <div className="mt-6 w-full px-4 py-2.5 rounded-xl bg-yellow-450/5 border border-yellow-400/20">
              <p className="text-xs text-neutral-300 mb-0.5 select-none text-center">Index Priority:</p>
              <p className="text-sm font-black text-yellow-400 tracking-wide text-center uppercase">
                {language === 'en' ? severity.label : severity.urduLabel}
              </p>
            </div>

            <p className="text-[11px] text-neutral-400/80 leading-relaxed mt-4">
              * The diagnostic score changes automatically as you configure income parameters or demographic structures.
            </p>
          </div>

          {/* Guidelines Box */}
          <div className="bg-white dark:bg-[#070709] border border-neutral-200 dark:border-neutral-850 rounded-2xl p-6 shadow-sm select-none">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-neutral-100 mb-3 flex items-center gap-1.5">
              <AlertCircle size={15} className="text-emerald-600 dark:text-yellow-450" />
              Evaluation Matrix Rules
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-neutral-400">
              <li className="flex justify-between items-center bg-emerald-500/5 dark:bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                <span className="font-semibold text-emerald-800 dark:text-emerald-400">Monthly Income &lt; 30,000</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+33 Pts</span>
              </li>
              <li className="flex justify-between items-center bg-emerald-500/5 dark:bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                <span className="font-semibold text-emerald-800 dark:text-emerald-400">Academic Standard &gt; 80%</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+8 Pts</span>
              </li>
              <li className="flex justify-between items-center bg-emerald-500/5 dark:bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                <span className="font-semibold text-emerald-800 dark:text-emerald-400">Matrix Combo Match Rule</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+10 Pts</span>
              </li>
              <li className="flex justify-between">
                <span>Orphan Household Status</span>
                <span className="font-bold text-gray-700 dark:text-neutral-300">+25 Pts</span>
              </li>
              <li className="flex justify-between">
                <span>Student Disability Status</span>
                <span className="font-bold text-gray-700 dark:text-neutral-300">+15 Pts</span>
              </li>
              <li className="flex justify-between">
                <span>Dependent Ratio Index</span>
                <span className="font-bold text-gray-700 dark:text-neutral-300">Up to +12 Pts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Modal & Simulated Student Notification Receipt */}
      <AnimatePresence>
        {successApp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-neutral-900 max-w-xl w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 shadow-2xl relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full mb-4">
                  <CheckCircle2 size={36} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.successTitle}
                </h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed max-w-sm">
                  {t.successDesc}
                </p>

                {/* Secure Unique Application ID */}
                <div className="mt-5 w-full bg-slate-50 dark:bg-neutral-800/60 rounded-xl px-4 py-3 border border-dashed border-emerald-500/50">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-neutral-400 mb-1">
                    {t.yourTrackingId}
                  </p>
                  <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {successApp.studentId}
                  </p>
                </div>

                {/* Simulated Student Email Notification Dashboard */}
                {showEmailNotice && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 w-full bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-left"
                  >
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2 select-none">
                      <Mail size={14} />
                      {t.emailNoticeSim}
                    </p>
                    <div className="text-[11px] text-gray-600 dark:text-neutral-300 font-mono space-y-1">
                      <p><strong>To:</strong> {successApp.fullName} (Registered WhatsApp: {successApp.phone})</p>
                      <p><strong>Subject:</strong> Sadiqon Financial Aid Confirmation [{successApp.studentId}]</p>
                      <p className="pt-2 select-none text-gray-500 dark:text-neutral-400">
                        Hello {successApp.fullName}, we have successfully recorded your aid profile detailing school standard &quot;{successApp.schoolName}&quot; with an automated support Weight Priority index of {successApp.needScore}/100. Sadiqon Foundation verifiers will review your fee slips within 5 workdays. Use ID {successApp.studentId} to check status online!
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-3 w-full">
                  <button
                    onClick={() => setSuccessApp(null)}
                    className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 text-gray-800 dark:text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Close & Return
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
