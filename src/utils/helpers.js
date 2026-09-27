/**
 * Utility helper functions for formatting, progress calculation, and status determination.
 */

/**
 * Format ISO date string into readable text (e.g., "Oct 15, 2026, 11:59 PM")
 */
export function formatDateTime(isoString) {
  if (!isoString) return 'Not specified';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Format ISO date string into short date (e.g., "Oct 15, 2026")
 */
export function formatDate(isoString) {
  if (!isoString) return 'No date';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Determine if an assignment is overdue based on current time
 */
export function isOverdue(dueDateString) {
  if (!dueDateString) return false;
  const dueDate = new Date(dueDateString);
  return dueDate.getTime() < Date.now();
}

/**
 * Get human-readable time remaining or days overdue
 */
export function getTimeRemainingText(dueDateString) {
  if (!dueDateString) return '';
  const now = Date.now();
  const due = new Date(dueDateString).getTime();
  const diffMs = due - now;

  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const absDays = Math.abs(diffDays);
    return absDays === 0 ? 'Due earlier today' : `${absDays} ${absDays === 1 ? 'day' : 'days'} ago`;
  }

  if (diffHours < 24) {
    return diffHours <= 1 ? 'Due within an hour' : `Due in ${diffHours} hours`;
  }

  return `Due in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
}

/**
 * Calculate completion percentage and clamp between 0 and 100
 */
export function calculatePercentage(completed, total) {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}
