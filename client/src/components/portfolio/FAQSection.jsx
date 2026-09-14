import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'Which platforms do you specialize in?',
      a: 'I specialize in Wix & Wix Studio, Squarespace 7.1, Webflow CMS, WordPress (Elementor Pro & ACF), Shopify E-commerce, Kajabi course portals, and custom full-stack web development (React / Node.js).',
    },
    {
      q: 'How fast can you deliver a complete website?',
      a: 'A standard 5-8 page business website usually takes between 3 to 7 business days. For urgent or smaller single-page landing pages, 24 to 48-hour express delivery is available upon request.',
    },
    {
      q: 'Can you write custom code (CSS/JavaScript/Velo) on Wix or Squarespace?',
      a: 'Yes, absolutely! I write custom JavaScript/Velo for Wix Studio and advanced CSS/JS injections on Squarespace to create custom animations, calculators, member areas, and third-party API connections.',
    },
    {
      q: 'Will my website look great on mobile phones and tablets?',
      a: 'Yes. 100% of my websites are designed mobile-first. I rigorously test on multiple device resolutions (iPhone, Android, iPads, laptops, and ultra-wide screens) to ensure flawless responsiveness.',
    },
    {
      q: 'Do you help with SEO and Google PageSpeed optimization?',
      a: 'Yes! Every build includes on-page SEO setup (proper title tags, meta descriptions, image alt tags, schema markup) and Core Web Vitals optimization so your site loads in under 1.5 seconds.',
    },
    {
      q: 'Do you offer post-launch support after the site is completed?',
      a: 'Yes, all projects include 30 days of complimentary post-launch support and a video walkthrough tutorial so you can easily edit text and images whenever you want.',
    },
  ];

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-zinc-800/80">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Got Questions? <span className="text-gradient-primary">I've Got Answers</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Everything you need to know about working together and bringing your project to life.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className={`card overflow-hidden transition-all duration-200 ${
                isOpen ? 'border-indigo-500/50 shadow-md' : 'hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 select-none cursor-pointer"
              >
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  {faq.q}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-zinc-800/60">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
