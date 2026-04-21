export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-amber-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex gap-4">
          <span className="cursor-pointer hover:text-orange-500 transition-colors">Privacy Policy</span>
          <span className="cursor-pointer hover:text-orange-500 transition-colors">Contact</span>
          <span className="cursor-pointer hover:text-orange-500 transition-colors">About</span>
        </div>
        <span>© 2026 TaskSplit. All rights reserved.</span>
      </div>
    </footer>
  )
}
