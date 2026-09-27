import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export default function Toast() {
  const { toast, showToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: CheckCircle2,
    info: Info,
    error: AlertCircle
  };

  const colors = {
    success: 'bg-slate-950/85 backdrop-blur-xl border-emerald-500/30 text-white shadow-emerald-500/10',
    info: 'bg-slate-950/85 backdrop-blur-xl border-blue-500/30 text-white shadow-blue-500/10',
    error: 'bg-slate-950/85 backdrop-blur-xl border-rose-500/30 text-white shadow-rose-500/10'
  };

  const iconColors = {
    success: 'text-emerald-400',
    info: 'text-blue-400',
    error: 'text-rose-400'
  };

  const IconComponent = icons[toast.type] || Info;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in slide-in-from-bottom-3 duration-200">
      <div
        className={`flex items-start gap-3 p-3.5 rounded-lg border shadow-2xl ${
          colors[toast.type] || colors.info
        }`}
      >
        <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
        <div className="text-xs sm:text-sm font-medium pr-2 text-slate-100">{toast.message}</div>
        <button
          type="button"
          onClick={() => showToast(null)}
          className="text-slate-400 hover:text-white ml-auto p-0.5"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
