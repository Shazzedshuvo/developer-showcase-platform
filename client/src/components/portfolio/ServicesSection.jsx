import { motion } from 'framer-motion';
import { Layers, Globe, Sparkles, ShoppingBag, Code2, Zap, ArrowUpRight, Check } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      title: 'Wix Studio & Custom Velo',
      description: 'Custom responsive design, complex fluid layouts, database collections, and custom JavaScript animations built in Wix Studio.',
      icon: Layers,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      features: ['Wix Studio Responsive Grids', 'Custom Velo (JS) Integrations', 'Dynamic CMS Collections', 'Payment & Booking Systems'],
    },
    {
      title: 'Squarespace 7.1 Development',
      description: 'High-converting, bespoke Squarespace websites with custom CSS/JavaScript styling, blog architecture, and lead generation forms.',
      icon: Globe,
      color: 'from-slate-400/20 to-zinc-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
      features: ['Custom CSS & Code Injections', 'Fluid Engine 7.1 Architecture', 'Member Areas & Courses', 'Appointment & Form Setup'],
    },
    {
      title: 'Webflow CMS & 3D Interactions',
      description: 'Clean HTML/CSS structure, Webflow CMS collections, and micro-interactions for high-growth SaaS and agency landing pages.',
      icon: Sparkles,
      color: 'from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      features: ['Figma to Webflow Translation', 'Custom GSAP / Lottie Animations', 'Complex CMS Filtering', 'Client-First Standards'],
    },
    {
      title: 'Shopify E-Commerce Stores',
      description: 'High-converting storefronts with custom theme modifications, sticky checkouts, product variant options, and app setups.',
      icon: ShoppingBag,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      features: ['Liquid Theme Customization', 'Conversion Rate Optimization', 'Payment & Currency Gateways', 'Speed & Checkout Optimization'],
    },
    {
      title: 'WordPress & Custom Elementor',
      description: 'Scalable WordPress development with Elementor Pro, Advanced Custom Fields (ACF), and custom theme builds.',
      icon: Code2,
      color: 'from-sky-500/20 to-blue-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      features: ['Elementor Pro Custom Templates', 'ACF & Custom Post Types', 'Core Web Vitals 95+ Speed', 'Enterprise Security Setup'],
    },
    {
      title: 'Full-Stack & Speed Optimization',
      description: 'End-to-end custom web applications with React, Node.js, Tailwind CSS, API integrations, and Google PageSpeed boosting.',
      icon: Zap,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      features: ['MERN Stack Applications', 'Mobile First Responsive QA', 'SEO On-Page & Schema Markup', 'Rapid 24-48h Delivery'],
    },
  ];

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Specialized Services</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Everything You Need to <span className="text-gradient-primary">Dominate Online</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          From full platform builds to custom code enhancements, I deliver complete end-to-end web development with obsessive attention to detail.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="card p-7 flex flex-col justify-between group hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div>
                {/* Icon Box */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${srv.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {srv.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2.5 mb-8">
                  {srv.features.map((ft, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{ft}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors pt-4 border-t border-slate-100 dark:border-zinc-800/80 cursor-pointer"
              >
                <span>Request this service</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
