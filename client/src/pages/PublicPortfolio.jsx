import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/portfolio/HeroSection';
import PlatformMarquee from '../components/portfolio/PlatformMarquee';
import CategoryFilter from '../components/portfolio/CategoryFilter';
import ProjectGrid from '../components/portfolio/ProjectGrid';
import ProjectModal from '../components/portfolio/ProjectModal';
import ServicesSection from '../components/portfolio/ServicesSection';
import ProcessSection from '../components/portfolio/ProcessSection';
import ReviewsSection from '../components/portfolio/ReviewsSection';
import FAQSection from '../components/portfolio/FAQSection';
import ContactSection from '../components/portfolio/ContactSection';
import api from '../api/axios';

export default function PublicPortfolio() {
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]); // For counting totals
  const [settings, setSettings] = useState({ teamName: 'Dont Worry' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories, all projects, and settings once
  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/projects'),
      api.get('/settings').catch(() => ({ data: { teamName: 'Dont Worry' } })),
    ])
      .then(([catRes, projRes, setRes]) => {
        setCategories(catRes.data);
        setAllProjects(projRes.data);
        setProjects(projRes.data);
        if (setRes.data) setSettings(setRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter projects on category click
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return allProjects;
    if (activeCategory === 'recent') return allProjects.filter((p) => p.isRecentActive || p.isRecent);
    return allProjects.filter((p) => p.category?.slug === activeCategory);
  }, [allProjects, activeCategory]);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const counts = {
      total: allProjects.length,
      recent: allProjects.filter((p) => p.isRecentActive || p.isRecent).length,
    };
    allProjects.forEach((p) => {
      const slug = p.category?.slug;
      if (slug) {
        counts[slug] = (counts[slug] || 0) + 1;
      }
    });
    return counts;
  }, [allProjects]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <HeroSection
          totalProjects={allProjects.length || 78}
          teamName={settings?.teamName || 'Dont Worry'}
        />

        {/* 2. Platform Badges Marquee */}
        <PlatformMarquee />

        {/* 3. Projects Showcase Section */}
        <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 mb-4">
              <span>Selected Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Explore 75+ <span className="text-gradient-primary">Client Websites</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Browse through real client projects built on Wix Studio, Squarespace, Webflow, Shopify, WordPress, and Custom Code.
            </p>
          </div>

          {/* Category Filter Pills */}
          <CategoryFilter
            categories={categories}
            activeSlug={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />

          {/* Project Grid */}
          <ProjectGrid
            projects={filteredProjects}
            loading={loading}
            onSelect={setSelectedProject}
          />
        </section>

        {/* 4. Services Section */}
        <ServicesSection />

        {/* 5. Development Process Section */}
        <ProcessSection />

        {/* 6. 5-Star Reviews Section */}
        <ReviewsSection />

        {/* 7. FAQ Section */}
        <FAQSection />

        {/* 8. Contact & Inquiry Section */}
        <ContactSection />
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
