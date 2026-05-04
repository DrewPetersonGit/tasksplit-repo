import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

export default function CreateProject() {
  const { createProject } = useApp()
  const navigate = useNavigate()
  const [form,        setForm]       = useState({ name: '', description: '', dueDate: '' })
  const [inviteEmail, setInviteEmail] = useState('')
  const [emails,      setEmails]     = useState([])
  const [inviteErr,   setInviteErr]  = useState('')
  const [formErr,     setFormErr]    = useState('')
  const [loading,     setLoading]    = useState(false)

  function addEmail() {
    setInviteErr('')
    if (!inviteEmail.trim()) return
    if (emails.includes(inviteEmail)) { setInviteErr('Already added.'); return }
    setEmails(prev => [...prev, inviteEmail])
    setInviteEmail('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormErr('')
    if (!form.name.trim()) { setFormErr('Project name is required.'); return }
    if (!form.dueDate)     { setFormErr('Due date is required.'); return }
    setLoading(true)
    const result = await createProject({
      name:          form.name.trim(),
      description:   form.description.trim(),
      dueDate:       form.dueDate,
      invitedEmails: emails,
    })
    setLoading(false)
    if (result.ok) navigate(`/projects/${result.project.id}`)
    else setFormErr(result.error)
  }

  return (
    <Layout>
      <div className="max-w-xl">
        <Link to="/projects" className="text-sm text-orange-500 font-medium hover:text-orange-400 mb-5 inline-block">
          ← Back to Projects
        </Link>
        <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-8">Create New Project</h1>

        {formErr && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{formErr}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Project Name *</label>
            <input type="text" required placeholder="e.g. CS 4800 Final Project"
              className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Description</label>
            <textarea rows={3} placeholder="What is this project about?"
              className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors resize-none"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Overall Due Date *</label>
            <input type="date" required
              className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
              value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}/>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Invite Members</label>
            <div className="flex gap-2">
              <input type="email" placeholder="teammate@example.com"
                className="flex-1 bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
                value={inviteEmail}
                onChange={e => { setInviteEmail(e.target.value); setInviteErr('') }}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEmail())}/>
              <button type="button" onClick={addEmail}
                className="px-5 py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 transition-colors">
                + Add
              </button>
            </div>
            {inviteErr && <p className="text-xs text-red-500 mt-1">{inviteErr}</p>}
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {emails.map(em => (
                  <span key={em} className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium rounded-full">
                    {em}
                    <button type="button" onClick={() => setEmails(prev => prev.filter(e => e !== em))}
                      className="text-orange-400 hover:text-orange-600 font-bold leading-none">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Link to="/projects"
              className="px-5 py-2.5 text-sm font-semibold border-2 border-amber-200 text-gray-500 rounded-full hover:bg-amber-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 transition-colors shadow-sm disabled:opacity-60">
              {loading ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
