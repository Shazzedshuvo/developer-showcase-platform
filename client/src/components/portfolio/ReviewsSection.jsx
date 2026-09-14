import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, X, ZoomIn, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeZoomImage, setActiveZoomImage] = useState(null);

  useEffect(() => {
    api
      .get('/reviews')
      .then(({ data }) => setReviews(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-zinc-800/80">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 mb-4">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>100% 5-Star Verified Client Reviews</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Trusted by Companies <span className="text-gradient-primary">&amp; Partners</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Real feedback and reviews from company projects, marketing agencies, and direct business partners.
        </p>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="card p-6 h-64 animate-pulse bg-slate-100 dark:bg-zinc-900" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="card p-6 flex flex-col justify-between group card-hover-effect hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300"
            >
              <div>
                {/* Top Row: Stars + Platform Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating || 5 }).map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{rev.platform && rev.platform !== 'Fiverr' ? rev.platform : 'Verified Partner'}</span>
                  </span>
                </div>

                {/* Screenshot thumbnail if available */}
                {rev.image && (
                  <div
                    onClick={() => setActiveZoomImage(rev.image)}
                    className="relative w-full h-40 bg-slate-100 dark:bg-zinc-950 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 mb-4 cursor-pointer group/img"
                  >
                    <img
                      src={rev.image}
                      alt={rev.clientName ? `${rev.clientName} review screenshot` : 'Client Review'}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-semibold">
                      <ZoomIn className="w-4 h-4" />
                      <span>View Screenshot</span>
                    </div>
                  </div>
                )}

                {/* Comment / Quote */}
                {rev.comment && (
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-4">
                    "{rev.comment}"
                  </p>
                )}
              </div>

              {/* Client Info Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {rev.clientName || 'Verified Client'}
                  </h4>
                  {rev.country && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{rev.country}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>5.0 Rating</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Screenshot Zoom Modal */}
      <AnimatePresence>
        {activeZoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveZoomImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-2"
            >
              <button
                onClick={() => setActiveZoomImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={activeZoomImage}
                alt="Enlarged review screenshot"
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
