import React from 'react';

/**
 * Neon Glass Effect Progress Bar (inspired directly by the reference image).
 * Features a dark translucent frosted capsule track and an intensely glowing neon progress line.
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  sublabel,
  height = 'h-3',
  showPercent = true,
  colorScheme = 'blue'
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  // Determine neon glow color fill
  const getBarColor = () => {
    if (colorScheme === 'emerald' || percentage === 100) {
      return 'bg-emerald-400 shadow-[0_0_12px_#34d399,0_0_24px_rgba(52,211,153,0.6)]';
    }
    if (colorScheme === 'amber') {
      return 'bg-amber-400 shadow-[0_0_12px_#fbbf24,0_0_24px_rgba(251,191,36,0.6)]';
    }
    if (percentage >= 70) {
      return 'bg-cyan-400 shadow-[0_0_12px_#22d3ee,0_0_24px_rgba(34,211,238,0.6)]';
    }
    if (percentage >= 40) {
      return 'bg-blue-400 shadow-[0_0_12px_#60a5fa,0_0_24px_rgba(96,165,250,0.6)]';
    }
    return 'bg-slate-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]';
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs mb-2 font-medium text-white/90">
          <div className="flex items-center gap-1.5">
            {label && <span className="font-semibold text-white drop-shadow-xs">{label}</span>}
            {sublabel && <span className="text-white/60 font-normal">({sublabel})</span>}
          </div>
          {showPercent && (
            <span className="font-bold text-white tabular-nums drop-shadow-xs">
              {percentage}%
            </span>
          )}
        </div>
      )}
      {/* Frosted dark glass capsule track with specular border */}
      <div
        className={`w-full bg-black/40 rounded-full p-0.5 border border-white/20 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] ${height}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full ${getBarColor()} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
