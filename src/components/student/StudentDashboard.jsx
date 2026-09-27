import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import StudentProgressBanner from './StudentProgressBanner';
import AssignmentCard from './AssignmentCard';
import DoubleVerificationModal from './DoubleVerificationModal';
import SearchFilterBar from '../common/SearchFilterBar';
import { isOverdue } from '../../utils/helpers';
import { Inbox } from 'lucide-react';

export default function StudentDashboard() {
  const { assignments, currentUser, getStudentSubmission } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, SUBMITTED, PENDING, OVERDUE

  // Modal state
  const [activeAssignmentForSubmission, setActiveAssignmentForSubmission] = useState(null);

  // Extract unique courses
  const uniqueCourses = useMemo(() => {
    const set = new Set();
    assignments.forEach((asg) => {
      set.add(asg.courseCode);
    });
    return Array.from(set);
  }, [assignments]);

  // Compute status counts for the filter tabs
  const statusCounts = useMemo(() => {
    let submitted = 0;
    let pending = 0;
    let overdue = 0;

    assignments.forEach((asg) => {
      const isSub = !!getStudentSubmission(asg.id, currentUser.id);
      if (isSub) {
        submitted += 1;
      } else {
        if (isOverdue(asg.dueDate)) {
          overdue += 1;
        } else {
          pending += 1;
        }
      }
    });

    return {
      all: assignments.length,
      submitted,
      pending,
      overdue
    };
  }, [assignments, currentUser.id, getStudentSubmission]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((asg) => {
      // Search query filter
      const matchesSearch =
        searchQuery === '' ||
        asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asg.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asg.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asg.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Course filter
      const matchesCourse = selectedCourse === 'ALL' || asg.courseCode === selectedCourse;

      // Status filter
      const isSub = !!getStudentSubmission(asg.id, currentUser.id);
      const isOver = isOverdue(asg.dueDate);

      let matchesStatus = true;
      if (statusFilter === 'SUBMITTED') {
        matchesStatus = isSub;
      } else if (statusFilter === 'PENDING') {
        matchesStatus = !isSub && !isOver;
      } else if (statusFilter === 'OVERDUE') {
        matchesStatus = !isSub && isOver;
      }

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [assignments, searchQuery, selectedCourse, statusFilter, currentUser.id, getStudentSubmission]);

  const statusOptions = [
    { id: 'ALL', label: 'All', count: statusCounts.all },
    { id: 'PENDING', label: 'Pending', count: statusCounts.pending },
    { id: 'SUBMITTED', label: 'Submitted', count: statusCounts.submitted },
    { id: 'OVERDUE', label: 'Overdue', count: statusCounts.overdue }
  ];

  return (
    <div className="space-y-6">
      {/* Student Personal Progress Banner */}
      <StudentProgressBanner />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight drop-shadow-xs">Your Coursework</h2>
          <p className="text-xs text-white/70">
            View requirements, access Google Drive folders, and confirm your submissions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={statusOptions}
        courses={uniqueCourses}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
      />

      {/* Assignment Grid */}
      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onOpenSubmitModal={setActiveAssignmentForSubmission}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white/[0.12] backdrop-blur-2xl border border-white/25 rounded-2xl p-12 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.4)]">
          <div className="w-12 h-12 bg-white/15 border border-white/25 rounded-xl flex items-center justify-center mx-auto mb-3 text-white/80 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No assignments found</h3>
          <p className="text-xs text-white/70 max-w-sm mx-auto mb-4">
            No assignments match your current search query or filter selection.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCourse('ALL');
              setStatusFilter('ALL');
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl transition backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Double Verification Modal for Submissions */}
      <DoubleVerificationModal
        assignment={activeAssignmentForSubmission}
        isOpen={!!activeAssignmentForSubmission}
        onClose={() => setActiveAssignmentForSubmission(null)}
      />
    </div>
  );
}
