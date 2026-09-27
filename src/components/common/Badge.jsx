import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, User } from 'lucide-react';

/**
 * Clean, glassmorphic status badge component.
 * Uses translucent frosted backgrounds, glowing specular borders, and neon lighting accents.
 */
export default function Badge({ variant = 'neutral', text, size = 'sm', icon = true }) {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  const variants = {
    submitted: {
      bg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)]',
      icon: CheckCircle2,
      label: text || 'Submitted'
    },
    pending: {
      bg: 'bg-amber-500/20 text-amber-200 border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)]',
      icon: Clock,
      label: text || 'Pending'
    },
    overdue: {
      bg: 'bg-rose-500/20 text-rose-200 border-rose-400/40 shadow-[0_0_12px_rgba(244,63,94,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)]',
      icon: AlertTriangle,
      label: text || 'Overdue'
    },
    admin: {
      bg: 'bg-indigo-500/25 text-indigo-200 border-indigo-400/40 shadow-[0_0_12px_rgba(129,140,248,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)]',
      icon: ShieldCheck,
      label: text || 'Admin / Faculty'
    },
    student: {
      bg: 'bg-blue-500/25 text-blue-200 border-blue-400/40 shadow-[0_0_12px_rgba(96,165,250,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)]',
      icon: User,
      label: text || 'Student'
    },
    neutral: {
      bg: 'bg-white/15 text-white border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]',
      icon: null,
      label: text || 'General'
    }
  };

  const current = variants[variant] || variants.neutral;
  const IconComponent = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md backdrop-blur-md ${sizeClasses} ${current.bg}`}
    >
      {icon && IconComponent && <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{current.label}</span>
    </span>
  );
}
