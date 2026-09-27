/**
 * Seed data for Student-Assignment Management System
 * Includes initial users (1 Professor/Admin, 4 Students)
 * and initial assignments with student submission records.
 */

export const INITIAL_USERS = [
  {
    id: 'prof-1',
    name: 'Prof. Shiva Khanna',
    role: 'admin',
    title: 'Department Chair & Professor',
    department: 'Computer Science & Engineering',
    email: 'e.vance@university.edu',
    avatar: 'EV'
  },
  {
    id: 'stu-1',
    name: 'Anurag ',
    role: 'student',
    studentId: 'STU-2024-001',
    department: 'Computer Science',
    email: 'alex.rivera@student.edu',
    avatar: 'AR'
  },
  {
    id: 'stu-2',
    name: 'Shivam Jhawar',
    role: 'student',
    studentId: 'STU-2024-002',
    department: 'Software Engineering',
    email: 'marcus.chen@student.edu',
    avatar: 'MC'
  },
  {
    id: 'stu-3',
    name: 'Shreyansh',
    role: 'student',
    studentId: 'STU-2024-003',
    department: 'Data Science',
    email: 'sophia.patel@student.edu',
    avatar: 'SP'
  },
  {
    id: 'stu-4',
    name: 'Siya',
    role: 'student',
    studentId: 'STU-2024-004',
    department: 'Computer Science',
    email: 'liam.johnson@student.edu',
    avatar: 'LJ'
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-1',
    title: 'Relational Database Schema Design',
    courseCode: 'CS105',
    courseName: 'Database Systems',
    description: 'Design a normalized 3NF database schema for a multi-tenant healthcare appointment platform. Provide SQL DDL scripts and ER diagrams.',
    dueDate: '2026-10-15T23:59',
    driveLink: 'https://drive.google.com/drive/folders/db-systems-assignment-1',
    points: 100,
    createdBy: 'prof-1',
    createdAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'asg-2',
    title: 'Sorting Algorithms Benchmark & Analysis',
    courseCode: 'CS204',
    courseName: 'Data Structures & Algorithms',
    description: 'Implement QuickSort, MergeSort, and TimSort. Benchmark their execution time on random, sorted, and reverse-sorted arrays of up to 1,000,000 integers.',
    dueDate: '2026-10-10T23:59',
    driveLink: 'https://drive.google.com/drive/folders/dsa-benchmark-reports',
    points: 100,
    createdBy: 'prof-1',
    createdAt: '2026-09-18T14:30:00Z'
  },
  {
    id: 'asg-3',
    title: 'Accessible Web Components Lab',
    courseCode: 'WEB301',
    courseName: 'Modern Web Engineering',
    description: 'Construct a reusable modal, accordion, and tabset complying with WCAG 2.1 AA accessibility standards and keyboard navigation.',
    dueDate: '2026-10-02T23:59',
    driveLink: 'https://drive.google.com/drive/folders/web301-accessible-lab',
    points: 50,
    createdBy: 'prof-1',
    createdAt: '2026-09-20T09:15:00Z'
  },
  {
    id: 'asg-4',
    title: 'Microservices Architecture Architectural RFC',
    courseCode: 'SE401',
    courseName: 'Software Engineering Architecture',
    description: 'Author a 5-page RFC evaluating event-driven vs gRPC-based communication patterns for an e-commerce checkout pipeline.',
    dueDate: '2026-10-25T23:59',
    driveLink: 'https://drive.google.com/drive/folders/se401-microservices-rfc',
    points: 100,
    createdBy: 'prof-1',
    createdAt: '2026-09-22T11:00:00Z'
  },
  {
    id: 'asg-5',
    title: 'Packet Tracer Routing Protocol Simulation',
    courseCode: 'NET202',
    courseName: 'Computer Networks',
    description: 'Configure OSPF and BGP routing across a three-subnet autonomous system topology. Submit your completed .pkt file and connectivity logs.',
    dueDate: '2026-10-05T23:59',
    driveLink: 'https://drive.google.com/drive/folders/net202-packet-tracer',
    points: 75,
    createdBy: 'prof-1',
    createdAt: '2026-09-24T16:45:00Z'
  }
];

