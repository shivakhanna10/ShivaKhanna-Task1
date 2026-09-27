import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Save } from 'lucide-react';

export default function AssignmentFormModal({ isOpen, onClose, initialData = null }) {
  const { createAssignment, updateAssignment } = useApp();

  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    courseName: '',
    description: '',
    dueDate: '',
    driveLink: '',
    points: 100
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        courseCode: initialData.courseCode || '',
        courseName: initialData.courseName || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate || '',
        driveLink: initialData.driveLink || '',
        points: initialData.points || 100
      });
    } else {
      // Default due date: 7 days from today at 23:59
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      defaultDate.setHours(23, 59, 0, 0);
      const isoLocal = defaultDate.toISOString().slice(0, 16);

      setFormData({
        title: '',
        courseCode: 'CS105',
        courseName: 'Database Systems',
        description: '',
        dueDate: isoLocal,
        driveLink: 'https://drive.google.com/drive/folders/',
        points: 100
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.courseCode.trim()) errs.courseCode = 'Course code is required';
    if (!formData.courseName.trim()) errs.courseName = 'Course name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.dueDate) errs.dueDate = 'Due date is required';
    if (!formData.driveLink.trim()) {
      errs.driveLink = 'Drive link is required for external submission';
    } else if (!formData.driveLink.startsWith('http')) {
      errs.driveLink = 'Must be a valid URL starting with http:// or https://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      updateAssignment(initialData.id, formData);
    } else {
      createAssignment(formData);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-950/85 backdrop-blur-3xl rounded-2xl border border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-white/15 flex items-center justify-between bg-white/[0.04]">
          <div>
            <h2 className="text-lg font-bold text-white leading-tight drop-shadow-xs">
              {isEditing ? 'Edit Assignment' : 'Create New Course Assignment'}
            </h2>
            <p className="text-xs text-white/70 mt-0.5">
              {isEditing
                ? 'Update assignment parameters and instructions'
                : 'Define assignment parameters and link Google Drive for external submissions'}
            </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4.5">
          {/* Assignment Title */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">
              Assignment Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Distributed Consensus Raft Algorithm"
              className="w-full px-3.5 py-2.5 text-sm bg-black/30 border border-white/20 rounded-xl focus:bg-black/40 focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 text-white placeholder:text-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] backdrop-blur-md"
            />
            {errors.title && <p className="text-[11px] text-rose-300 mt-1">{errors.title}</p>}
          </div>

          {/* Course Code & Name Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                Course Code <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                placeholder="e.g. CS204"
                className="w-full px-3.5 py-2.5 text-sm bg-black/30 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 uppercase text-white placeholder:text-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] backdrop-blur-md"
              />
              {errors.courseCode && (
                <p className="text-[11px] text-rose-300 mt-1">{errors.courseCode}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                Course Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                placeholder="e.g. Data Structures & Algorithms"
                className="w-full px-3.5 py-2.5 text-sm bg-black/30 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 text-white placeholder:text-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] backdrop-blur-md"
              />
              {errors.courseName && (
                <p className="text-[11px] text-rose-300 mt-1">{errors.courseName}</p>
              )}
            </div>
          </div>

          {/* Due Date & Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                Due Date & Time <span className="text-rose-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-black/30 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] backdrop-blur-md"
              />
              {errors.dueDate && (
                <p className="text-[11px] text-rose-300 mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                Total Points / Weight
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-black/30 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] backdrop-blur-md"
              />
            </div>
          </div>

          {/* Drive Link for External Submission */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center justify-between">
              <span>
                External Submission Drive Folder Link <span className="text-rose-400">*</span>
              </span>
              <span className="text-[11px] text-white/60 font-normal">Google Drive / OneDrive URL</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.driveLink}
                onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                placeholder="https://drive.google.com/drive/folders/your-folder-id"
                className="w-full px-3.5 py-2.5 text-sm bg-black/30 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 text-white placeholder:text-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] backdrop-blur-md"
              />
            </div>
            {errors.driveLink ? (
              <p className="text-[11px] text-rose-300 mt-1">{errors.driveLink}</p>
            ) : (
              <p className="text-[11px] text-white/60 mt-1">
                Students will access this folder to upload reports, source code, and deliverables.
              </p>
            )}
          </div>

          {/* Description & Instructions */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">
              Instructions & Deliverables <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline specific objectives, evaluation criteria, and formatting guidelines..."
              className="w-full p-3.5 text-sm bg-black/30 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 text-white placeholder:text-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] backdrop-blur-md resize-none"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-300 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-white/15 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition backdrop-blur-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600/85 hover:bg-blue-500 rounded-xl transition border border-blue-300/50 shadow-[0_0_20px_rgba(37,99,235,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]"
            >
              {isEditing ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isEditing ? 'Save Changes' : 'Create Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
