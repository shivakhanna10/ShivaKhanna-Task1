import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../common/Badge';
import {
  Calendar,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Award
} from 'lucide-react';
import { formatDateTime, isOverdue, getTimeRemainingText } from '../../utils/helpers';

export default function AssignmentCard({ assignment, onOpenSubmitModal }) {
  const { currentUser, getStudentSubmission, unsubmitAssignment } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [showUnsubmitConfirm, setShowUnsubmitConfirm] = useState(false);

  const submission = getStudentSubmission(assignment.id, currentUser.id);
  const isSubmitted = !!submission;
  const overdue = isOverdue(assignment.dueDate);

  // Determine status variant
  const statusVariant = isSubmitted ? 'submitted' : overdue ? 'overdue' : 'pending';

  const handleUnsubmit = () => {
    unsubmitAssignment(assignment.id, currentUser.id);
    setShowUnsubmitConfirm(false);
  };

  return (
    <div className="bg-white/[0.12] hover:bg-white/[0.17] backdrop-blur-2xl border border-white/25 hover:border-white/40 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.4)] transition-all flex flex-col justify-between">
      <div>
        {/* Card Header: Course & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-cyan-200 bg-cyan-500/25 px-2.5 py-0.5 rounded-lg border border-cyan-400/40 backdrop-blur-md shadow-[0_0_10px_rgba(34,211,238,0.25)]">
            {assignment.courseCode}
          </span>
          <div className="flex items-center gap-1.5">
            <Badge variant={statusVariant} />
          </div>
        </div>

        {/* Title & Course Name */}
        <h3 className="text-base font-bold text-white leading-snug mb-1 drop-shadow-xs">
          {assignment.title}
        </h3>
        <p className="text-xs text-white/70 font-medium mb-3">
          {assignment.courseName}
        </p>

        {/* Description */}
        <p
          className={`text-xs text-white/80 leading-relaxed mb-3 ${
            expanded ? '' : 'line-clamp-2'
          }`}
        >
          {assignment.description}
        </p>

        {assignment.description.length > 120 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 mb-3 inline-flex items-center gap-0.5"
          >
            <span>{expanded ? 'Show less' : 'Read full prompt'}</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}

        {/* Meta details: Points, Due Date */}
        <div className="space-y-2 py-3.5 border-y border-white/15 text-xs text-white/80">
          <div className="flex items-center justify-between">
            <span className="text-white/60 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-white/60" />
              <span>Due Date:</span>
            </span>
            <span className="font-semibold text-white">
              {formatDateTime(assignment.dueDate)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/60 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-white/60" />
              <span>Weight / Points:</span>
            </span>
            <span className="font-bold text-white">{assignment.points} pts</span>
          </div>

          {!isSubmitted && (
            <div className="flex items-center justify-between">
              <span className="text-white/60">Timeline:</span>
              <span
                className={`text-[11px] font-bold ${
                  overdue ? 'text-rose-300' : 'text-white/80'
                }`}
              >
                {getTimeRemainingText(assignment.dueDate)}
              </span>
            </div>
          )}
        </div>

        {/* Submitted Info Box if student has submitted */}
        {isSubmitted && (
          <div className="mt-3.5 p-3.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs space-y-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(52,211,153,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <div className="flex items-center justify-between text-emerald-200 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Submitted on:
              </span>
              <span className="text-[11px] font-mono text-emerald-200">
                {formatDateTime(submission.submittedAt)}
              </span>
            </div>

            {submission.driveSubmissionLink && (
              <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-emerald-400/20">
                <span className="text-white/70 text-[11px]">Your Attached Link:</span>
                <a
                  href={submission.driveSubmissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 text-[11px] font-bold truncate max-w-[170px]"
                >
                  <span className="truncate">{submission.driveSubmissionLink}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            )}

            {submission.notes && (
              <p className="text-[11px] text-white/90 pt-1 italic border-t border-emerald-400/20">
                "{submission.notes}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-5 mt-2 space-y-2.5">
        {/* Drive submission folder link created by professor */}
        {assignment.driveLink && (
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl transition backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
          >
            <span>Open Course Submission Drive</span>
            <ExternalLink className="w-3 h-3 text-white/70" />
          </a>
        )}

        {/* Submission Action Buttons */}
        {!isSubmitted ? (
          <button
            type="button"
            onClick={() => onOpenSubmitModal(assignment)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600/85 hover:bg-blue-500 rounded-xl transition border border-blue-300/50 shadow-[0_0_20px_rgba(37,99,235,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md"
          >
            <FileCheck className="w-4 h-4 text-cyan-200" />
            <span>Confirm & Submit Assignment</span>
          </button>
        ) : (
          <div>
            {!showUnsubmitConfirm ? (
              <button
                type="button"
                onClick={() => setShowUnsubmitConfirm(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-rose-300 hover:bg-rose-500/20 border border-transparent hover:border-rose-400/30 rounded-xl transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Need to edit submission? Unsubmit</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-500/20 border border-rose-400/40 rounded-xl text-xs space-y-2 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                <p className="text-rose-200 text-[11px] font-medium">
                  Unsubmitting will reset your status to pending until you submit again.
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUnsubmitConfirm(false)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-white/80 bg-white/15 border border-white/25 rounded-lg hover:bg-white/25"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUnsubmit}
                    className="px-2.5 py-1 text-[11px] font-bold text-white bg-rose-600/90 hover:bg-rose-500 rounded-lg border border-rose-300/40 shadow-sm"
                  >
                    Confirm Unsubmit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
