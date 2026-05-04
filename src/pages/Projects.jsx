import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Badge from '../components/Badge'
import { useApp } from '../context/AppContext'

export default function Projects() {
  const { getMyProjects, getProjectProgress, getProjectTasks } = useApp()
  const [search, setSearch] = useState('')

  // ✅ ALWAYS default to []
  const allProjects = getMyProjects() ?? []

  const projects = allProjects.filter(p =>
    (p.name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-extrabold text-2xl text-gray-900">My Projects</h1>
        <Link to="/projects/new"
          className="px-5 py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 transition-colors shadow-sm">
          + New Project
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-amber-100 rounded-full text-sm focus:outline-none focus:border-orange-300 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div
          className="grid text-xs font-bold text-gray-400 bg-amber-50 border-b border-amber-100 px-5 py-3"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px' }}
        >
          {['Project Name', 'Due Date', 'Members', 'Tasks', 'Status', ''].map(h => (
            <span key={h}>{h}</span>
          ))}
        </div>

        {projects.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">
            {search ? 'No projects match your search.' : 'No projects yet.'}
          </p>
        ) : projects.map((p, i) => {
          // ✅ SAFE calls
          const taskCount = getProjectTasks(p.id)?.length ?? 0
          const progress  = getProjectProgress(p.id)

          return (
            <div
              key={p.id}
              className={`grid text-sm px-5 py-4 border-b border-amber-50 hover:bg-orange-50/30 items-center transition-colors ${i % 2 === 1 ? 'bg-amber-50/20' : ''}`}
              style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px' }}
            >
              <span className="font-medium text-gray-900 truncate pr-2">
                {p.name ?? 'Untitled'}
              </span>

              <span className="text-gray-500 text-xs">
                {p.dueDate ?? '—'}
              </span>

              {/* ✅ THIS WAS YOUR CRASH */}
              <span className="text-gray-500 text-xs">
                {p.memberIds?.length ?? 0}
              </span>

              <span className="text-gray-500 text-xs">
                {taskCount}
              </span>

              <Badge label={p.status ?? 'active'} />

              <Link
                to={`/projects/${p.id}`}
                className="text-xs text-orange-500 font-semibold hover:text-orange-400 underline underline-offset-2"
              >
                Details
              </Link>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}