import { useState } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { profile, updateProfile } = useApp()
  const [form, setForm] = useState({
    name:            profile?.name  ?? '',
    email:           profile?.email ?? '',
    password:        '',
    confirmPassword: '',
  })
  const [notifPrefs, setNotifPrefs] = useState({ emailNotifs: true, inAppNotifs: true })
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const initials = (profile?.name ?? '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  async function handleSave(e) {
    e.preventDefault()
    setError(''); setSaved(false)
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match.'); return
    }
    if (form.password && form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return
    }
    setLoading(true)

    const profileResult = await updateProfile({ name: form.name })
    if (!profileResult.ok) { setError(profileResult.error); setLoading(false); return }

    if (form.password) {
      const { error: pwError } = await supabase.auth.updateUser({ password: form.password })
      if (pwError) { setError(pwError.message); setLoading(false); return }
    }

    setLoading(false)
    setForm(f => ({ ...f, password: '', confirmPassword: '' }))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Layout>
      <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-8">Profile & Settings</h1>

      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 font-display font-extrabold text-2xl flex items-center justify-center">
          {initials}
        </div>
        <div>
          <p className="font-display font-bold text-gray-900 text-lg">{profile?.name}</p>
          <p className="text-sm text-gray-400">{profile?.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <section>
          <h2 className="font-display font-bold text-lg text-gray-800 mb-5">Account Settings</h2>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
          )}
          {saved && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
              ✅ Settings saved!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Display Name</label>
              <input type="text" required
                className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400 mb-1.5 block">Email Address</label>
              <input type="email" readOnly
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-default"
                value={form.email}/>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">New Password</label>
              <input type="password" placeholder="Leave blank to keep current"
                className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}/>
            </div>
            {form.password && (
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1.5 block">Confirm New Password</label>
                <input type="password"
                  className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-300 transition-colors"
                  value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}/>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-full hover:bg-orange-400 transition-colors shadow-sm disabled:opacity-60">
              {loading ? 'Saving…' : 'Save Settings'}
            </button>
          </form>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg text-gray-800 mb-5">Notification Preferences</h2>
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 space-y-4">
            {[
              { key: 'emailNotifs', label: 'Email notifications', desc: 'Get notified by email for overdue tasks and project updates.' },
              { key: 'inAppNotifs', label: 'In-app notifications', desc: 'See alerts inside TaskSplit when anything changes.' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-start gap-4 cursor-pointer">
                <input type="checkbox"
                  className="mt-0.5 w-5 h-5 accent-orange-500 cursor-pointer"
                  checked={notifPrefs[key]}
                  onChange={e => setNotifPrefs(p => ({ ...p, [key]: e.target.checked }))}/>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
