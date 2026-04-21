import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const FEATURES = [
  { icon: '🎯', title: 'Task Ownership',     desc: 'Every task has one clear owner. No more "I thought you were doing it."' },
  { icon: '⏰', title: 'Deadline Tracking',  desc: 'See all due dates at a glance. Get notified before anything falls through.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Automatic alerts for overdue tasks, completions, and project invites.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 h-16 bg-white border-b-2 border-amber-100">
        <span className="font-display font-extrabold text-orange-500 text-xl tracking-tight">✦ TaskSplit</span>
        <div className="flex gap-3">
          <Link to="/login"  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-orange-600 rounded-full transition-colors">Log In</Link>
          <Link to="/signup" className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 transition-colors shadow-sm">Sign Up Free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 fade-in">
        <span className="text-5xl mb-6">✦</span>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-gray-900 leading-tight max-w-2xl mb-4">
          Clarity and accountability<br/>for group work.
        </h1>
        <p className="text-gray-500 text-lg max-w-md mb-10">
          TaskSplit helps student teams own tasks, track deadlines, and hold each other accountable — without the chaos.
        </p>
        <div className="flex gap-4">
          <Link to="/signup" className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-400 transition-colors shadow-md text-base">
            Sign Up — It's Free
          </Link>
          <Link to="/login"  className="px-8 py-3 border-2 border-orange-200 text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition-colors text-base">
            Log In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6 fade-in">
        {FEATURES.map(f => (
          <div key={f.title} className="bg-white rounded-2xl border border-amber-100 shadow-sm p-7 text-center hover:shadow-md transition-shadow">
            <span className="text-4xl">{f.icon}</span>
            <h3 className="font-display font-bold text-gray-900 text-base mt-4 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  )
}
