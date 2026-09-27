import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS, INITIAL_ASSIGNMENTS, INITIAL_SUBMISSIONS } from '../data/mockData';
import { calculatePercentage, isOverdue } from '../utils/helpers';

const AppContext = createContext();

const STORAGE_KEYS = {
  ASSIGNMENTS: 'assignment_sys_assignments_v1',
  SUBMISSIONS: 'assignment_sys_submissions_v1',
  ACTIVE_USER_ID: 'assignment_sys_active_user_v1'
};

export function AppProvider({ children }) {
  // Available users in the system (1 Professor, 4 Students)
  const users = INITIAL_USERS;

  // Active user state - default to first student so user can immediately test student view,
  // but easily toggled to Professor anytime
  const [currentUserId, setCurrentUserId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
    return saved && users.some((u) => u.id === saved) ? saved : 'stu-1';
  });

  // Assignments state with localStorage persistence
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  // Submissions state with localStorage persistence
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Sync active user to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, currentUserId);
  }, [currentUserId]);

  // Sync assignments to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  // Sync submissions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  // Toast timer auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const students = users.filter((u) => u.role === 'student');

  /**
   * CREATE ASSIGNMENT (Admin / Professor)
   */
  const createAssignment = (data) => {
    const newAssignment = {
      id: `asg-${Date.now()}`,
      title: data.title.trim(),
      courseCode: data.courseCode.trim().toUpperCase(),
      courseName: data.courseName.trim(),
      description: data.description.trim(),
      dueDate: data.dueDate,
      driveLink: data.driveLink.trim(),
      points: Number(data.points) || 100,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString()
    };

    setAssignments((prev) => [newAssignment, ...prev]);
    showToast(`Assignment "${newAssignment.title}" created successfully!`, 'success');
    return newAssignment;
  };

  /**
   * UPDATE ASSIGNMENT (Admin / Professor)
   */
  const updateAssignment = (id, data) => {
    setAssignments((prev) =>
      prev.map((asg) =>
        asg.id === id
          ? {
              ...asg,
              title: data.title.trim(),
              courseCode: data.courseCode.trim().toUpperCase(),
              courseName: data.courseName.trim(),
              description: data.description.trim(),
              dueDate: data.dueDate,
              driveLink: data.driveLink.trim(),
              points: Number(data.points) || asg.points
            }
          : asg
      )
    );
    showToast('Assignment updated successfully.', 'success');
  };

  /**
   * DELETE ASSIGNMENT (Admin / Professor)
   */
  const deleteAssignment = (id) => {
    const target = assignments.find((a) => a.id === id);
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    // Remove all submissions linked to this assignment
    setSubmissions((prev) => prev.filter((s) => s.assignmentId !== id));
    showToast(`Assignment "${target?.title || 'item'}" removed.`, 'info');
  };

  /**
   * SUBMIT ASSIGNMENT (Student double-verification result)
   */
  const submitAssignment = (assignmentId, studentId, details = {}) => {
    const existingIndex = submissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === studentId
    );

    const submissionEntry = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : `sub-${Date.now()}`,
      assignmentId,
      studentId,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      driveSubmissionLink: details.driveSubmissionLink?.trim() || '',
      notes: details.notes?.trim() || ''
    };

    if (existingIndex >= 0) {
      setSubmissions((prev) => {
        const copy = [...prev];
        copy[existingIndex] = submissionEntry;
        return copy;
      });
    } else {
      setSubmissions((prev) => [...prev, submissionEntry]);
    }

    const asg = assignments.find((a) => a.id === assignmentId);
    showToast(`Submitted "${asg?.title || 'Assignment'}" successfully!`, 'success');
  };

  /**
   * UNSUBMIT ASSIGNMENT (Student can retract or edit submission)
   */
  const unsubmitAssignment = (assignmentId, studentId) => {
    setSubmissions((prev) =>
      prev.filter((s) => !(s.assignmentId === assignmentId && s.studentId === studentId))
    );
    showToast('Submission reverted to unsubmitted status.', 'info');
  };

  /**
   * GET A SPECIFIC STUDENT'S SUBMISSION RECORD
   */
  const getStudentSubmission = (assignmentId, studentId) => {
    return submissions.find(
      (s) => s.assignmentId === assignmentId && s.studentId === studentId && s.status === 'submitted'
    );
  };

  /**
   * GET STUDENT METRICS (Only their own data)
   */
  const getStudentStats = (studentId) => {
    const totalAssignments = assignments.length;
    let submittedCount = 0;
    let overdueCount = 0;
    let pendingCount = 0;

    assignments.forEach((asg) => {
      const isSub = submissions.some(
        (s) => s.assignmentId === asg.id && s.studentId === studentId && s.status === 'submitted'
      );
      if (isSub) {
        submittedCount += 1;
      } else {
        if (isOverdue(asg.dueDate)) {
          overdueCount += 1;
        } else {
          pendingCount += 1;
        }
      }
    });

    const completionPercentage = calculatePercentage(submittedCount, totalAssignments);

    return {
      totalAssignments,
      submittedCount,
      pendingCount,
      overdueCount,
      completionPercentage
    };
  };

  /**
   * GET PROFESSOR / ADMIN AGGREGATE METRICS
   */
  const getAdminStats = () => {
    const totalAssignments = assignments.length;
    const totalStudents = students.length;
    const totalExpected = totalAssignments * totalStudents;

    // Filter valid submissions for active assignments
    const validSubmissions = submissions.filter((sub) =>
      assignments.some((a) => a.id === sub.assignmentId)
    );
    const submittedCount = validSubmissions.length;
    const overallRate = calculatePercentage(submittedCount, totalExpected);

    return {
      totalAssignments,
      totalStudents,
      totalExpected,
      submittedCount,
      overallRate
    };
  };

  /**
   * GET SUBMISSION STATUS BREAKDOWN FOR A SPECIFIC ASSIGNMENT
   */
  const getAssignmentSubmissions = (assignmentId) => {
    const studentStatusList = students.map((student) => {
      const submission = submissions.find(
        (s) => s.assignmentId === assignmentId && s.studentId === student.id && s.status === 'submitted'
      );
      return {
        student,
        isSubmitted: !!submission,
        submissionDetails: submission || null
      };
    });

    const submittedCount = studentStatusList.filter((s) => s.isSubmitted).length;
    const total = students.length;
    const rate = calculatePercentage(submittedCount, total);

    return {
      studentStatusList,
      submittedCount,
      totalStudents: total,
      rate
    };
  };

  /**
   * GET INDIVIDUAL PROGRESS BARS DATA FOR ALL STUDENTS
   * Used in Admin dashboard to inspect each student's progress
   */
  const getStudentProgressList = () => {
    return students.map((student) => {
      const stats = getStudentStats(student.id);
      return {
        student,
        stats
      };
    });
  };

  /**
   * RESET TO INITIAL DEMO DATA
   */
  const resetToDemoData = () => {
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setCurrentUserId('stu-1');
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    showToast('Reset to initial seed data.', 'info');
  };

  const value = {
    users,
    students,
    currentUser,
    currentUserId,
    setCurrentUserId,
    assignments,
    submissions,
    toast,
    showToast,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    unsubmitAssignment,
    getStudentSubmission,
    getStudentStats,
    getAdminStats,
    getAssignmentSubmissions,
    getStudentProgressList,
    resetToDemoData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
