import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from './translations';
import { TranslationLanguage } from './types';
import StudentForm from './components/StudentForm';
import AdminPanel from './components/AdminPanel';
import HeroSection from './components/HeroSection';
import DonationSection from './components/DonationSection';
import TrackingSection from './components/TrackingSection';
import { 
  Menu, X, Globe, Moon, Sun, Heart, GraduationCap, 
  HelpCircle, ChevronRight, CheckCircle2, Phone, Sparkles 
} from 'lucide-react';

export default function App() {
  // Global States
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [language, setLanguage] = useState<TranslationLanguage>('en');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const t = translations[language];

  // Load and sync Dark Mode selection with tailwind root document
  useEffect(() => {
    const stored = localStorage.getItem('sadiqon-dark');
    const isDark = stored === null ? true : stored === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem('sadiqon-dark', String(newVal));
    if (newVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ur' : 'en'));
  };

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-black text-white selection:bg-yellow-500/30' 
        : 'bg-slate-100 text-neutral-900 selection:bg-emerald-500/20'
    }`}>
      {/* Dynamic Top Announcement Ribbon */}
      <div className="bg-gradient-to-r from-emerald-900 to-black text-white text-[10px] md:text-xs py-2 px-4 shadow-sm text-center select-none flex items-center justify-center gap-1.5 font-sans font-bold border-b border-emerald-800/20">
        <Sparkles size={13} className="text-yellow-400 animate-pulse" />
        <span>
          {language === 'en' 
            ? 'Zakat or Sadaqah: Provide direct fee endorsements to needy students across Pakistan.' 
            : 'زکوٰۃ اور عام عطیات: غریب طلباء کے فیس واؤچرز کی براہ راست ادائیگی یقینی بنائیں۔'}
        </span>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-black/95 border-b border-neutral-200 dark:border-neutral-900 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Brand Name */}
          <button 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="p-2 bg-emerald-600 dark:bg-yellow-500 dark:text-black rounded-xl text-white shadow-md shadow-emerald-500/10 dark:shadow-yellow-500/10 group-hover:scale-105 transition-transform">
              <GraduationCap size={18} />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-gray-900 dark:text-white leading-none block">
                {t.brand}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-emerald-600 dark:text-yellow-400 font-extrabold mt-0.5 block leading-none">
                {translations[language].motto}
              </span>
            </div>
          </button>

          {/* Desktop Navigation routes */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-neutral-200 select-none">
            <button
              onClick={() => navigateTo('home')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'home' 
                  ? 'bg-emerald-50 dark:bg-yellow-400/10 text-emerald-700 dark:text-yellow-400 border border-transparent dark:border-yellow-400/25' 
                  : 'hover:text-emerald-600 dark:hover:text-yellow-400'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => navigateTo('apply')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'apply' 
                  ? 'bg-emerald-50 dark:bg-yellow-400/10 text-emerald-700 dark:text-yellow-400 border border-transparent dark:border-yellow-400/25' 
                  : 'hover:text-emerald-600 dark:hover:text-yellow-400'
              }`}
            >
              {t.navApply}
            </button>
            <button
              onClick={() => navigateTo('track')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'track' 
                  ? 'bg-emerald-50 dark:bg-yellow-400/10 text-emerald-700 dark:text-yellow-400 border border-transparent dark:border-yellow-400/25' 
                  : 'hover:text-emerald-600 dark:hover:text-yellow-400'
              }`}
            >
              {t.navTrack}
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'admin' 
                  ? 'bg-emerald-50 dark:bg-yellow-400/10 text-emerald-700 dark:text-yellow-400 border border-transparent dark:border-yellow-400/25' 
                  : 'hover:text-emerald-600 dark:hover:text-yellow-400'
              }`}
            >
              {t.navAdmin}
            </button>
          </nav>

          {/* Core Visual Action controls */}
          <div className="flex items-center gap-2">
            {/* Dark mode switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2 border border-neutral-200/60 dark:border-neutral-900 bg-white dark:bg-neutral-950 text-gray-600 dark:text-neutral-200 rounded-xl transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900 shrink-0 cursor-pointer"
              title="Theme Switcher"
            >
              {darkMode ? <Sun size={15} className="text-yellow-400" /> : <Moon size={15} />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 h-[34px] border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 text-xs font-bold rounded-xl transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Globe size={13} />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* Responsive Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-400 rounded-xl transition-all hover:bg-neutral-50 shrink-0 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Pop-out Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-slate-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 transition-colors duration-300 select-none overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2.5 text-xs font-bold">
              <button
                onClick={() => navigateTo('home')}
                className={`py-3 px-4 rounded-xl text-left transition-colors ${
                  currentRoute === 'home' ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-neutral-400'
                }`}
              >
                {t.navHome}
              </button>
              <button
                onClick={() => navigateTo('apply')}
                className={`py-3 px-4 rounded-xl text-left transition-colors ${
                  currentRoute === 'apply' ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-neutral-400'
                }`}
              >
                {t.navApply}
              </button>
              <button
                onClick={() => navigateTo('track')}
                className={`py-3 px-4 rounded-xl text-left transition-colors ${
                  currentRoute === 'track' ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-neutral-400'
                }`}
              >
                {t.navTrack}
              </button>
              <button
                onClick={() => navigateTo('admin')}
                className={`py-3 px-4 rounded-xl text-left transition-colors ${
                  currentRoute === 'admin' ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-neutral-400'
                }`}
              >
                {t.navAdmin}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Dynamic Content Switcher Router */}
      <main className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute + language}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {currentRoute === 'home' && (
              <div className="space-y-12 pb-16">
                <HeroSection language={language} onNavigate={navigateTo} />
                <DonationSection language={language} />
              </div>
            )}

            {currentRoute === 'apply' && (
              <div className="pb-16 pt-4">
                <StudentForm language={language} />
              </div>
            )}

            {currentRoute === 'track' && (
              <div className="pb-16 pt-4">
                <TrackingSection language={language} />
              </div>
            )}

            {currentRoute === 'admin' && (
              <div className="pb-16 pt-4">
                <AdminPanel language={language} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sadiqon Foundation Footer card */}
      <footer className="w-full bg-white dark:bg-black border-t border-neutral-100 dark:border-neutral-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left select-none">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
                <GraduationCap size={16} />
              </div>
              <h4 className="font-sans font-bold text-sm text-gray-900 dark:text-white">{t.brand}</h4>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-neutral-400 leading-relaxed">
              Sadiqon Trust is a registered non-profit organization helping low-income children and students complete university and school enrollments without financial boundaries.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-neutral-200 mb-3 block">{t.contactUs}</h4>
            <p className="text-[11px] text-gray-500 dark:text-neutral-400 mb-2 leading-relaxed">{t.contactUsDesc}</p>
            <div className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 space-y-1">
              <p>WhatsApp 1: +92 332 5883253</p>
              <p>WhatsApp 2: +92 317 0530957</p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end justify-between">
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-4">
              Registered Pakistani NGO Trust
            </span>

            <div className="text-left md:text-right">
              <p className="text-[11px] text-neutral-400 leading-normal mb-1">
                {t.footerRights}
              </p>
              <p className="text-[10px] text-neutral-500 italic block">
                Zakat Certified #PK-IS-0042-SADIQON
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
