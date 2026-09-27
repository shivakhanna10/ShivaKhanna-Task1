import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import AdminAssignmentCard from './AdminAssignmentCard';
import AssignmentFormModal from './AssignmentFormModal';
import AssignmentDetailModal from './AssignmentDetailModal';
import StudentProgressTable from './StudentProgressTable';
import SearchFilterBar from '../common/SearchFilterBar';
import StatCard from '../common/StatCard';
import ProgressBar from '../common/ProgressBar';
import {
  Plus,
  BookOpen,
  Users,
  CheckCircle2,
  TrendingUp,
  LayoutGrid,
  BarChart3,
  Inbox
} from 'lucide-react';

export default function AdminDashboard() {
  const { assignments, currentUser, getAdminStats } = useApp();

  const [activeTab, setActiveTab] = useState('ASSIGNMENTS'); // 'ASSIGNMENTS' | 'STUDENTS'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [inspectingAssignment, setInspectingAssignment] = useState(null);

  const stats = getAdminStats();

  // Extract unique courses
  const uniqueCourses = useMemo(() => {
    const set = new Set();
    assignments.forEach((asg) => {
      set.add(asg.courseCode);
    });
    return Array.from(set);
  }, [assignments]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((asg) => {
      const matchesSearch =
        searchQuery === '' ||
        asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asg.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asg.courseCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse = selectedCourse === 'ALL' || asg.courseCode === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [assignments, searchQuery, selectedCourse]);

  return (
    <div className="space-y-6">
      {/* Faculty Portal Welcome Banner */}
      <div className="bg-white/[0.12] backdrop-blur-2xl border border-white/25 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.4)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/15">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
                Faculty Course Management
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-lg font-bold bg-indigo-500/25 text-indigo-200 border border-indigo-400/40 backdrop-blur-md shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                Admin Mode
              </span>
            </div>
            <p className="text-sm text-white/70 mt-1">
              Logged in as <span className="font-bold text-white">{currentUser.name}</span> ({currentUser.title})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600/85 hover:bg-blue-500 rounded-xl transition border border-blue-300/50 shadow-[0_0_20px_rgba(37,99,235,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md"
            >
              <Plus className="w-4 h-4 text-cyan-200" />
              <span>Create New Assignment</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar with Neon Glow */}
        <div className="pt-5">
          <ProgressBar
            value={stats.submittedCount}
            max={stats.totalExpected || 1}
            label="Aggregate Class Submission Rate"
            sublabel={`${stats.submittedCount} of ${stats.totalExpected} expected submissions received`}
            height="h-3.5"
            colorScheme={stats.overallRate === 100 ? 'emerald' : 'blue'}
          />
        </div>
      </div>

      {/* Aggregate Real Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Assignments"
          value={stats.totalAssignments}
          subtitle="Across all courses"
          icon={BookOpen}
          accent="blue"
        />
        <StatCard
          title="Enrolled Students"
          value={stats.totalStudents}
          subtitle="Tracked in cohort"
          icon={Users}
          accent="slate"
        />
        <StatCard
          title="Submissions Received"
          value={stats.submittedCount}
          subtitle={`Out of ${stats.totalExpected} expected`}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="Cohort Completion"
          value={`${stats.overallRate}%`}
          subtitle="Overall submission rate"
          icon={TrendingUp}
          accent="amber"
        />
      </div>

      {/* Navigation Tabs between Assignment View and Student Matrix View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('ASSIGNMENTS')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all ${
              activeTab === 'ASSIGNMENTS'
                ? 'bg-white/25 text-white border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.45)] backdrop-blur-md'
                : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Assignments & Submission Status ({assignments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('STUDENTS')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all ${
              activeTab === 'STUDENTS'
                ? 'bg-white/25 text-white border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.45)] backdrop-blur-md'
                : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Individual Student Progress Bars ({stats.totalStudents})</span>
          </button>
        </div>

        <span className="text-xs text-white/70">
          {activeTab === 'ASSIGNMENTS'
            ? 'Manage coursework prompts and external Drive links'
            : 'Track individual student completion rates and progress bars'}
        </span>
      </div>

      {/* TAB 1: ASSIGNMENTS OVERVIEW */}
      {activeTab === 'ASSIGNMENTS' && (
        <div className="space-y-6">
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter="ALL"
            onStatusChange={() => {}}
            statusOptions={[]}
            courses={uniqueCourses}
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
          />

          {filteredAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => (
                <AdminAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onInspect={setInspectingAssignment}
                  onEdit={setEditingAssignment}
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
                No assignments match your search or filter. You can create a new assignment anytime.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600/85 hover:bg-blue-500 rounded-xl transition border border-blue-300/40 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Create Assignment
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INDIVIDUAL STUDENT PROGRESS MATRIX */}
      {activeTab === 'STUDENTS' && (
        <div>
          <StudentProgressTable />
        </div>
      )}

      {/* Create Assignment Modal */}
      <AssignmentFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Assignment Modal */}
      <AssignmentFormModal
        isOpen={!!editingAssignment}
        initialData={editingAssignment}
        onClose={() => setEditingAssignment(null)}
      />

      {/* Assignment Detail Modal (Inspect Student Submissions) */}
      <AssignmentDetailModal
        assignment={inspectingAssignment}
        isOpen={!!inspectingAssignment}
        onClose={() => setInspectingAssignment(null)}
      />
    </div>
  );
}
