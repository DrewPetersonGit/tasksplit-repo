import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Badge from '../components/Badge'
import { useApp } from '../context/AppContext'

function AddTaskModal({ projectId, members, onClose }) {
  const { createTask, getUserName } = useApp()
  const [form, setForm] = useState({
    name: '', assignedTo: members[0] ?? '', dueDate: '',
    effort: 'Medium', status: 'To Do',
  })

  function handleSubmit(e) {
    e.preventDefault()
    createTask(projectId, form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl border border-amber-100 shadow-xl w-full max-w-md p-7 fade-in">
        <h2 className="font-display font-bold text-xl text-gray-900 mb-5">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Task Name *</label>
            <input required type="text" placeholder="What needs to be done?"
              className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Assign To *</label>
            <select required
              className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300"
              value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
              {members.map(uid => (
                <option key={uid} value={uid}>{getUserName(uid)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Deadline *</label>
            <input required type="date"
              className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300"
              value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}/>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Effort Level *</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map(o => (
                <label key={o} className={`flex-1 flex items-center justify-center py-2.5 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-colors
                  ${form.effort === o ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-amber-100 text-gray-500 bg-white hover:border-orange-200'}`}>
                  <input type="radio" name="effortModal" className="hidden"
                    checked={form.effort === o} onChange={() => setForm(f => ({ ...f, effort: o }))}/>
                  {o}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold border-2 border-amber-200 text-gray-500 rounded-full hover:bg-amber-50">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 shadow-sm">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InviteModal({ projectId, onClose }) {
  const { inviteMember } = useApp()
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState(null)

  function handleInvite(e) {
    e.preventDefault()
    const result = inviteMember(projectId, email)
    if (result.ok) setMsg({ ok: true, text: `${result.user.name} added!` })
    else           setMsg({ ok: false, text: result.error })
    setEmail('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl border border-amber-100 shadow-xl w-full max-w-sm p-7 fade-in">
        <h2 className="font-display font-bold text-xl text-gray-900 mb-5">Invite Member</h2>
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Email Address</label>
            <input type="email" required placeholder="teammate@example.com"
              className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300"
              value={email} onChange={e => { setEmail(e.target.value); setMsg(null) }}/>
          </div>
          {msg && (
            <p className={`text-sm ${msg.ok ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold border-2 border-amber-200 text-gray-500 rounded-full hover:bg-amber-50">
              Close
            </button>
            <button type="submit"
              className="flex-1 py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 shadow-sm">
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProject, getProjectTasks, getProjectProgress, getUserName, updateTask } = useApp()

  const [showAddTask, setShowAddTask]   = useState(false)
  const [showInvite,  setShowInvite]    = useState(false)

  const project = getProject(id)
  if (!project) return (
    <Layout>
      <p className="text-gray-500">Project not found.</p>
      <Link to="/projects" className="text-orange-500 font-medium">← Back to Projects</Link>
    </Layout>
  )

  const tasks    = getProjectTasks(id)
  const progress = getProjectProgress(id)

  function toggleDone(task) {
    updateTask(task.id, { status: task.status === 'Done' ? 'To Do' : 'Done' })
  }

  return (
    <Layout>
      {showAddTask && (
        <AddTaskModal projectId={id} members={project.memberIds} onClose={() => setShowAddTask(false)}/>
      )}
      {showInvite && (
        <InviteModal projectId={id} onClose={() => setShowInvite(false)}/>
      )}

      <Link to="/projects" className="text-sm text-orange-500 font-medium hover:text-orange-400 mb-5 inline-block">
        ← Projects
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="font-display font-extrabold text-2xl text-gray-900">{project.name}</h1>
        <button onClick={() => setShowInvite(true)}
          className="shrink-0 px-4 py-2 text-sm font-semibold border-2 border-orange-200 text-orange-600 rounded-full hover:bg-orange-50 transition-colors">
          + Invite Members
        </button>
      </div>
      <p className="text-gray-400 text-sm mb-2">Due {project.dueDate} · {project.memberIds.length} members · {tasks.length} tasks</p>
      {project.description && (
        <p className="text-gray-500 text-sm mb-5">{project.description}</p>
      )}

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 font-medium">Overall progress</span>
          <span className="text-xs text-orange-500 font-bold">{progress}%</span>
        </div>
        <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
          <div className="h-3 bg-orange-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg text-gray-800">Tasks</h2>
        <button onClick={() => setShowAddTask(true)}
          className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 transition-colors shadow-sm">
          + Add Task
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="grid text-xs font-bold text-gray-400 bg-amber-50 border-b border-amber-100 px-5 py-3"
          style={{ gridTemplateColumns: '32px 2fr 1fr 1fr 1fr 1fr 60px' }}>
          {['', 'Task', 'Assigned To', 'Deadline', 'Effort', 'Status', ''].map((h, i) => (
            <span key={i}>{h}</span>
          ))}
        </div>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">No tasks yet. Add the first one!</p>
        ) : tasks.map((t, i) => (
          <div key={t.id}
            className={`grid text-sm px-5 py-3.5 border-b border-amber-50 hover:bg-orange-50/30 items-center transition-colors ${i % 2 === 1 ? 'bg-amber-50/20' : ''}`}
            style={{ gridTemplateColumns: '32px 2fr 1fr 1fr 1fr 1fr 60px' }}>
            <button onClick={() => toggleDone(t)}
              className={`text-base font-bold transition-colors ${t.status === 'Done' ? 'text-green-500' : 'text-amber-300 hover:text-orange-400'}`}>
              {t.status === 'Done' ? '✓' : '○'}
            </button>
            <span className={`font-medium truncate pr-2 ${t.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
              {t.name}
            </span>
            <span className="text-gray-500 text-xs">{getUserName(t.assignedTo)}</span>
            <span className="text-gray-500 text-xs">{t.dueDate}</span>
            <span className="text-gray-500 text-xs">{t.effort}</span>
            <Badge label={t.status}/>
            <Link to={`/projects/${id}/tasks/${t.id}`}
              className="text-xs text-orange-400 hover:text-orange-500 font-semibold">
              Edit
            </Link>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="mt-10">
        <h2 className="font-display font-bold text-lg text-gray-800 mb-4">Members</h2>
        <div className="flex flex-wrap gap-3">
          {project.memberIds.map(uid => (
            <div key={uid} className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-100 rounded-full shadow-sm">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                {getUserName(uid)[0]}
              </span>
              <span className="text-sm font-medium text-gray-700">{getUserName(uid)}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
