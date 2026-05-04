import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Badge from '../components/Badge'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'

function AddTaskModal({ projectId, memberIds = [], onClose }) {
  const { createTask, currentUser } = useApp()
  const [form, setForm] = useState({
    name: '', assignedTo: currentUser?.id ?? '', dueDate: '', effort: 'Medium',
  })
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!(memberIds?.length)) return
    supabase.from('profiles').select('id, name').in('id', memberIds)
      .then(({ data }) => setProfiles(data ?? []))
  }, [(memberIds ?? []).join(',')])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await createTask(projectId, {
      name: form.name,
      assignedTo: form.assignedTo,
      dueDate: form.dueDate,
      effort: form.effort,
      status: 'To Do',
    })
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl border border-amber-100 shadow-xl w-full max-w-md p-7 fade-in">
        <h2 className="font-display font-bold text-xl text-gray-900 mb-5">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Task name"
            className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

          <select required
            className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm"
            value={form.assignedTo}
            onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <input required type="date"
            className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm"
            value={form.dueDate}
            onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-orange-500 text-white rounded-full">
            {loading ? 'Adding…' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  )
}

function InviteModal({ projectId, onClose }) {
  const { inviteMember } = useApp()
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleInvite(e) {
    e.preventDefault()
    setLoading(true)
    const result = await inviteMember(projectId, email)
    setLoading(false)
    if (result.ok) setMsg({ ok: true, text: `${result.user.name} added!` })
    else setMsg({ ok: false, text: result.error })
    setEmail('')
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white p-6 rounded-xl">
        <form onSubmit={handleInvite}>
          <input value={email} onChange={e => setEmail(e.target.value)} />
          <button type="submit">Invite</button>
        </form>
        {msg && <p>{msg.text}</p>}
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const { getProject, getProjectTasks, getProjectProgress, getMemberIds, updateTask } = useApp()

  const [showAddTask, setShowAddTask] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [memberProfiles, setMemberProfiles] = useState({})

  const project = getProject(id)
  const tasks = getProjectTasks(id) ?? []
  const progress = getProjectProgress(id) ?? 0
  const memberIds = project ? (getMemberIds(project) ?? []) : []

  useEffect(() => {
    if (!(memberIds?.length)) return
    supabase.from('profiles').select('id, name').in('id', memberIds)
      .then(({ data }) => {
        const map = {}
        data?.forEach(p => { map[p.id] = p.name })
        setMemberProfiles(map)
      })
  }, [(memberIds ?? []).join(',')])

  async function handleToggleDone(t) {
    await updateTask(t.id, { status: t.status === 'Done' ? 'To Do' : 'Done' })
  }

  if (!project) {
    return (
      <Layout>
        <p className="text-gray-400">Loading project...</p>
      </Layout>
    )
  }

  return (
    <Layout>
      {showAddTask && <AddTaskModal projectId={id} memberIds={memberIds} onClose={() => setShowAddTask(false)} />}
      {showInvite && <InviteModal projectId={id} onClose={() => setShowInvite(false)} />}

      <h1>{project.name ?? 'Untitled Project'}</h1>

      <p>
        Due {project.due_date ?? '—'} · {memberIds?.length ?? 0} members · {tasks?.length ?? 0} tasks
      </p>

      <button onClick={() => setShowAddTask(true)}>Add Task</button>

      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        tasks.map(t => (
          <div key={t.id}>
            <span>{t.name}</span>
            <span>{memberProfiles[t.assigned_to] ?? '—'}</span>
            <button onClick={() => handleToggleDone(t)}>
              {t.status === 'Done' ? '✓' : '○'}
            </button>
          </div>
        ))
      )}

      <h2>Members</h2>
      {(memberIds ?? []).map(uid => (
        <div key={uid}>
          {memberProfiles[uid] ?? uid}
        </div>
      ))}
    </Layout>
  )
}