import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { StudentApplication, TranslationLanguage } from '../types';
import { translations } from '../translations';
import { getNeedSeverity } from '../utils/povertyScorer';
import { 
  Search, AlertCircle, Phone, Calendar, Clock, CheckCircle2, 
  CornerDownRight, ArrowRight, Hourglass, HelpCircle, FileCheck2 
} from 'lucide-react';

interface TrackingSectionProps {
  language: TranslationLanguage;
}

export default function TrackingSection({ language }: TrackingSectionProps) {
  const t = translations[language];

  // Search input state
  const [trackingId, setTrackingId] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedApp, setSearchedApp] = useState<StudentApplication | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setSearching(true);
    setSearchError(null);
    setSearchedApp(null);

    // Normalize input
    const targetId = trackingId.toUpperCase().trim();

    try {
      // Secure single document GET query (permitted publicly under firestore.rules)
      const appRef = doc(db, 'applications', targetId);
      const docSnap = await getDoc(appRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSearchedApp({
          ...data,
          id: docSnap.id,
          createdAt: data.createdAt?.seconds 
            ? new Date(data.createdAt.seconds * 1000).toISOString() 
            : (data.createdAt || new Date().toISOString()),
          updatedAt: data.updatedAt?.seconds 
            ? new Date(data.updatedAt.seconds * 1000).toISOString() 
            : (data.updatedAt || new Date().toISOString())
        } as StudentApplication);
      } else {
        setSearchError(t.noAppFound);
      }
    } catch (err) {
      console.error(err);
      setSearchError(language === 'en' ? "Failed to establish secure handshake with Sadiqon Servers." : "سرور رابطہ قائم کرنے میں ناکامی۔");
    } finally {
      setSearching(false);
    }
  };

  const getStatusIndex = (status: StudentApplication['status']): number => {
    switch (status) {
      case 'Pending': return 0;
      case 'Under Review': return 1;
      case 'Verified': return 2;
      case 'Approved': return 3;
      case 'Rejected': return 3; // terminal status
      default: return 0;
    }
  };

  // Timeline render helper
  const renderStatusTracker = (app: StudentApplication) => {
    const steps = [
      { id: 'Pending', label: 'Registered', urLabel: 'درج ہو گئی' },
      { id: 'Under Review', label: 'In Review', urLabel: 'جائزہ جاری' },
      { id: 'Verified', label: 'Verified', urLabel: 'تصدیق شدہ' },
      { id: 'Approved', label: 'Approved & Active', urLabel: 'منظور شدہ' }
    ];

    const currentStepIndex = getStatusIndex(app.status);
    const isRejected = app.status === 'Rejected';

    return (
      <div className="w-full select-none">
        
        {isRejected ? (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 rounded-xl mb-6 text-sm flex items-center gap-2.5">
            <AlertCircle size={18} />
            <div>
              <p className="font-bold">Application Record Rejected</p>
              <p className="text-xs text-rose-600 dark:text-rose-400/90 mt-0.5">Please check the comments left by the verifiers or contact the foundation.</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center relative mb-8">
            {/* Background progress bar */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 dark:bg-neutral-850 -translate-y-1/2 -z-10" />
            <div 
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              className="absolute top-1/2 left-0 h-1 bg-emerald-500 dark:bg-yellow-400 -translate-y-1/2 -z-10 transition-all duration-1000 ease-out" 
            />

            {steps.map((st, idx) => {
              const isDone = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={st.id} className="flex flex-col items-center relative">
                  <div className={`p-1.5 rounded-full border-2 transition-all duration-500 scale-90 md:scale-100 ${
                    isDone 
                      ? isCurrent 
                        ? 'bg-white dark:bg-[#0c0c0f] border-emerald-500 dark:border-yellow-400 text-emerald-500 dark:text-yellow-400 scale-110 shadow-lg shadow-emerald-500/10 dark:shadow-yellow-400/20'
                        : 'bg-emerald-500 dark:bg-yellow-400 border-emerald-500 dark:border-yellow-400 text-white dark:text-black'
                      : 'bg-white dark:bg-[#0c0c0f] border-gray-200 dark:border-neutral-800 text-gray-300'
                  }`}>
                    {isDone && !isCurrent ? (
                      <CheckCircle2 size={12} className="fill-white dark:fill-black text-emerald-500 dark:text-yellow-400" />
                    ) : (
                      <Clock size={12} />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold mt-2 ${
                    isDone 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-400 dark:text-neutral-500'
                  }`}>
                    {language === 'en' ? st.label : st.urLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 select-none">
      {/* Intro section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-sans font-black text-gray-950 dark:text-white mb-3 leading-tight">
          {t.trackTitle}
        </h1>
        <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200 leading-relaxed max-w-md mx-auto">
          {t.trackDesc}
        </p>
      </div>

      {/* Tracker Entry Section */}
      <form onSubmit={handleTrackSubmit} className="flex gap-2.5 bg-white dark:bg-black p-2.5 border-2 border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-xl mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-yellow-450" size={18} />
          <input
            type="text"
            required
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder={t.enterTrackingId}
            className="w-full bg-transparent border-none pl-10 pr-3 py-2.5 text-sm font-black font-mono text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white dark:text-black text-xs font-black rounded-xl transition-all shadow-md hover:shadow-emerald-500/30 shrink-0 cursor-pointer disabled:opacity-40"
        >
          {searching ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            t.trackAppBtn
          )}
        </button>
      </form>

      {/* Outcomes logs */}
      <AnimatePresence mode="wait">
        {searchError && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="p-4 bg-orange-50 dark:bg-orange-950/25 text-orange-900 dark:text-orange-300 rounded-xl border-2 border-orange-200 dark:border-orange-900/40 text-sm font-black flex items-center gap-2"
          >
            <AlertCircle size={18} />
            <span>{searchError}</span>
          </motion.div>
        )}

        {searchedApp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white dark:bg-[#07070a] border-2 border-neutral-300 dark:border-neutral-850 rounded-3xl p-6 shadow-xl"
          >
            {/* Top header */}
            <div className="flex justify-between items-start border-b-2 border-slate-100 dark:border-neutral-850 pb-4 mb-5">
              <div>
                <span className="font-mono text-xs font-black text-emerald-700 dark:text-yellow-400 tracking-wider">
                  {searchedApp.studentId}
                </span>
                <h3 className="text-xl font-black font-sans text-gray-950 dark:text-white mt-1 font-sans">
                  {searchedApp.fullName}
                </h3>
                <p className="text-xs font-bold text-gray-700 dark:text-neutral-300 mt-1">{searchedApp.schoolName}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-black text-gray-800 dark:text-neutral-400 block mb-1">
                  {language === 'en' ? 'Submission date' : 'جمع کروانے کی تاریخ'}
                </span>
                <span className="font-mono text-xs font-black text-gray-900 dark:text-neutral-100">
                  {new Date(searchedApp.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Stepper progress tracker */}
            {renderStatusTracker(searchedApp)}

            {/* General parameters */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans mt-8 bg-neutral-50 dark:bg-black p-4 border-2 border-slate-200 dark:border-neutral-850 rounded-xl">
              <div>
                <p className="text-[10px] uppercase text-gray-800 dark:text-neutral-400 font-bold mb-0.5 select-none">Status</p>
                <span className="font-black text-emerald-750 dark:text-yellow-405">{searchedApp.status}</span>
              </div>

              <div>
                <p className="text-[10px] uppercase text-gray-800 dark:text-neutral-400 font-bold mb-0.5 select-none">Assessment Score</p>
                <span className="font-black text-gray-950 dark:text-yellow-400">{searchedApp.needScore} / 100</span>
              </div>

              <div className="col-span-2 border-t-2 border-slate-200 dark:border-neutral-850 pt-2.5 mt-1">
                <p className="text-[10px] uppercase text-gray-800 dark:text-neutral-400 font-bold mb-0.5 select-none">Verifiers Notes</p>
                <p className="text-xs font-bold text-gray-800 dark:text-neutral-200 italic">
                  {searchedApp.adminNotes ? searchedApp.adminNotes : t.notesPlaceholder}
                </p>
              </div>
            </div>

            {/* WhatsApp CTA Action buttons */}
            <div className="mt-6 space-y-2.5">
              <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-neutral-400 text-center select-none block mb-1">
                {language === 'en' ? 'Contact our Representatives on WhatsApp:' : 'واٹس ایپ پر ہمارے نمائندوں سے رابطہ کریں:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/923325883253?text=Hello%20Sadiqon%20Foundation%2C%20I%20want%20to%20query%20the%20progress%20of%20my%20financial%20aid%20with%20ID%20${searchedApp.studentId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white dark:text-black font-black rounded-xl text-center text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Phone size={13} className="fill-white dark:fill-black text-emerald-600 dark:text-yellow-400 shrink-0" />
                  <span>Helpdesk 1 (+92 332 5883253)</span>
                </a>
                <a
                  href={`https://wa.me/923170530957?text=Hello%20Sadiqon%20Foundation%2C%20I%20want%20to%20query%20the%20progress%20of%20my%20financial%20aid%20with%20ID%20${searchedApp.studentId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white dark:text-black font-black rounded-xl text-center text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Phone size={13} className="fill-white dark:fill-black text-emerald-600 dark:text-yellow-400 shrink-0" />
                  <span>Helpdesk 2 (+92 317 0530957)</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
