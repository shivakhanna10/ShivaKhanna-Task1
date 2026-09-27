import React from 'react';
import { useApp } from '../../context/AppContext';
import ProgressBar from '../common/ProgressBar';
import StatCard from '../common/StatCard';
import { CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';

/**
 * Student's personal progress overview with authentic frosted glassmorphism (Image 1 & 4).
 * Calculates completion rate and shows individual neon progress bar based strictly on their own data.
 */
export default function StudentProgressBanner() {
  const { currentUser, getStudentStats } = useApp();
  const stats = getStudentStats(currentUser.id);

  return (
    <div className="space-y-5 mb-6">
      {/* Student Welcome & Personal Progress Glass Card */}
      <div className="bg-white/[0.12] backdrop-blur-2xl border border-white/25 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.4)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/15">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
                Student Workspace
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-lg font-mono font-bold bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.3)] backdrop-blur-md">
                {currentUser.studentId}
              </span>
            </div>
            <p className="text-sm text-white/70 mt-1">
              Logged in as <span className="font-bold text-white">{currentUser.name}</span> ({currentUser.department})
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 border border-white/25 rounded-xl px-4 py-2.5 self-start md:self-auto backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]">
            <div className="text-right">
              <span className="text-xs text-white/70 block">Personal Completion</span>
              <span className="text-lg font-extrabold text-white tabular-nums drop-shadow-xs">
                {stats.submittedCount} of {stats.totalAssignments} Completed
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar Visualization with Neon Glow */}
        <div className="pt-5">
          <ProgressBar
            value={stats.submittedCount}
            max={stats.totalAssignments}
            label="Overall Coursework Progress"
            sublabel={`${stats.submittedCount}/${stats.totalAssignments} assignments submitted`}
            height="h-3.5"
            colorScheme={stats.completionPercentage === 100 ? 'emerald' : 'blue'}
          />
        </div>
      </div>

      {/* Real Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assigned"
          value={stats.totalAssignments}
          subtitle="Course assignments"
          icon={FileText}
          accent="slate"
        />
        <StatCard
          title="Submitted"
          value={stats.submittedCount}
          subtitle="Confirmed submissions"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="Pending"
          value={stats.pendingCount}
          subtitle="Awaiting submission"
          icon={Clock}
          accent="amber"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueCount}
          subtitle="Past due deadline"
          icon={AlertTriangle}
          accent="rose"
        />
      </div>
    </div>
  );
}
