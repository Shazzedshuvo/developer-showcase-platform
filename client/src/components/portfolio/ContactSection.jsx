import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, MessageSquare, Clock, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platform: 'Wix Studio',
    budget: '$600 - $1,500',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_146x3in';
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_8i5dvqd';
  const AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID || 'template_mu8gnxa';
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'v37X1dqWUizfVgITv';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const firstName = formData.name.trim().split(' ')[0] || formData.name;
    const emailSubject = `[Portfolio Inquiry] ${formData.platform} Website (${formData.budget})`;

    const adminTemplateParams = {
      from_name: formData.name,
      from_email: formData.email,
      reply_to: formData.email,
      subject: emailSubject,
      platform: formData.platform,
      budget: formData.budget,
      message: `Preferred Platform: ${formData.platform}\nEstimated Budget: ${formData.budget}\n\nClient Message:\n${formData.message}`,
    };

    const clientAutoReplyParams = {
      first_name: firstName,
      from_name: formData.name,
      to_name: formData.name,
      to_email: formData.email,
      from_email: formData.email,
      subject: `${formData.platform} Project Inquiry`,
      message: formData.message,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, adminTemplateParams, PUBLIC_KEY);
      try {
        await emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE_ID, clientAutoReplyParams, PUBLIC_KEY);
      } catch (autoReplyErr) {
        console.warn('Auto-reply notice:', autoReplyErr);
      }

      setSubmitted(true);
      toast.success('🎉 Message sent successfully! I will reply to your email shortly.');
    } catch (error) {
      console.error('EmailJS Send Error:', error);
      toast.error(
        error?.text || 'Failed to send message via EmailJS. Please email directly at shazzedshuvo@gmail.com'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-zinc-800/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Pitch & Info */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available for New Projects</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Let's Build Something <span className="text-gradient-primary">Extraordinary</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Have a project in mind, need a custom redesign, or want to consult on your website architecture? Send me a message and I'll reply with a custom estimate within a few hours.
            </p>
          </div>

          {/* Quick Contact Points */}
          <div className="space-y-4">
            <div className="card p-4 flex items-center gap-4 hover:border-indigo-400/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Direct Email
                </span>
                <a
                  href="mailto:shazzedshuvo@gmail.com"
                  className="text-sm font-bold text-slate-900 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  shazzedshuvo@gmail.com
                </a>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-4 hover:border-emerald-400/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Average Response Time
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                  Under 2 Hours (24/7)
                </span>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-4 hover:border-purple-400/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Work Engagement
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                  Agency, Direct Contract &amp; Remote
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive EmailJS Form */}
        <div className="lg:col-span-7">
          <div className="card p-6 sm:p-10 shadow-xl relative overflow-hidden">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Inquiry Received!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out! Your message was delivered directly to <strong className="text-slate-900 dark:text-slate-200 font-bold">shazzedshuvo@gmail.com</strong>, and a confirmation has been sent to your email.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      platform: 'Wix Studio',
                      budget: '$600 - $1,500',
                      message: '',
                    });
                  }}
                  className="btn-secondary !text-xs !py-2 !px-5 mt-4 cursor-pointer"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Your Name *</label>
                    <input
                      type="text"
                      name="from_name"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Your Email *</label>
                    <input
                      type="email"
                      name="from_email"
                      required
                      placeholder="e.g. alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Preferred Platform</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="input cursor-pointer font-medium"
                    >
                      <option value="Wix Studio">Wix &amp; Wix Studio</option>
                      <option value="Squarespace">Squarespace 7.1</option>
                      <option value="Webflow">Webflow CMS</option>
                      <option value="WordPress">WordPress / Elementor</option>
                      <option value="Shopify">Shopify Store</option>
                      <option value="Kajabi">Kajabi Portal</option>
                      <option value="Custom Code">Custom Code / React</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Estimated Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="input cursor-pointer font-medium"
                    >
                      <option value="$300 - $600">$300 – $600 (Quick Launch / Redesign)</option>
                      <option value="$600 - $1,500">$600 – $1,500 (Standard Complete Website)</option>
                      <option value="$1,500 - $3,000">$1,500 – $3,000 (E-commerce / Complex CMS)</option>
                      <option value="$3,000+">$3,000+ (Enterprise / Custom Application)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Project Details &amp; Scope *</label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    placeholder="Tell me about your project goals, references, number of pages, or existing site URL..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input resize-none font-normal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full !py-3.5 !text-sm group cursor-pointer"
                >
                  {submitting ? (
                    <span>Sending Inquiry via EmailJS...</span>
                  ) : (
                    <>
                      <span>Send Project Inquiry</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
