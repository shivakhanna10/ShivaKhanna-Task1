import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProgressBar from '../common/ProgressBar';
import {
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

export default function AdminAssignmentCard({ assignment, onInspect, onEdit }) {
  const { getAssignmentSubmissions, deleteAssignment } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { submittedCount, totalStudents, rate } = getAssignmentSubmissions(assignment.id);

  const handleDelete = () => {
    deleteAssignment(assignment.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white/[0.12] hover:bg-white/[0.17] backdrop-blur-2xl border border-white/25 hover:border-white/40 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.4)] transition-all flex flex-col justify-between">
      <div>
        {/* Header: Course Code & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-cyan-200 bg-cyan-500/25 px-2.5 py-0.5 rounded-lg border border-cyan-400/40 backdrop-blur-md shadow-[0_0_10px_rgba(34,211,238,0.25)]">
            {assignment.courseCode}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(assignment)}
              className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition backdrop-blur-sm"
              title="Edit assignment details"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-white/70 hover:text-rose-300 bg-white/10 hover:bg-rose-500/20 border border-white/20 hover:border-rose-400/30 rounded-lg transition backdrop-blur-sm"
              title="Delete assignment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Banner */}
        {showDeleteConfirm && (
          <div className="mb-3.5 p-3.5 bg-rose-500/20 border border-rose-400/40 rounded-xl text-xs space-y-2 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <p className="text-rose-100 font-semibold">
              Are you sure you want to delete this assignment? All associated student submissions will be deleted.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 text-white/80 bg-white/15 border border-white/25 rounded-lg hover:bg-white/25 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-2.5 py-1 text-white bg-rose-600/90 hover:bg-rose-500 rounded-lg font-bold border border-rose-400/40 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Title and Course */}
        <h3 className="text-base font-bold text-white leading-snug mb-1 drop-shadow-xs">
          {assignment.title}
        </h3>
        <p className="text-xs text-white/70 font-medium mb-3">{assignment.courseName}</p>

        {/* Description */}
        <p className="text-xs text-white/80 leading-relaxed line-clamp-2 mb-4">
          {assignment.description}
        </p>

        {/* Assignment Meta Details */}
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
              <span>Weight:</span>
            </span>
            <span className="font-bold text-white">{assignment.points} pts</span>
          </div>
        </div>

        {/* Submission Progress Bar with Neon Glow */}
        <div className="mt-4 pt-1">
          <ProgressBar
            value={submittedCount}
            max={totalStudents}
            label="Student Submissions"
            sublabel={`${submittedCount}/${totalStudents} turned in`}
            height="h-3"
            colorScheme={rate === 100 ? 'emerald' : 'blue'}
          />
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-5 mt-2 space-y-2.5">
        {/* Drive submission folder link */}
        {assignment.driveLink && (
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl transition backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
          >
            <span>Class Drive Submission Folder</span>
            <ExternalLink className="w-3 h-3 text-white/70" />
          </a>
        )}

        <button
          type="button"
          onClick={() => onInspect(assignment)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 border border-white/35 rounded-xl transition shadow-[0_4px_20px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md"
        >
          <Users className="w-4 h-4 text-cyan-200" />
          <span>Inspect Student Submissions</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/70 ml-auto" />
        </button>
      </div>
    </div>
  );
}
