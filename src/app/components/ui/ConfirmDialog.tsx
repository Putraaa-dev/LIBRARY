import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen, title, message, confirmLabel = 'Konfirmasi', cancelLabel = 'Batal',
  onConfirm, onCancel, variant = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const colors = {
    danger: { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'text-red-500', btn: 'bg-red-600 hover:bg-red-700' },
    warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-500', btn: 'bg-amber-600 hover:bg-amber-700' },
    info: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-500', btn: 'bg-blue-600 hover:bg-blue-700' },
  }[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6"
        style={{ animation: 'fadeScaleIn 0.2s ease-out' }}
      >
        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
          <AlertTriangle size={22} className={colors.icon} />
        </div>
        <h3 className="text-slate-800 dark:text-slate-100 mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '1.05rem' }}>{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            style={{ fontWeight: 500 }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-sm text-white ${colors.btn} rounded-lg transition-colors shadow-sm`}
            style={{ fontWeight: 500 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
