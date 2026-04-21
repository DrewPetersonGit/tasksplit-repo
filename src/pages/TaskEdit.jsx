import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

export default function TaskEdit() {
  const { projectId, taskId } = useParams()
  const navigate = useNavigate()
  const { getTask, getProject, updateTask, deleteTask, getUserName } = useApp()

  const task    = getTask(taskId)
  const project = getProject(projectId)

  const [form, setForm] = useState(task ? {
    name:       task.name,
    assignedTo: task.assignedTo,
    dueDate:    task.dueDate,
    effort:     task.effort,
    status:     task.status,
  } : {})

  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!task || !project) return (
    <Layout>
      <p className="text-gray-500">Task not found.</p>
      <Link to={`/projects/${projectId}`} className="text-orange-500 font-medium">← Back to Project</Link>
    </Layout>
  )

  function handleSave(e) {
    e.preventDefault()
    updateTask(taskId, form)
    navigate(`/projects/${projectId}`)
  }

  function handleDelete() {
    deleteTask(taskId)
    navigate(`/projects/${projectId}`)
  }

  return (
    <Layout>
      <div className="max-w-xl">
        <Link to={`/projects/${projectId}`}
          className="text-sm text-orange-500 font-medium hover:text-orange-400 mb-5 inline-block">
          ← {project.name}
        </Link>

        <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-8">✏️ Edit Task</h1>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Task Name */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Task Name *</label>
            <input required type="text"
              className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/>
          </div>

          {/* Assigned To */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Assigned To *</label>
            <select required
              className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300"
              value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
              {project.memberIds.map(uid => (
                <option key={uid} value={uid}>{getUserName(uid)}</option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Deadline *</label>
            <input required type="date"
              className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300"
              value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}/>
          </div>

          {/* Read-only fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-400 mb-1.5 block">Date Added</label>
              <input readOnly type="text"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-default"
                value={task.dateAdded}/>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400 mb-1.5 block">Last Modified</label>
              <input readOnly type="text"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-default"
                value={task.lastModified}/>
            </div>
          </div>

          {/* Effort Level */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Effort Level *</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map(o => (
                <label key={o}
                  className={`flex-1 flex items-center justify-center py-2.5 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-colors
                    ${form.effort === o
                      ? 'border-orange-400 bg-orange-50 text-orange-600'
                      : 'border-amber-100 text-gray-500 bg-white hover:border-orange-200'}`}>
                  <input type="radio" name="effort" className="hidden"
                    checked={form.effort === o}
                    onChange={() => setForm(f => ({ ...f, effort: o }))}/>
                  {o}
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Status</label>
            <div className="flex gap-2">
              {['To Do', 'In Progress', 'Done'].map(o => (
                <label key={o}
                  className={`flex-1 flex items-center justify-center py-2.5 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-colors
                    ${form.status === o
                      ? 'border-orange-400 bg-orange-50 text-orange-600'
                      : 'border-amber-100 text-gray-500 bg-white hover:border-orange-200'}`}>
                  <input type="radio" name="status" className="hidden"
                    checked={form.status === o}
                    onChange={() => setForm(f => ({ ...f, status: o }))}/>
                  {o}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {!confirmDelete ? (
              <button type="button" onClick={() => setConfirmDelete(true)}
                className="px-5 py-2.5 text-sm font-semibold border-2 border-red-200 text-red-500 rounded-full hover:bg-red-50 transition-colors">
                Delete Task
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Are you sure?</span>
                <button type="button" onClick={handleDelete}
                  className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-full hover:bg-red-400">
                  Yes, delete
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 text-sm font-semibold border-2 border-gray-200 text-gray-500 rounded-full hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            )}
            {!confirmDelete && (
              <button type="submit"
                className="px-6 py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 transition-colors shadow-sm">
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  )
}
