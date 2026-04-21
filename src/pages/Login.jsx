import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Footer from '../components/Footer'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = login(form.email, form.password)
    if (result.ok) navigate('/dashboard')
    else setError(result.error)
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <header className="flex items-center justify-between px-8 h-16 bg-white border-b-2 border-amber-100">
        <Link to="/" className="font-display font-extrabold text-orange-500 text-xl tracking-tight">✦ TaskSplit</Link>
        <div className="flex gap-3">
          <Link to="/signup" className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 transition-colors">Sign Up</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 fade-in">
        <div className="w-full max-w-md bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
          <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-1">Welcome back 👋</h1>
          <p className="text-sm text-gray-400 mb-7">Log in to your TaskSplit account.</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Email</label>
              <input type="email" required placeholder="you@example.com"
                className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}/>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Password</label>
              <input type="password" required placeholder="••••••••"
                className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
                value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}/>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded"/>
                Remember me
              </label>
              <span className="text-sm text-orange-500 cursor-pointer hover:text-orange-400 font-medium">Reset password</span>
            </div>
            <button type="submit"
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-400 transition-colors shadow-sm mt-2">
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-500 font-semibold hover:text-orange-400">Sign up free</Link>
          </p>

          {/* Demo hint */}
          <p className="text-center text-xs text-gray-300 mt-4">
            Demo: alex@example.com / password
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
