import Nav from './Nav'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <Nav />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 fade-in">
        {children}
      </main>
      <Footer />
    </div>
  )
}
