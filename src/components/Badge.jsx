const STYLES = {
  Overdue:      'bg-red-100 text-red-600',
  Done:         'bg-green-100 text-green-700',
  'In Progress':'bg-blue-100 text-blue-600',
  'To Do':      'bg-gray-100 text-gray-500',
  Active:       'bg-emerald-100 text-emerald-700',
  Inactive:     'bg-gray-100 text-gray-400',
}

export default function Badge({ label }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STYLES[label] ?? 'bg-gray-100 text-gray-500'}`}>
      {label}
    </span>
  )
}
