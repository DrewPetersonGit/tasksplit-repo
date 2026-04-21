import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

const ICON = { overdue: '⚠️', assign: '📋', done: '✅', invite: '🎉' }
const BG   = {
  overdue: 'border-red-100 hover:border-red-200',
  assign:  'border-amber-100 hover:border-orange-200',
  done:    'border-green-100 hover:border-green-200',
  invite:  'border-blue-100 hover:border-blue-200',
}

export default function Notifications() {
  const { getMyNotifs, markRead, markAllRead } = useApp()
  const notifs  = getMyNotifs()
  const unread  = notifs.filter(n => !n.read).length

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-gray-900">🔔 Notifications</h1>
          {unread > 0 && (
            <p className="text-sm text-gray-400 mt-1">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="text-sm text-orange-500 font-semibold hover:text-orange-400 transition-colors">
            Mark all as read
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-12 text-center">
          <span className="text-5xl">🎉</span>
          <p className="text-gray-400 text-sm mt-4">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map(n => (
            <div key={n.id}
              className={`flex items-start gap-4 px-6 py-4 rounded-2xl border-2 bg-white transition-colors cursor-pointer ${BG[n.type]} ${!n.read ? 'opacity-100' : 'opacity-70'}`}
              onClick={() => markRead(n.id)}>
              {/* Unread dot */}
              <div className="relative mt-1">
                <span className="text-xl">{ICON[n.type] ?? '📌'}</span>
                {!n.read && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"/>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${n.read ? 'text-gray-600' : 'text-gray-900'}`}>
                  {n.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{n.detail}</p>
                <p className="text-xs text-gray-300 mt-1">{n.createdAt}</p>
              </div>

              <Link to={`/projects/${n.projectId}`}
                className="shrink-0 text-sm text-orange-500 font-semibold hover:text-orange-400 transition-colors whitespace-nowrap mt-0.5"
                onClick={e => e.stopPropagation()}>
                View →
              </Link>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
