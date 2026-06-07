import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 – Page Not Found | Aethla Care' }

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-accent-600 px-4">
      <div className="text-center max-w-lg">
        <div className="text-[120px] font-extrabold font-poppins leading-none mb-4"
          style={{ background: 'linear-gradient(135deg, #5DD6B8, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </div>
        <h1 className="text-3xl font-bold font-poppins text-white mb-3">Page Not Found</h1>
        <p className="text-white/65 text-body-md mb-8">
          The page you are looking for doesn&apos;t exist or has been moved. Let us help you find what you need.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-white btn-lg">🏠 Go Home</Link>
          <Link href="/contact" className="btn-ghost btn-lg">📋 Book Consultation</Link>
        </div>
        <div className="mt-8 text-white/40 text-caption">
          Need help? Call us: <a href="tel:+97440000000" className="text-white/60 hover:text-white">+974 4000 0000</a>
        </div>
      </div>
    </div>
  )
}
