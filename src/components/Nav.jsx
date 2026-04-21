import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const NAV = [
  { label: 'Dashboard',     to: '/dashboard' },
  { label: 'Projects',      to: '/projects' },
  { label: 'My Tasks',      to: '/my-tasks' },
  { label: 'Notifications', to: '/notifications' },
  { label: 'Profile',       to: '/profile' },
]

export default function Nav() {
  const { logout, unreadCount } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() { logout(); navigate('/') }

  return (
    <nav className="flex items-center gap-1 px-6 h-16 bg-white border-b-2 border-amber-100 sticky top-0 z-40">
      <Link to="/dashboard" className="font-display font-extrabold text-orange-500 text-xl mr-6 tracking-tight">
        ✦ TaskSplit
      </Link>
      <div className="flex items-center gap-1 flex-1">
        {NAV.map(({ label, to }) => {
          const active = location.pathname === to ||
            (to === '/projects' && location.pathname.startsWith('/projects'))
          return (
            <Link key={to} to={to}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                active
                  ? 'text-orange-600 bg-orange-50 font-semibold'
                  : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50/50'
              }`}>
              {label}
              {label === 'Notifications' && unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>
      <button onClick={handleLogout}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
        Logout
      </button>
    </nav>
  )
}
