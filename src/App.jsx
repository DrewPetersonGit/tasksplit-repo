import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'

import Landing       from './pages/Landing'
import Login         from './pages/Login'
import Signup        from './pages/Signup'
import Dashboard     from './pages/Dashboard'
import Projects      from './pages/Projects'
import CreateProject from './pages/CreateProject'
import ProjectDetail from './pages/ProjectDetail'
import TaskEdit      from './pages/TaskEdit'
import MyTasks       from './pages/MyTasks'
import Notifications from './pages/Notifications'
import Profile       from './pages/Profile'

function PrivateRoute({ children }) {
  const { currentUser, loading } = useApp()
  if (loading) return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <p className="text-orange-400 font-medium animate-pulse">Loading…</p>
    </div>
  )
  return currentUser ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"       element={<Landing />} />
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Private */}
      <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/projects"    element={<PrivateRoute><Projects /></PrivateRoute>} />
      <Route path="/projects/new" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
      <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
      <Route path="/projects/:projectId/tasks/:taskId" element={<PrivateRoute><TaskEdit /></PrivateRoute>} />
      <Route path="/my-tasks"       element={<PrivateRoute><MyTasks /></PrivateRoute>} />
      <Route path="/notifications"  element={<PrivateRoute><Notifications /></PrivateRoute>} />
      <Route path="/profile"        element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
