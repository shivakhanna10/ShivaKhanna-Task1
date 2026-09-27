import React from 'react';
import { Search, X, Filter } from 'lucide-react';

/**
 * Frosted Glassmorphism Search & Filter bar (matching Image 1 & Image 4).
 * Uses frosted glass styling, specular highlights, and illuminated active tab states.
 */
export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions = [],
  courses = [],
  selectedCourse,
  onCourseChange
}) {
  return (
    <div className="bg-white/[0.12] backdrop-blur-2xl border border-white/25 rounded-2xl p-3 sm:p-4 mb-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.35)] flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Search Input with recessed glass look */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by assignment title, course, or topic..."
          className="w-full pl-9 pr-8 py-2 text-sm bg-black/25 border border-white/20 rounded-xl focus:bg-black/35 focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 text-white placeholder:text-white/50 transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-md"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-0.5"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Course Filter Dropdown */}
        {courses.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-white/70 hidden sm:inline" />
            <select
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm bg-black/30 border border-white/20 rounded-xl text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-cyan-400 cursor-pointer backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Courses</option>
              {courses.map((course) => (
                <option key={course} value={course} className="bg-slate-900 text-white">
                  {course}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter Buttons */}
        {statusOptions.length > 0 && (
          <div className="flex items-center bg-black/25 p-1 rounded-xl border border-white/15 backdrop-blur-md">
            {statusOptions.map((opt) => {
              const active = statusFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onStatusChange(opt.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    active
                      ? 'bg-white/25 text-white shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.45)] border border-white/40'
                      : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {opt.label}
                  {opt.count !== undefined && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.2 rounded-md text-[10px] ${
                        active ? 'bg-white/30 text-white' : 'bg-white/15 text-white/80'
                      }`}
                    >
                      {opt.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
