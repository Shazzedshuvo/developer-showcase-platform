import { useEffect, useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ReviewForm from '../../components/admin/ReviewForm';
import api from '../../api/axios';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchReviews = () => {
    setLoading(true);
    api.get('/reviews')
      .then(({ data }) => setReviews(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchReviews, []);

  const handleSaved = (data) => setReviews((prev) => [data, ...prev]);

  const handleDelete = async () => {
    try {
      await api.delete(`/reviews/${deleteTarget._id}`);
      setReviews((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      toast.success('Review deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Reviews &amp; Testimonials</h1>
          <p className="text-slate-500 text-sm mt-1">Client feedback and review screenshots</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-all"
        >
          <Plus size={15} /> Upload Review
        </button>
      </div>

      {/* Reviews grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse aspect-[4/3] bg-zinc-800" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">
          <p className="text-sm">No reviews yet. Upload your first client review screenshot!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="card overflow-hidden group relative">
              {/* Stars + meta */}
              <div className="px-4 pt-3 pb-2.5 flex items-center justify-between border-b border-zinc-800">
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">
                    {review.platform}{review.clientName && ` · ${review.clientName}`}
                  </span>
                  <button
                    onClick={() => setDeleteTarget(review)}
                    className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {/* Screenshot */}
              <img
                src={review.image}
                alt="Review screenshot"
                className="w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload Review Screenshot"
      >
        <ReviewForm
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        message="Delete this review? The Cloudinary image will also be removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
