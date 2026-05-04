import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
 
const AppContext = createContext(null)
 
export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [profile,     setProfile]     = useState(null)
  const [projects,    setProjects]    = useState([])
  const [tasks,       setTasks]       = useState([])
  const [notifs,      setNotifs]      = useState([])
  const [loading,     setLoading]     = useState(true)
 
  // ── Bootstrap auth session ────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setCurrentUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])
 
  useEffect(() => {
    if (!currentUser) { setProfile(null); setLoading(false); return }
    supabase.from('profiles').select('*').eq('id', currentUser.id).single()
      .then(({ data }) => { setProfile(data); setLoading(false) })
  }, [currentUser])
 
  // ── Auth ───────────────────────────────────────────────────
  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }
 
  async function signup(name, email, password) {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }
 
  async function logout() {
    await supabase.auth.signOut()
    setProjects([]); setTasks([]); setNotifs([])
  }
 
  async function updateProfile(fields) {
    const { error } = await supabase.from('profiles').update(fields).eq('id', currentUser.id)
    if (!error) setProfile(p => ({ ...p, ...fields }))
    return { ok: !error, error: error?.message }
  }
 
  // ── Projects ───────────────────────────────────────────────
  const loadProjects = useCallback(async () => {
    if (!currentUser) return
    const { data: memberRows } = await supabase
      .from('project_members').select('project_id').eq('user_id', currentUser.id)
    const ids = memberRows?.map(r => r.project_id) ?? []
 
    const orClause = ids.length
      ? `owner_id.eq.${currentUser.id},id.in.(${ids.join(',')})`
      : `owner_id.eq.${currentUser.id}`
 
    const { data } = await supabase
      .from('projects')
      .select('*, project_members(user_id)')
      .or(orClause)
      .order('created_at', { ascending: false })
    setProjects(data ?? [])
  }, [currentUser])
 
  useEffect(() => { loadProjects() }, [loadProjects])
 
  function getMyProjects() { return projects }
  function getProject(id)  { return projects.find(p => p.id === id) ?? null }
 
  async function createProject({ name, description, dueDate, invitedEmails = [] }) {
    const { data: project, error } = await supabase
      .from('projects')
      .insert({ name, description, due_date: dueDate, owner_id: currentUser.id })
      .select().single()
    if (error) return { ok: false, error: error.message }
 
    await supabase.from('project_members')
      .insert({ project_id: project.id, user_id: currentUser.id })
 
    for (const email of invitedEmails) {
      await inviteMember(project.id, email)
    }
    await loadProjects()
    return { ok: true, project }
  }
 
  async function inviteMember(projectId, email) {
    const { data: user } = await supabase
      .from('profiles').select('id, name').eq('email', email).single()
    if (!user) return { ok: false, error: 'No user found with that email.' }
 
    const { error } = await supabase
      .from('project_members').insert({ project_id: projectId, user_id: user.id })
    if (error) return { ok: false, error: error.message }
 
    await supabase.from('notifications').insert({
      user_id: user.id, type: 'invite',
      title: 'Added to a new project',
      detail: `Added by ${profile?.name ?? 'a teammate'}`,
      project_id: projectId,
    })
    await loadProjects()
    return { ok: true, user }
  }
 
  function getMemberIds(project) {
    return project?.project_members?.map(m => m.user_id) ?? []
  }
 
  // ── Tasks ──────────────────────────────────────────────────
  const loadTasks = useCallback(async () => {
    if (!currentUser) return
    const { data: memberRows } = await supabase
      .from('project_members').select('project_id').eq('user_id', currentUser.id)
    const ids = memberRows?.map(r => r.project_id) ?? []
    if (!ids.length) { setTasks([]); return }
 
    const { data } = await supabase
      .from('tasks').select('*').in('project_id', ids)
      .order('created_at', { ascending: true })
    setTasks(data ?? [])
  }, [currentUser])
 
  useEffect(() => { loadTasks() }, [loadTasks])
 
  function getProjectTasks(projectId) { return tasks.filter(t => t.project_id === projectId) }
  function getMyTasks()               { return tasks.filter(t => t.assigned_to === currentUser?.id) }
  function getTask(id)                { return tasks.find(t => t.id === id) ?? null }
 
  async function createTask(projectId, { name, assignedTo, dueDate, effort, status }) {
    const { data, error } = await supabase.from('tasks')
      .insert({ project_id: projectId, name, assigned_to: assignedTo, due_date: dueDate, effort, status: status ?? 'To Do' })
      .select().single()
    if (error) return { ok: false, error: error.message }
 
    if (assignedTo && assignedTo !== currentUser.id) {
      await supabase.from('notifications').insert({
        user_id: assignedTo, type: 'assign',
        title: 'New task assigned to you',
        detail: `${name} · Due ${dueDate}`,
        project_id: projectId,
      })
    }
    await loadTasks()
    return { ok: true, task: data }
  }
 
  async function updateTask(taskId, fields) {
    const db = {}
    if (fields.name        != null) db.name         = fields.name
    if (fields.assignedTo  != null) db.assigned_to  = fields.assignedTo
    if (fields.assigned_to != null) db.assigned_to  = fields.assigned_to
    if (fields.dueDate     != null) db.due_date      = fields.dueDate
    if (fields.due_date    != null) db.due_date      = fields.due_date
    if (fields.effort      != null) db.effort        = fields.effort
    if (fields.status      != null) db.status        = fields.status
 
    const { error } = await supabase.from('tasks').update(db).eq('id', taskId)
    if (!error) await loadTasks()
    return { ok: !error, error: error?.message }
  }
 
  async function deleteTask(taskId) {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (!error) setTasks(prev => prev.filter(t => t.id !== taskId))
    return { ok: !error }
  }
 
  // ── Notifications ──────────────────────────────────────────
  const loadNotifs = useCallback(async () => {
    if (!currentUser) return
    const { data } = await supabase.from('notifications')
      .select('*').eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
    setNotifs(data ?? [])
  }, [currentUser])
 
  useEffect(() => { loadNotifs() }, [loadNotifs])
 
  function getMyNotifs() { return notifs }
 
  async function markRead(id) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }
 
  async function markAllRead() {
    await supabase.from('notifications').update({ read: true }).eq('user_id', currentUser.id)
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }
 
  function getProjectProgress(projectId) {
    const pt = tasks.filter(t => t.project_id === projectId)
    if (!pt.length) return 0
    return Math.round(pt.filter(t => t.status === 'Done').length / pt.length * 100)
  }
 
  const unreadCount = notifs.filter(n => !n.read).length
 
  return (
    <AppContext.Provider value={{
      currentUser, profile, loading,
      login, signup, logout, updateProfile,
      projects, getMyProjects, getProject, createProject, inviteMember, getMemberIds,
      tasks, getProjectTasks, getMyTasks, getTask, createTask, updateTask, deleteTask,
      notifs, getMyNotifs, markRead, markAllRead, unreadCount,
      getProjectProgress,
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