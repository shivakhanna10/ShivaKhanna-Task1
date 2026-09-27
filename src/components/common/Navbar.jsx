import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, ChevronDown, Check, RotateCcw } from 'lucide-react';
import Badge from './Badge';

export default function Navbar() {
  const { users, currentUser, setCurrentUserId, resetToDemoData } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectUser = (id) => {
    setCurrentUserId(id);
    setDropdownOpen(false);
  };

  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-white/[0.10] backdrop-blur-2xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/80 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight drop-shadow-xs">CourseDesk</span>
              </div>
              <p className="text-xs text-white/70 hidden sm:block">Assignment & Submission Portal</p>
            </div>
          </div>

          {/* Right Action Controls: Role Switcher & Reset Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Reset Demo Data button */}
            <button
              type="button"
              onClick={resetToDemoData}
              title="Reset data back to seed state"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl transition backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white/80" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

            {/* Active User Dropdown Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/30 bg-white/15 hover:bg-white/25 transition text-left backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                    isAdmin ? 'bg-indigo-600/90 border border-indigo-300/40 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-blue-600/90 border border-blue-300/40 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                  }`}
                >
                  {currentUser.avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white leading-tight drop-shadow-xs">
                      {currentUser.name}
                    </span>
                    <Badge
                      variant={isAdmin ? 'admin' : 'student'}
                      text={isAdmin ? 'Admin' : 'Student'}
                      size="sm"
                      icon={false}
                    />
                  </div>
                  <span className="text-[11px] text-white/70 block leading-tight">
                    {isAdmin ? currentUser.title : currentUser.studentId}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-white/70" />
              </button>

              {/* User Selection Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-950/80 backdrop-blur-3xl rounded-2xl border border-white/25 shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2.5 border-b border-white/10">
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Switch Role & User Profile
                    </p>
                    <p className="text-xs text-white/70 mt-0.5">
                      Test role isolation by switching accounts:
                    </p>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-1">
                    {users.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      const userIsAdmin = user.role === 'admin';

                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleSelectUser(user.id)}
                          className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-white/15 transition ${
                            isSelected ? 'bg-white/20 text-white font-semibold' : 'text-white/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                                userIsAdmin ? 'bg-indigo-600 border border-indigo-300/40' : 'bg-blue-600 border border-blue-300/40'
                              }`}
                            >
                              {user.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-xs ${
                                    isSelected ? 'text-white font-bold' : 'text-white/90'
                                  }`}
                                >
                                  {user.name}
                                </span>
                              </div>
                              <span className="text-[11px] text-white/60 block">
                                {userIsAdmin ? 'Professor (Admin)' : `${user.studentId} (${user.department})`}
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-cyan-300" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.03] text-[11px] text-white/60 rounded-b-2xl">
                    Data is isolated per account. Students see only their own assignments.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
