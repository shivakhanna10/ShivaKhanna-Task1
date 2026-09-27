import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Link as LinkIcon
} from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

/**
 * Double-verification modal for student assignment submission with authentic frosted glassmorphism.
 * Step 1: "Yes, I have submitted" confirmation with upload verification & Drive link.
 * Step 2: Final confirmation before committing changes to system.
 */
export default function DoubleVerificationModal({ assignment, isOpen, onClose }) {
  const { currentUser, submitAssignment } = useApp();

  // Verification step: 1 = Initial Confirmation, 2 = Final Verification
  const [step, setStep] = useState(1);
  const [confirmedUpload, setConfirmedUpload] = useState(false);
  const [driveSubmissionLink, setDriveSubmissionLink] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !assignment) return null;

  const handleProceedToStep2 = (e) => {
    e.preventDefault();
    if (!confirmedUpload) {
      setErrorMsg('Please confirm that you have uploaded your files to continue.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleFinalSubmit = () => {
    submitAssignment(assignment.id, currentUser.id, {
      driveSubmissionLink,
      notes
    });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setConfirmedUpload(false);
    setDriveSubmissionLink('');
    setNotes('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-slate-950/85 backdrop-blur-3xl rounded-2xl border border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] w-full max-w-lg overflow-hidden text-white animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-white/15 flex items-center justify-between bg-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-600/90 border border-blue-400/40 text-white flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(37,99,235,0.4)]">
              {step}
            </span>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-white leading-tight drop-shadow-xs">
                {step === 1 ? 'Verify Assignment Submission' : 'Final Submission Confirmation'}
              </h2>
              <p className="text-xs text-white/70">Step {step} of 2 in double-verification flow</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-white/60 hover:text-white p-1 rounded-lg transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleProceedToStep2} className="space-y-4.5">
              {/* Assignment Brief */}
              <div className="p-4 bg-white/[0.08] rounded-xl border border-white/20 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
                  <span className="font-bold text-cyan-200">{assignment.courseCode}</span>
                  <span>Due: {formatDateTime(assignment.dueDate)}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{assignment.title}</h3>
              </div>

              {/* External Submission Link Instructions */}
              {assignment.driveLink && (
                <div className="p-3.5 bg-blue-500/20 border border-blue-400/35 rounded-xl text-xs backdrop-blur-md shadow-[0_0_15px_rgba(37,99,235,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-cyan-200 block mb-0.5">
                        Professor's Submission Folder:
                      </span>
                      <p className="text-white/80">
                        Upload your completed files to the official Drive repository before confirming.
                      </p>
                    </div>
                    <a
                      href={assignment.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 border border-white/35 text-white rounded-lg font-bold hover:bg-white/30 transition whitespace-nowrap shadow-xs"
                    >
                      <span>Open Drive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Student Upload URL Field */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Your Submission Drive / File URL <span className="text-white/50 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={driveSubmissionLink}
                    onChange={(e) => setDriveSubmissionLink(e.target.value)}
                    placeholder="https://drive.google.com/file/d/your-work"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-black/30 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 text-white placeholder:text-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] backdrop-blur-md"
                  />
                </div>
                <p className="text-[11px] text-white/60 mt-1">
                  Paste the direct link to your document or uploaded files for your professor to inspect.
                </p>
              </div>

              {/* Student Remarks */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">
                  Submission Notes / Remarks <span className="text-white/50 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Completed all requirements. Handled edge cases in section 3."
                  className="w-full p-3 text-sm bg-black/30 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300 text-white placeholder:text-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] backdrop-blur-md resize-none"
                />
              </div>

              {/* Double verification checkbox 1 */}
              <div className="pt-1">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-white/20 bg-white/[0.08] cursor-pointer hover:bg-white/[0.13] transition backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                  <input
                    type="checkbox"
                    checked={confirmedUpload}
                    onChange={(e) => {
                      setConfirmedUpload(e.target.checked);
                      if (e.target.checked) setErrorMsg('');
                    }}
                    className="mt-0.5 w-4 h-4 text-cyan-400 rounded border-white/30 bg-black/30 focus:ring-cyan-400 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white block">
                      Yes, I have submitted my work
                    </span>
                    <span className="text-white/70">
                      I confirm that my completed assignment has been uploaded to the specified Drive folder and meets submission criteria.
                    </span>
                  </div>
                </label>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-1.5 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Step 1 Actions */}
              <div className="pt-3 border-t border-white/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!confirmedUpload}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600/85 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition border border-blue-300/50 shadow-[0_0_20px_rgba(37,99,235,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]"
                >
                  <span>Proceed to Final Confirmation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4.5">
              <div className="p-4 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-100 text-xs backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)]">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm text-white">Please Review Before Finalizing</span>
                    <p className="mt-1 text-white/80">
                      Once confirmed, your submission timestamp will be recorded permanently in the professor's dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Summary */}
              <div className="border border-white/20 rounded-xl divide-y divide-white/15 text-xs bg-black/25 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <div className="p-3.5 flex justify-between">
                  <span className="text-white/60">Assignment:</span>
                  <span className="font-bold text-white text-right">{assignment.title}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-white/60">Course:</span>
                  <span className="font-bold text-white">{assignment.courseCode} - {assignment.courseName}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-white/60">Student:</span>
                  <span className="font-bold text-white">{currentUser.name} ({currentUser.studentId})</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-white/60">Status Update:</span>
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Marking as Submitted
                  </span>
                </div>
                {driveSubmissionLink && (
                  <div className="p-3.5 flex justify-between">
                    <span className="text-white/60">Submitted Link:</span>
                    <span className="font-mono text-cyan-300 font-semibold truncate max-w-[200px]" title={driveSubmissionLink}>
                      {driveSubmissionLink}
                    </span>
                  </div>
                )}
                {notes && (
                  <div className="p-3.5">
                    <span className="text-white/60 block mb-1">Notes:</span>
                    <p className="text-white bg-white/[0.08] p-2.5 rounded-lg border border-white/15">{notes}</p>
                  </div>
                )}
              </div>

              {/* Step 2 Actions */}
              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Edit</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600/85 hover:bg-emerald-500 rounded-xl transition border border-emerald-300/50 shadow-[0_0_20px_rgba(52,211,153,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Confirm & Finalize Submission</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
