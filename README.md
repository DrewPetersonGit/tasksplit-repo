# ✦ TaskSplit

> Clarity and accountability for group work.

TaskSplit is a student project management tool that helps teams assign tasks, track deadlines, and stay accountable. Built with React + Vite + Tailwind CSS.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run
```bash
npm install
npm run dev
```
Opens at `http://localhost:5173/tasksplit/`

### Demo Login
```
Email:    alex@example.com
Password: password
```

---

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx     # Global state: auth, projects, tasks, notifications
├── data/
│   └── mockData.js        # Seed data (users, projects, tasks, notifications)
├── components/
│   ├── Layout.jsx         # Page wrapper with Nav + Footer
│   ├── Nav.jsx            # Sticky top navigation
│   ├── Footer.jsx
│   └── Badge.jsx          # Status/label pill
└── pages/
    ├── Landing.jsx
    ├── Login.jsx
    ├── Signup.jsx
    ├── Dashboard.jsx
    ├── Projects.jsx
    ├── CreateProject.jsx
    ├── ProjectDetail.jsx  # With Add Task + Invite Member modals
    ├── TaskEdit.jsx
    ├── MyTasks.jsx        # Personal task list with filter pills
    ├── Notifications.jsx
    └── Profile.jsx
```

---

## Deploy to GitHub Pages

```bash
# One-time setup: update vite.config.js base to match your repo name
# Then:
npm run deploy
```

Live at: `https://<your-username>.github.io/tasksplit/`

---

## Tech Stack
- **React 18** + **React Router 6**
- **Vite 5**
- **Tailwind CSS 3**
- **DM Sans** + **Nunito** (Google Fonts)
- State: React Context (no external state library)
- Data: in-memory mock data (no backend required)
