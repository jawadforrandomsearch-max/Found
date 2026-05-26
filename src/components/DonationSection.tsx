import React from 'react';
import { motion } from 'motion/react';
import { translations } from '../translations';
import { Heart, ShieldCheck, ClipboardCheck, MessageSquare, PhoneCall, ArrowUpRight } from 'lucide-react';

interface DonationSectionProps {
  language: 'en' | 'ur';
}

export default function DonationSection({ language }: DonationSectionProps) {
  const t = translations[language];

  const contact1 = "+923325883253";
  const contact2 = "+923170530957";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left column: Text, trust & guarantees */}
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-full border border-rose-200 dark:border-rose-900/30">
            <Heart size={11} className="fill-rose-700 text-rose-700 dark:fill-rose-300 dark:text-rose-300 animate-pulse" />
            <span>Islamic & General Charity Acceptable</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-sans font-black text-gray-950 dark:text-white tracking-tight leading-tight">
            {t.donationSectionTitle}
          </h2>

          <p className="text-base md:text-lg text-gray-800 dark:text-neutral-100 leading-relaxed max-w-lg opacity-100">
            {t.donationSectionDesc}
          </p>

          <div className="space-y-6 pt-2">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-black text-gray-950 dark:text-white uppercase tracking-wider">100% Zakat Transparency</h4>
                <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-neutral-300 mt-1 leading-relaxed">Our evaluation pipeline links student receipts directly, guaranteeing proper distribution.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                <ClipboardCheck size={22} />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-black text-gray-950 dark:text-white uppercase tracking-wider">Registered Trust Certification</h4>
                <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-neutral-300 mt-1 leading-relaxed">All sponsors receive digitized application tracking keys and direct progress audits.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Beautiful WhatsApp Contact Panel */}
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] bg-emerald-600/5 dark:bg-yellow-400/5 rounded-[40px] blur-3xl -z-10" />

          <div className="bg-white dark:bg-[#08080b] border-2 border-neutral-300 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block p-3.5 bg-emerald-100 dark:bg-yellow-400/10 text-emerald-600 dark:text-yellow-400 rounded-full mb-1">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-950 dark:text-white font-sans tracking-tight">
                {language === 'en' ? 'Direct Donation via WhatsApp' : 'ایک طالب علم کو براہ راست سپانسر کریں'}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-neutral-400 leading-relaxed font-medium">
                {language === 'en' 
                  ? 'Connect with our representatives directly on WhatsApp to coordinate Zakat, general Sadqah payments, or verify academic fee voucher allocations.' 
                  : 'زکوٰۃ، صدقات یا کسی غریب مستحق طالب علم کی فیس براہ راست ادا کرنے اور تصدیق کے لیے ہمارے ان دو واٹس ایپ نمبروں پر رابطہ کریں۔'}
              </p>
            </div>

            {/* Contacts Container Card list */}
            <div className="space-y-4">
              {/* Representative #1 */}
              <a
                href={`https://wa.me/${contact1.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 dark:border-neutral-800 hover:border-emerald-600 hover:dark:border-yellow-400 bg-neutral-50 dark:bg-neutral-900/30 transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <div className="p-2.5 bg-emerald-500/10 dark:bg-yellow-400/10 text-emerald-600 dark:text-yellow-400 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-yellow-400 block leading-none mb-1">
                      {language === 'en' ? 'Sadiqon Helpdesk 1' : 'صدیقون نمائندہ ۱'}
                    </span>
                    <span className="text-base font-black font-mono text-gray-900 dark:text-white tracking-wide">
                      {contact1}
                    </span>
                  </div>
                </div>
                <div className="p-1.5 bg-neutral-200/50 dark:bg-neutral-800 group-hover:bg-emerald-600 dark:group-hover:bg-yellow-400 text-neutral-600 dark:text-neutral-400 group-hover:text-white dark:group-hover:text-black rounded-lg transition-colors shrink-0">
                  <ArrowUpRight size={14} strokeWidth={3} />
                </div>
              </a>

              {/* Representative #2 */}
              <a
                href={`https://wa.me/${contact2.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 dark:border-neutral-800 hover:border-emerald-600 hover:dark:border-yellow-400 bg-neutral-50 dark:bg-neutral-900/30 transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <div className="p-2.5 bg-emerald-500/10 dark:bg-yellow-400/10 text-emerald-600 dark:text-yellow-400 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-yellow-400 block leading-none mb-1">
                      {language === 'en' ? 'Sadiqon Helpdesk 2' : 'صدیقون نمائندہ ۲'}
                    </span>
                    <span className="text-base font-black font-mono text-gray-900 dark:text-white tracking-wide">
                      {contact2}
                    </span>
                  </div>
                </div>
                <div className="p-1.5 bg-neutral-200/50 dark:bg-neutral-800 group-hover:bg-emerald-600 dark:group-hover:bg-yellow-400 text-neutral-600 dark:text-neutral-400 group-hover:text-white dark:group-hover:text-black rounded-lg transition-colors shrink-0">
                  <ArrowUpRight size={14} strokeWidth={3} />
                </div>
              </a>
            </div>

            {/* Notice Footer inside the card */}
            <div className="p-3 bg-neutral-50 dark:bg-black/45 rounded-xl border border-dashed border-gray-200 dark:border-neutral-800 text-center">
              <p className="text-[11px] font-semibold text-gray-500 dark:text-neutral-400 leading-normal">
                {language === 'en' 
                  ? 'Note: We never ask for pin codes or bank passwords. Sadiqon operates on a direct sponsorship-voucher system.' 
                  : 'ضروری نوٹ: فاؤنڈیشن کبھی بھی آپ کے بینک پاس ورڈ یا پن کوڈز نہیں مانگتی۔ صدیقون فاؤنڈیشن صرف براہ راست تعلیمی فیس واؤچرز کی بنیاد پر کام کرتی ہے۔'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
