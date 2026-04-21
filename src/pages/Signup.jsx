import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Footer from '../components/Footer'

export default function Signup() {
  const { signup } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    const result = signup(form.name, form.email, form.password)
    if (result.ok) navigate('/dashboard')
    else setError(result.error)
  }

  const fields = [
    { key: 'name',     label: 'Full Name',        type: 'text',     placeholder: 'Your Name' },
    { key: 'email',    label: 'Email',             type: 'email',    placeholder: 'you@example.com' },
    { key: 'password', label: 'Password',          type: 'password', placeholder: 'Min. 6 characters' },
    { key: 'confirm',  label: 'Confirm Password',  type: 'password', placeholder: 'Repeat password' },
  ]

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <header className="flex items-center justify-between px-8 h-16 bg-white border-b-2 border-amber-100">
        <Link to="/" className="font-display font-extrabold text-orange-500 text-xl tracking-tight">✦ TaskSplit</Link>
        <Link to="/login" className="px-4 py-2 text-sm font-semibold border-2 border-orange-200 text-orange-600 rounded-full hover:bg-orange-50 transition-colors">Log In</Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 fade-in">
        <div className="w-full max-w-md bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
          <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-1">Create your account ✨</h1>
          <p className="text-sm text-gray-400 mb-7">Free forever. No credit card needed.</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{label}</label>
                <input type={type} required placeholder={placeholder}
                  className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
                  value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}/>
              </div>
            ))}
            <button type="submit"
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-400 transition-colors shadow-sm mt-2">
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-400">Log in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