export const INITIAL_SUBMISSIONS = [
  // Anurag  (stu-1) has submitted 4 out of 5
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    studentId: 'stu-1',
    status: 'submitted',
    submittedAt: '2026-09-22T15:30:00Z',
    driveSubmissionLink: 'https://drive.google.com/file/d/alex-rivera-db-schema/view',
    notes: 'Normalized to 3NF. Added PostgreSQL indexes for appointment queries.'
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-2',
    studentId: 'stu-1',
    status: 'submitted',
    submittedAt: '2026-09-24T18:20:00Z',
    driveSubmissionLink: 'https://drive.google.com/file/d/alex-rivera-dsa-benchmark/view',
    notes: 'Benchmarking plots included in appendix.'
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-3',
    studentId: 'stu-1',
    status: 'submitted',
    submittedAt: '2026-09-25T11:10:00Z',
    driveSubmissionLink: 'https://drive.google.com/file/d/alex-rivera-web-components/view',
    notes: 'Tested with NVDA screen reader.'
  },
  {
    id: 'sub-4',
    assignmentId: 'asg-5',
    studentId: 'stu-1',
    status: 'submitted',
    submittedAt: '2026-09-26T14:45:00Z',
    driveSubmissionLink: 'https://drive.google.com/file/d/alex-rivera-networks-lab/view',
    notes: 'OSPF multi-area topology verified.'
  },

  // Shivam Jhawar (stu-2) has submitted 2 out of 5
  {
    id: 'sub-5',
    assignmentId: 'asg-1',
    studentId: 'stu-2',
    status: 'submitted',
    submittedAt: '2026-09-23T12:00:00Z',
    driveSubmissionLink: 'https://drive.google.com/file/d/marcus-chen-db/view',
    notes: 'ER diagram generated using dbdiagram.io.'
  },
  {
    id: 'sub-6',
    assignmentId: 'asg-3',
    studentId: 'stu-2',
    status: 'submitted',
    submittedAt: '2026-09-26T09:30:00Z',
    driveSubmissionLink: 'https://drive.google.com/file/d/marcus-chen-a11y/view',
    notes: 'Includes focus trap and ARIA live regions.'
  },

  // Shreyansh (stu-3) has submitted 3 out of 5
  {
    id: 'sub-7',
    assignmentId: 'asg-1',
    studentId: 'stu-3',
    status: 'submitted',
    submittedAt: '2026-09-21T17:15:00Z',
    driveSubmissionLink: 'https://drive.google.com/file/d/sophia-patel-db/view',
    notes: 'Includes schema migration scripts.'
  },
  {
    id: 'sub-8',
    assignmentId: 'asg-2',
    studentId: 'stu-3',
    status: 'submitted',
    submittedAt: '2026-09-25T16:40:00Z',
    driveSubmissionLink: 'https://drive.google.com/file/d/sophia-patel-dsa/view',
    notes: 'Execution times logged over 10 runs each.'
  },
  {
    id: 'sub-9',
    assignmentId: 'asg-4',
    studentId: 'stu-3',
    status: 'submitted',
    submittedAt: '2026-09-26T20:10:00Z',
    driveSubmissionLink: 'https://drive.google.com/file/d/sophia-patel-rfc/view',
    notes: 'Draft RFC with latency benchmark comparisons.'
  },

  // Siya (stu-4) has submitted 1 out of 5
  {
    id: 'sub-10',
    assignmentId: 'asg-3',
    studentId: 'stu-4',
    status: 'submitted',
    submittedAt: '2026-09-26T22:05:00Z',
    driveSubmissionLink: 'https://drive.google.com/file/d/liam-johnson-web/view',
    notes: 'WCAG AAA color contrast tested.'
  }
];
