// ── Users ────────────────────────────────────────────────────
export const USERS = [
  { id: 'u1', name: 'Alex Johnson',  email: 'alex@example.com',   password: 'password' },
  { id: 'u2', name: 'Jamie Lee',     email: 'jamie@example.com',  password: 'password' },
  { id: 'u3', name: 'Jordan Smith',  email: 'jordan@example.com', password: 'password' },
  { id: 'u4', name: 'Casey Brown',   email: 'casey@example.com',  password: 'password' },
]

// ── Projects ─────────────────────────────────────────────────
export const PROJECTS_SEED = [
  {
    id: 'p1',
    name: 'CS 4800 Final Project',
    description: 'Comprehensive software engineering final project covering design and implementation.',
    dueDate: '2026-03-15',
    memberIds: ['u1', 'u2', 'u3', 'u4'],
    ownerId: 'u1',
    status: 'Active',
  },
  {
    id: 'p2',
    name: 'ENGL 2010 Group Essay',
    description: 'Collaborative research essay on modern American literature.',
    dueDate: '2026-03-08',
    memberIds: ['u1', 'u2', 'u3'],
    ownerId: 'u2',
    status: 'Active',
  },
  {
    id: 'p3',
    name: 'BIOL 3200 Lab Report',
    description: 'Group lab report analyzing cellular respiration data.',
    dueDate: '2026-03-20',
    memberIds: ['u1', 'u3', 'u4'],
    ownerId: 'u3',
    status: 'Active',
  },
]

// ── Tasks ────────────────────────────────────────────────────
export const TASKS_SEED = [
  // CS 4800
  { id: 't1', projectId: 'p1', name: 'Write Introduction',  assignedTo: 'u1', dueDate: '2026-02-25', effort: 'Medium', status: 'Done',        dateAdded: '2026-01-15', lastModified: '2026-02-25' },
  { id: 't2', projectId: 'p1', name: 'Data Analysis',       assignedTo: 'u2', dueDate: '2026-03-01', effort: 'High',   status: 'Done',        dateAdded: '2026-01-15', lastModified: '2026-03-01' },
  { id: 't3', projectId: 'p1', name: 'Create Slides',       assignedTo: 'u3', dueDate: '2026-03-08', effort: 'High',   status: 'In Progress', dateAdded: '2026-01-20', lastModified: '2026-02-10' },
  { id: 't4', projectId: 'p1', name: 'References',          assignedTo: 'u4', dueDate: '2026-03-10', effort: 'Low',    status: 'To Do',       dateAdded: '2026-01-20', lastModified: '2026-01-20' },
  { id: 't5', projectId: 'p1', name: 'Final Review',        assignedTo: 'u1', dueDate: '2026-03-14', effort: 'Low',    status: 'To Do',       dateAdded: '2026-01-20', lastModified: '2026-01-20' },
  // ENGL 2010
  { id: 't6', projectId: 'p2', name: 'Literature Review',   assignedTo: 'u1', dueDate: '2026-03-05', effort: 'Low',    status: 'To Do',       dateAdded: '2026-01-18', lastModified: '2026-01-18' },
  { id: 't7', projectId: 'p2', name: 'Peer Review',         assignedTo: 'u2', dueDate: '2026-03-05', effort: 'Low',    status: 'To Do',       dateAdded: '2026-01-18', lastModified: '2026-01-18' },
  { id: 't8', projectId: 'p2', name: 'Final Draft',         assignedTo: 'u3', dueDate: '2026-03-07', effort: 'Medium', status: 'To Do',       dateAdded: '2026-01-18', lastModified: '2026-01-18' },
  // BIOL 3200
  { id: 't9',  projectId: 'p3', name: 'Data Collection',   assignedTo: 'u3', dueDate: '2026-03-10', effort: 'High',   status: 'In Progress', dateAdded: '2026-02-01', lastModified: '2026-02-20' },
  { id: 't10', projectId: 'p3', name: 'Analysis Write-up', assignedTo: 'u4', dueDate: '2026-03-15', effort: 'Medium', status: 'To Do',       dateAdded: '2026-02-01', lastModified: '2026-02-01' },
  { id: 't11', projectId: 'p3', name: 'Conclusion',        assignedTo: 'u1', dueDate: '2026-03-18', effort: 'Low',    status: 'To Do',       dateAdded: '2026-02-01', lastModified: '2026-02-01' },
]

// ── Notifications ────────────────────────────────────────────
export const NOTIFS_SEED = [
  { id: 'n1', userId: 'u1', type: 'overdue', title: 'Write Introduction is overdue', detail: 'CS 4800 Final Project  ·  Owner: Alex  ·  Due Feb 25', projectId: 'p1', read: false, createdAt: '2026-02-26' },
  { id: 'n2', userId: 'u1', type: 'assign',  title: 'New task assigned to you',      detail: 'ENGL 2010  ·  Literature Review  ·  Due Mar 5',          projectId: 'p2', read: false, createdAt: '2026-02-20' },
  { id: 'n3', userId: 'u1', type: 'done',    title: 'Task completed: Data Analysis', detail: 'CS 4800 Final Project  ·  Completed by Jamie',            projectId: 'p1', read: true,  createdAt: '2026-03-01' },
  { id: 'n4', userId: 'u1', type: 'invite',  title: 'Added to a new project',        detail: 'BIOL 3200 Lab Report  ·  Added by Jordan',                projectId: 'p3', read: true,  createdAt: '2026-02-01' },
]
