# CourseDesk - Student-Assignment Management System

CourseDesk is a clean, responsive dashboard for managing student coursework with clear role-based data isolation. Built with React.js and Tailwind CSS, it enables students to review assignments and confirm submissions through a two-step verification flow, while providing faculty administrators with real-time tracking, assignment creation with external Google Drive links, and individual progress bar visualizations for every student.

---

## Architecture Overview

CourseDesk is designed with a modular, component-based React architecture and an isolated mock data layer backed by browser `localStorage`.

### Key Architectural Pillars

1. **Role-Based Data Isolation**:
   - **Student View**: Each student user (e.g., Anurag , Shivam Jhawar, Shreyansh, Siya) accesses strictly their own coursework, submission records, and individual completion progress bar.
   - **Faculty / Admin View**: Professors (e.g., Prof. Shiva Khanna) manage assignments, attach external submission repositories, review student submission statuses, and inspect individual progress bars for every enrolled student.
2. **Context-Driven State Management (`AppContext`)**:
   - Centralizes state for current active user, assignments list, and submission records.
   - Automatically synchronizes all mutations to `localStorage` for data persistence across page reloads.
   - Provides a one-click "Reset Demo" action to restore the seed dataset at any time.
3. **Double-Verification Flow**:
   - Prevents accidental submissions through a 2-step modal:
     - **Step 1**: Student confirms file upload to the designated Google Drive folder and provides an optional file URL and notes.
     - **Step 2**: Student reviews submission details and gives final confirmation to commit the timestamped status.
4. **Real Quantitative Metrics (No Fake Data)**:
   - All progress bars, ratios, and summary metrics are dynamically computed from active assignment counts and student submission records.

---

## Folder Structure

```
d:/ShivaKhanna-Task1/
├── index.html                           # Application entry point with Inter font & SEO meta
├── package.json                         # Dependencies (React 19, Tailwind CSS v4, Lucide React)
├── vite.config.js                       # Vite bundler configuration
└── src/
    ├── main.jsx                         # React root bootstrap
    ├── App.jsx                          # Main layout router and provider wrapper
    ├── index.css                        # Tailwind CSS imports and global styling
    ├── context/
    │   └── AppContext.jsx               # React Context for state, persistence, and role operations
    ├── data/
    │   └── mockData.js                  # Initial seed data for users, assignments, and submissions
    ├── utils/
    │   └── helpers.js                   # Date formatting, overdue logic, and progress calculators
    └── components/
        ├── common/
        │   ├── Navbar.jsx               # Header with user switcher dropdown and demo reset
        │   ├── ProgressBar.jsx          # Reusable progress bar with percentage and color tiers
        │   ├── StatCard.jsx             # Quantitative metric card for dashboard statistics
        │   ├── Badge.jsx                # Status badges (Submitted, Pending, Overdue, Role)
        │   ├── SearchFilterBar.jsx      # Course filter and status filter controls
        │   └── Toast.jsx                # User feedback notifications
        ├── student/
        │   ├── StudentDashboard.jsx     # Main workspace for student role
        │   ├── StudentProgressBanner.jsx# Student completion progress bar and metric cards
        │   ├── AssignmentCard.jsx       # Coursework card with Drive link and submission status
        │   └── DoubleVerificationModal.jsx # Two-step submission confirmation modal
        └── admin/
            ├── AdminDashboard.jsx       # Main workspace for faculty/admin role
            ├── AdminAssignmentCard.jsx  # Assignment overview card with class submission rate
            ├── AssignmentFormModal.jsx  # Create and edit assignment modal with Drive link
            ├── AssignmentDetailModal.jsx# Inspection modal for per-student submissions
            └── StudentProgressTable.jsx # Cohort table with individual student progress bars
```

---

## Component Structure and Design Decisions

### 1. Light Theme & SaaS Aesthetic

- Clean, high-contrast light theme using Tailwind's `slate` palette (`bg-slate-50`, `text-slate-900`, `border-slate-200`).
- No purple gradients: Styled with clean neutral borders, soft slate card backgrounds, and targeted blue/indigo accents.
- Modern rectangular buttons with `rounded-md` corners (strictly avoiding pill-shaped buttons).
- Crisp iconography using `lucide-react` SVGs (strictly avoiding emoji icons).

### 2. Role-Based Navigation & Switching

- The top navigation bar (`Navbar.jsx`) includes a role switcher dropdown.
- Reviewers can instantly switch between:
  - **Prof. Shiva Khanna** (Faculty / Admin)
  - **Anurag** (Student, CS)
  - **Shivam Jhawar** (Student, SE)
  - **Shreyansh** (Student, DS)
  - **Siya** (Student, CS)
- Switching accounts demonstrates instant data isolation in action.

### 3. Student Workflow

- **Progress Tracking (`StudentProgressBanner.jsx`)**: Calculates personal progress (e.g., 4 of 5 completed - 80%) with a visual progress bar and 4 real metrics: Total Assigned, Submitted, Pending, Overdue.
- **Assignment Cards (`AssignmentCard.jsx`)**: Displays course code, due date, points, description toggle, professor's Google Drive link, and current submission status.
- **Double-Verification Submission (`DoubleVerificationModal.jsx`)**:
  - *Step 1*: Prompts the student to access the professor's Google Drive folder, check the upload confirmation box, and optionally attach their submission link or comments.
  - *Step 2*: Displays a summary review with a confirmation notice before recording the official submission timestamp.
- **Unsubmit Option**: Students can unsubmit to make changes, which returns the status to pending.

### 4. Faculty / Admin Workflow

- **Assignment Management (`AssignmentFormModal.jsx`)**: Faculty can create or update assignments with title, course code, course name, description, due date, points, and external Google Drive submission folder link.
- **Assignment Overview (`AdminAssignmentCard.jsx`)**: Each assignment card features a class submission progress bar showing how many students have submitted.
- **Student Submission Inspection (`AssignmentDetailModal.jsx`)**: Faculty can view submission status, timestamp, student's Drive link, and remarks for any assignment.
- **Individual Student Progress Bars (`StudentProgressTable.jsx`)**: Displays each enrolled student with their own individual progress bar, submission ratio, and an expandable breakdown of their status on every assignment.

---

## Project Setup Instructions

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation Steps

1. **Clone or open the project directory**:

   ```bash
   cd ShivaKhanna-Task1
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the local development server**:

   ```bash
   npm run dev
   ```

   The application will be accessible at: `http://localhost:5173/`

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Preview production build**:

   ```bash
   npm run preview
   ```