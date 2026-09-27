import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  Clock,
  Search
} from 'lucide-react';
import { formatDateTime, isOverdue } from '../../utils/helpers';

export default function StudentProgressTable() {
  const { students, assignments, submissions, getStudentStats } = useApp();
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');

  const toggleExpand = (studentId) => {
    setExpandedStudentId((prev) => (prev === studentId ? null : studentId));
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.department.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="bg-white/[0.12] backdrop-blur-2xl border border-white/25 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.4)] overflow-hidden">
      {/* Table Header and Search */}
      <div className="p-4 sm:p-5 border-b border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.04]">
        <div>
          <h3 className="text-sm font-bold text-white drop-shadow-xs">
            Student Performance & Individual Progress
          </h3>
          <p className="text-xs text-white/70">
            Individual completion progress bars and submission breakdown for each enrolled student.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/25 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 text-white placeholder:text-white/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-md"
          />
        </div>
      </div>

      {/* Student Rows */}
      <div className="divide-y divide-white/10">
        {filteredStudents.map((student) => {
          const stats = getStudentStats(student.id);
          const isExpanded = expandedStudentId === student.id;

          return (
            <div key={student.id} className="transition-colors hover:bg-white/[0.06]">
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Student Info */}
                  <div className="lg:col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/90 border border-blue-400/40 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {student.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white drop-shadow-xs">{student.name}</span>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-lg bg-white/15 text-cyan-200 border border-white/25">
                          {student.studentId}
                        </span>
                      </div>
                      <span className="text-xs text-white/70 block">
                        {student.department} • {student.email}
                      </span>
                    </div>
                  </div>

                  {/* Individual Neon Progress Bar */}
                  <div className="lg:col-span-5">
                    <ProgressBar
                      value={stats.submittedCount}
                      max={stats.totalAssignments}
                      label={`Submission Rate`}
                      sublabel={`${stats.submittedCount}/${stats.totalAssignments} assignments`}
                      height="h-3"
                      colorScheme={stats.completionPercentage === 100 ? 'emerald' : 'blue'}
                    />
                  </div>

                  {/* Badges & Expand Button */}
                  <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 font-bold shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                        <CheckCircle2 className="w-3 h-3" />
                        {stats.submittedCount} Done
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                        <Clock className="w-3 h-3" />
                        {stats.pendingCount + stats.overdueCount} Pending
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(student.id)}
                      className="p-2 rounded-xl border border-white/25 hover:bg-white/20 text-white/80 transition backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                      aria-label="Toggle student details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Breakdown for this Student */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-5 pt-2 bg-black/35 border-t border-white/15 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3 pt-2">
                    Coursework Breakdown for {student.name}:
                  </div>

                  <div className="space-y-2.5">
                    {assignments.map((asg) => {
                      const submission = submissions.find(
                        (s) =>
                          s.assignmentId === asg.id &&
                          s.studentId === student.id &&
                          s.status === 'submitted'
                      );
                      const isSub = !!submission;
                      const isOver = isOverdue(asg.dueDate);

                      return (
                        <div
                          key={asg.id}
                          className="bg-white/[0.08] p-3.5 rounded-xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-bold text-cyan-200 bg-cyan-500/25 px-2 py-0.5 rounded-md border border-cyan-400/40">
                              {asg.courseCode}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {asg.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {isSub ? (
                              <div className="flex items-center gap-3 text-xs">
                                <Badge variant="submitted" text="Submitted" />
                                <span className="text-[11px] font-mono text-cyan-200 font-semibold hidden sm:inline">
                                  {formatDateTime(submission.submittedAt)}
                                </span>
                                {submission.driveSubmissionLink && (
                                  <a
                                    href={submission.driveSubmissionLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200 font-bold"
                                  >
                                    <span>View File</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-xs">
                                <Badge
                                  variant={isOver ? 'overdue' : 'pending'}
                                  text={isOver ? 'Overdue' : 'Not Submitted'}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-xs text-white/60">
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
