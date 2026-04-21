import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Badge from '../components/Badge'
import { useApp } from '../context/AppContext'

const STATUS_ORDER = ['Overdue', 'In Progress', 'To Do', 'Done']

export default function MyTasks() {
  const { getMyTasks, getProject, updateTask } = useApp()
  const [filter, setFilter] = useState('All')

  const allTasks = getMyTasks()
  const today    = new Date().toISOString().split('T')[0]

  // Mark overdue tasks dynamically
  const tasks = allTasks.map(t => ({
    ...t,
    displayStatus: t.status !== 'Done' && t.dueDate < today ? 'Overdue' : t.status,
  }))

  const filters = ['All', 'To Do', 'In Progress', 'Done', 'Overdue']
  const shown   = filter === 'All' ? tasks : tasks.filter(t => t.displayStatus === filter)
  const sorted  = [...shown].sort((a, b) =>
    STATUS_ORDER.indexOf(a.displayStatus) - STATUS_ORDER.indexOf(b.displayStatus)
  )

  function toggleDone(t) {
    updateTask(t.id, { status: t.status === 'Done' ? 'To Do' : 'Done' })
  }

  return (
    <Layout>
      <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-6">My Tasks</h1>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full border-2 transition-colors
              ${filter === f
                ? 'border-orange-400 bg-orange-50 text-orange-600'
                : 'border-amber-100 bg-white text-gray-500 hover:border-orange-200'}`}>
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 text-xs opacity-60">
                ({tasks.filter(t => t.displayStatus === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="grid text-xs font-bold text-gray-400 bg-amber-50 border-b border-amber-100 px-5 py-3"
          style={{ gridTemplateColumns: '32px 2fr 1fr 1fr 1fr 1fr' }}>
          {['', 'Task', 'Project', 'Due Date', 'Effort', 'Status'].map(h => (
            <span key={h}>{h}</span>
          ))}
        </div>

        {sorted.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">No tasks to show.</p>
        ) : sorted.map((t, i) => {
          const project = getProject(t.projectId)
          return (
            <div key={t.id}
              className={`grid text-sm px-5 py-3.5 border-b border-amber-50 hover:bg-orange-50/30 items-center transition-colors ${i % 2 === 1 ? 'bg-amber-50/20' : ''}`}
              style={{ gridTemplateColumns: '32px 2fr 1fr 1fr 1fr 1fr' }}>
              <button onClick={() => toggleDone(t)}
                className={`text-base font-bold transition-colors ${t.status === 'Done' ? 'text-green-500' : 'text-amber-300 hover:text-orange-400'}`}>
                {t.status === 'Done' ? '✓' : '○'}
              </button>
              <Link to={`/projects/${t.projectId}/tasks/${t.id}`}
                className={`font-medium truncate pr-2 hover:text-orange-500 transition-colors ${t.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                {t.name}
              </Link>
              <span className="text-gray-500 text-xs truncate">{project?.name ?? t.projectId}</span>
              <span className={`text-xs font-medium ${t.displayStatus === 'Overdue' ? 'text-red-500' : 'text-gray-500'}`}>
                {t.dueDate}
              </span>
              <span className="text-gray-500 text-xs">{t.effort}</span>
              <Badge label={t.displayStatus}/>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
