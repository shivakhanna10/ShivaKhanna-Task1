import React from 'react';

/**
 * Frosted Glassmorphism Metric Card (inspired by Image 1 & Image 4).
 * Uses translucent milky frosted glass, top specular border reflection, and neon glowing icon capsules.
 */
export default function StatCard({ title, value, subtitle, icon: Icon, accent = 'blue' }) {
  const accentStyles = {
    blue: 'text-cyan-200 bg-cyan-500/25 border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    emerald: 'text-emerald-200 bg-emerald-500/25 border-emerald-400/40 shadow-[0_0_15px_rgba(52,211,153,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    amber: 'text-amber-200 bg-amber-500/25 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    rose: 'text-rose-200 bg-rose-500/25 border-rose-400/40 shadow-[0_0_15px_rgba(244,63,94,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    slate: 'text-white bg-white/20 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)]'
  };

  const style = accentStyles[accent] || accentStyles.blue;

  return (
    <div className="bg-white/[0.12] hover:bg-white/[0.18] backdrop-blur-2xl border border-white/25 hover:border-white/40 rounded-2xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.4)] transition-all flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">{title}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums drop-shadow-sm">{value}</p>
        {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl border backdrop-blur-md ${style}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
