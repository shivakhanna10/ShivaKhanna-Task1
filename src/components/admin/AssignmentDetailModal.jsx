import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ExternalLink,
  Calendar
} from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import { formatDateTime } from '../../utils/helpers';

export default function AssignmentDetailModal({ assignment, isOpen, onClose }) {
  const { getAssignmentSubmissions } = useApp();
  const [filter, setFilter] = useState('ALL'); // ALL, SUBMITTED, NOT_SUBMITTED

  const submissionData = useMemo(() => {
    if (!assignment) return null;
    return getAssignmentSubmissions(assignment.id);
  }, [assignment, getAssignmentSubmissions]);

  if (!isOpen || !assignment || !submissionData) return null;

  const { studentStatusList, submittedCount, totalStudents, rate } = submissionData;

  const filteredList = studentStatusList.filter((item) => {
    if (filter === 'SUBMITTED') return item.isSubmitted;
    if (filter === 'NOT_SUBMITTED') return !item.isSubmitted;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-950/85 backdrop-blur-3xl rounded-2xl border border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-white/15 flex items-center justify-between bg-white/[0.04]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-cyan-200 bg-cyan-500/25 px-2.5 py-0.5 rounded-lg border border-cyan-400/40 backdrop-blur-md shadow-[0_0_10px_rgba(34,211,238,0.25)]">
                {assignment.courseCode}
              </span>
              <span className="text-xs text-white/70 font-medium">
                {assignment.courseName}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-tight drop-shadow-xs">
              {assignment.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Progress Overview with Neon Glow */}
          <div className="p-4.5 bg-white/[0.08] border border-white/20 rounded-2xl space-y-3.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-white/80">
                <Calendar className="w-3.5 h-3.5 text-white/60" />
                <span>Deadline: <strong className="text-white font-bold">{formatDateTime(assignment.dueDate)}</strong></span>
              </div>
              {assignment.driveLink && (
                <a
                  href={assignment.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 font-bold"
                >
                  <span>Open Class Submission Folder</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <ProgressBar
              value={submittedCount}
              max={totalStudents}
              label="Class Submission Rate"
              sublabel={`${submittedCount} of ${totalStudents} students submitted`}
              height="h-3.5"
              colorScheme={rate === 100 ? 'emerald' : 'blue'}
            />
          </div>

          {/* Submissions Filter Tabs */}
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Student Submissions ({totalStudents})
            </h3>
            <div className="flex items-center gap-1 bg-black/25 p-1 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 text-xs rounded-lg transition font-bold ${
                  filter === 'ALL'
                    ? 'bg-white/25 text-white shadow-[0_0_12px_rgba(255,255,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                All ({totalStudents})
              </button>
              <button
                type="button"
                onClick={() => setFilter('SUBMITTED')}
                className={`px-3 py-1 text-xs rounded-lg transition font-bold ${
                  filter === 'SUBMITTED'
                    ? 'bg-emerald-500/25 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-emerald-400/40'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Submitted ({submittedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('NOT_SUBMITTED')}
                className={`px-3 py-1 text-xs rounded-lg transition font-bold ${
                  filter === 'NOT_SUBMITTED'
                    ? 'bg-amber-500/25 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-amber-400/40'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Pending ({totalStudents - submittedCount})
              </button>
            </div>
          </div>

          {/* Student List */}
          <div className="space-y-3">
            {filteredList.map(({ student, isSubmitted, submissionDetails }) => (
              <div
                key={student.id}
                className="p-4 border border-white/20 rounded-xl hover:border-white/35 transition bg-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/90 border border-blue-400/30 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {student.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {student.name}
                        </span>
                        <span className="text-xs font-mono text-white/60">
                          ({student.studentId})
                        </span>
                      </div>
                      <span className="text-xs text-white/70">
                        {student.email} • {student.department}
                      </span>
                    </div>
                  </div>

                  <div>
                    {isSubmitted ? (
                      <Badge variant="submitted" text="Submitted" />
                    ) : (
                      <Badge variant="pending" text="Not Submitted" />
                    )}
                  </div>
                </div>

                {/* Submission Details if submitted */}
                {isSubmitted && submissionDetails && (
                  <div className="mt-3.5 pt-3.5 border-t border-white/15 text-xs text-white/80 space-y-2 bg-black/25 p-3 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Submitted at:</span>
                      <span className="font-mono text-cyan-200 font-semibold">
                        {formatDateTime(submissionDetails.submittedAt)}
                      </span>
                    </div>

                    {submissionDetails.driveSubmissionLink && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white/60">Student Drive Link:</span>
                        <a
                          href={submissionDetails.driveSubmissionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 font-bold truncate max-w-xs"
                        >
                          <span className="truncate">{submissionDetails.driveSubmissionLink}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    )}

                    {submissionDetails.notes && (
                      <div className="pt-1.5 text-white/90 border-t border-white/10">
                        <span className="text-white/50 block text-[11px] mb-0.5">Notes:</span>
                        <p className="italic">"{submissionDetails.notes}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/15 bg-white/[0.04] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl transition backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
