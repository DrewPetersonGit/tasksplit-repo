import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Badge from '../components/Badge'
import { useApp } from '../context/AppContext'

export default function Dashboard() {
  const { profile, getMyTasks, getMyProjects, getProjectProgress } = useApp()
  const myTasks    = getMyTasks()
  const myProjects = getMyProjects()
  const firstName  = profile?.name?.split(' ')[0] ?? '…'

  return (
    <Layout>
      <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-8">
        👋 Welcome back, {firstName}
      </h1>

      {/* My Tasks */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-gray-800">My Tasks</h2>
          <Link to="/my-tasks" className="text-sm text-orange-500 font-medium hover:text-orange-400">View all →</Link>
        </div>
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-5 text-xs font-bold text-gray-400 bg-amber-50 border-b border-amber-100 px-5 py-3">
            {['Task', 'Project', 'Due Date', 'Effort', 'Status'].map(h => <span key={h}>{h}</span>)}
          </div>
          {myTasks.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No tasks assigned to you yet.</p>
          ) : myTasks.slice(0, 5).map((t, i) => (
            <div key={t.id} className={`grid grid-cols-5 text-sm px-5 py-3.5 border-b border-amber-50 hover:bg-orange-50/30 items-center ${i % 2 === 1 ? 'bg-amber-50/30' : ''}`}>
              <span className="text-gray-800 font-medium truncate pr-2">{t.name}</span>
              <span className="text-gray-500 text-xs truncate">{t.project_id}</span>
              <span className="text-gray-500 text-xs">{t.due_date}</span>
              <span className="text-gray-500 text-xs">{t.effort}</span>
              <Badge label={t.status}/>
            </div>
          ))}
        </div>
      </section>

      {/* My Projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-gray-800">My Projects</h2>
          <Link to="/projects/new"
            className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 transition-colors shadow-sm">
            + New Project
          </Link>
        </div>
        {myProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-10 text-center">
            <p className="text-gray-400 text-sm mb-4">You haven't joined any projects yet.</p>
            <Link to="/projects/new" className="text-orange-500 font-semibold text-sm">
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {myProjects.map(p => {
              const progress = getProjectProgress(p.id)
              const members  = p.project_members?.length ?? 0
              return (
                <Link key={p.id} to={`/projects/${p.id}`}
                  className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 hover:shadow-md transition-shadow block">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-display font-bold text-gray-900 text-base leading-tight">{p.name}</p>
                    <Badge label={p.status}/>
                  </div>
                  <p className="text-gray-400 text-xs mb-5">Due {p.due_date} · {members} members</p>
                  <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden mb-2">
                    <div className="h-2.5 bg-orange-400 rounded-full transition-all" style={{ width: `${progress}%` }}/>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{progress}% complete</p>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </Layout>
  )
}
