import React from 'react';
import { motion } from 'motion/react';
import { translations } from '../translations';
import { Sparkles, HeartHandshake, ShieldCheck, Milestone, GraduationCap } from 'lucide-react';

interface HeroSectionProps {
  language: 'en' | 'ur';
  onNavigate: (route: string) => void;
}

export default function HeroSection({ language, onNavigate }: HeroSectionProps) {
  const t = translations[language];

  return (
    <div className="relative py-14 overflow-hidden">
      {/* Subtle Overlay to enhance backdrop readability */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-neutral-50/5 dark:to-neutral-950/20 -z-10" />

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Brand headlines */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black tracking-wider bg-emerald-100/90 dark:bg-yellow-400/10 text-emerald-800 dark:text-yellow-400 rounded-full uppercase border border-emerald-300/30 dark:border-yellow-400/20">
            <Sparkles size={11} className="text-emerald-600 dark:text-yellow-400 animate-pulse" />
            <span>Empowering Education Through Transparency</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-black text-gray-950 dark:text-white leading-tight tracking-tight">
            {t.heroTitle}
          </h1>

          <p className="text-base md:text-lg text-gray-850 dark:text-neutral-100 leading-relaxed font-sans max-w-xl opacity-100">
            {t.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => onNavigate('apply')}
              className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white dark:text-black font-black rounded-xl transition-all shadow-lg dark:shadow-yellow-400/20 text-base flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transform"
            >
              <GraduationCap size={20} />
              <span>{t.applyButton}</span>
            </button>

            <button
              onClick={() => onNavigate('track')}
              className="px-6 py-4 border-2 border-emerald-600 dark:border-neutral-800 bg-white dark:bg-black hover:bg-emerald-50 dark:hover:bg-neutral-900 text-emerald-700 dark:text-white hover:text-emerald-800 dark:hover:text-yellow-400 dark:hover:border-yellow-400 font-black rounded-xl transition-all text-base flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transform shadow-md"
            >
              <HeartHandshake size={20} className="dark:text-yellow-400" />
              <span>{t.trackButton}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Trust & Credentials Badging */}
        <div className="lg:col-span-5 relative">
          <div className="bg-gradient-to-tr from-neutral-950 via-[#101012] to-[#121216] text-white rounded-3xl p-6 md:p-8 shadow-2xl relative border border-neutral-800 overflow-hidden">
            {/* Ambient glows inside card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />

            <h3 className="text-xl font-black tracking-tight flex items-center gap-2 mb-3 text-white dark:text-yellow-400">
              <ShieldCheck className="text-emerald-500 dark:text-yellow-400" />
              {t.howItWorks}
            </h3>
            
            <p className="text-xs md:text-sm text-neutral-200 leading-relaxed mb-6 font-semibold">
              {t.howItWorksDesc}
            </p>

            {/* Metric steps list */}
            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <span className="shrink-0 p-2 bg-emerald-800/80 dark:bg-yellow-400/10 border border-emerald-400/40 dark:border-yellow-400/20 rounded-xl text-emerald-300 dark:text-yellow-400 text-xs font-black leading-none select-none">01</span>
                <div>
                  <h4 className="text-xs md:text-sm font-black text-white dark:text-yellow-300 uppercase tracking-wider">{language === 'en' ? 'Verifiable Slip Screening' : 'تعلیمی رسید کی تصدیق'}</h4>
                  <p className="text-[11px] md:text-xs text-neutral-200 mt-1 leading-normal font-medium">Students upload current semester fee slips and result cards directly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="shrink-0 p-2 bg-emerald-800/80 dark:bg-yellow-400/10 border border-emerald-400/40 dark:border-yellow-400/20 rounded-xl text-emerald-300 dark:text-yellow-400 text-xs font-black leading-none select-none">02</span>
                <div>
                  <h4 className="text-xs md:text-sm font-black text-white dark:text-yellow-300 uppercase tracking-wider">{language === 'en' ? 'Objective Ratio Index' : 'خودکار تناسب'}</h4>
                  <p className="text-[11px] md:text-xs text-neutral-200 mt-1 leading-normal font-medium">Automated calculators map earners-to-family scales of student profiles.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="shrink-0 p-2 bg-emerald-800/80 dark:bg-yellow-400/10 border border-emerald-400/40 dark:border-yellow-400/20 rounded-xl text-emerald-300 dark:text-yellow-400 text-xs font-black leading-none select-none">03</span>
                <div>
                  <h4 className="text-xs md:text-sm font-black text-white dark:text-yellow-300 uppercase tracking-wider">{language === 'en' ? 'Verified Fund Routing' : 'شفاف تقسیم'}</h4>
                  <p className="text-[11px] md:text-xs text-neutral-200 mt-1 leading-normal font-medium">Approved allocations disburse directly to schools to secure tuition fees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
