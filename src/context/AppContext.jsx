import { createContext, useContext, useState } from 'react'
import { USERS, PROJECTS_SEED, TASKS_SEED, NOTIFS_SEED } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [projects,    setProjects]    = useState(PROJECTS_SEED)
  const [tasks,       setTasks]       = useState(TASKS_SEED)
  const [notifs,      setNotifs]      = useState(NOTIFS_SEED)

  // ── Auth ───────────────────────────────────────────────────
  function login(email, password) {
    const user = USERS.find(u => u.email === email && u.password === password)
    if (user) { setCurrentUser(user); return { ok: true } }
    return { ok: false, error: 'Invalid email or password.' }
  }

  function signup(name, email, password) {
    if (USERS.find(u => u.email === email))
      return { ok: false, error: 'An account with that email already exists.' }
    const user = { id: `u${Date.now()}`, name, email, password }
    USERS.push(user)
    setCurrentUser(user)
    return { ok: true }
  }

  function logout() { setCurrentUser(null) }

  function updateProfile(fields) {
    setCurrentUser(u => ({ ...u, ...fields }))
  }

  // ── Projects ───────────────────────────────────────────────
  function getMyProjects() {
    if (!currentUser) return []
    return projects.filter(p => p.memberIds.includes(currentUser.id))
  }

  function getProject(id) {
    return projects.find(p => p.id === id) || null
  }

  function createProject(data) {
    const newProject = {
      id: `p${Date.now()}`,
      ownerId: currentUser.id,
      memberIds: [currentUser.id, ...data.invitedIds],
      status: 'Active',
      ...data,
    }
    setProjects(prev => [...prev, newProject])
    return newProject
  }

  function inviteMember(projectId, email) {
    const user = USERS.find(u => u.email === email)
    if (!user) return { ok: false, error: 'No user found with that email.' }
    setProjects(prev => prev.map(p =>
      p.id === projectId && !p.memberIds.includes(user.id)
        ? { ...p, memberIds: [...p.memberIds, user.id] }
        : p
    ))
    return { ok: true, user }
  }

  // ── Tasks ──────────────────────────────────────────────────
  function getProjectTasks(projectId) {
    return tasks.filter(t => t.projectId === projectId)
  }

  function getMyTasks() {
    if (!currentUser) return []
    return tasks.filter(t => t.assignedTo === currentUser.id)
  }

  function getTask(taskId) {
    return tasks.find(t => t.id === taskId) || null
  }

  function createTask(projectId, data) {
    const now = new Date().toISOString().split('T')[0]
    const task = {
      id: `t${Date.now()}`,
      projectId,
      dateAdded: now,
      lastModified: now,
      ...data,
    }
    setTasks(prev => [...prev, task])
    return task
  }

  function updateTask(taskId, fields) {
    const now = new Date().toISOString().split('T')[0]
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, ...fields, lastModified: now } : t
    ))
  }

  function deleteTask(taskId) {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  // ── Notifications ──────────────────────────────────────────
  function getMyNotifs() {
    if (!currentUser) return []
    return notifs.filter(n => n.userId === currentUser.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  function markRead(notifId) {
    setNotifs(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n))
  }

  function markAllRead() {
    if (!currentUser) return
    setNotifs(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n))
  }

  // ── Helpers ────────────────────────────────────────────────
  function getUserName(userId) {
    const u = USERS.find(u => u.id === userId)
    return u ? u.name : 'Unknown'
  }

  function getProjectProgress(projectId) {
    const pt = tasks.filter(t => t.projectId === projectId)
    if (!pt.length) return 0
    return Math.round(pt.filter(t => t.status === 'Done').length / pt.length * 100)
  }

  const unreadCount = notifs.filter(n => n.userId === currentUser?.id && !n.read).length

  return (
    <AppContext.Provider value={{
      currentUser, login, signup, logout, updateProfile,
      projects, getMyProjects, getProject, createProject, inviteMember,
      tasks, getProjectTasks, getMyTasks, getTask, createTask, updateTask, deleteTask,
      notifs, getMyNotifs, markRead, markAllRead, unreadCount,
      getUserName, getProjectProgress,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
