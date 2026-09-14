import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmDialog — used before destructive delete actions.
 */
export default function ConfirmDialog({ isOpen, onConfirm, onCancel, message = 'Are you sure you want to delete this?' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-sm bg-[#131316] border border-zinc-800 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-1">Confirm Delete</h4>
                <p className="text-sm text-slate-500">{message}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-slate-400 text-sm hover:bg-zinc-800 transition-all">
                Cancel
              </button>
              <button onClick={onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all">
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
