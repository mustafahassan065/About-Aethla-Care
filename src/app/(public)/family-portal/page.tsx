import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Family Portal | Aethla Care Home Healthcare Qatar',
  description: 'Access your Aethla Care family portal — view care schedules, daily notes, caregiver updates, billing, and communicate with your care team.',
}
const portalFeatures = [
  { icon: '📅', title: 'Care Schedules', desc: 'View upcoming and past visits in real-time.' },
  { icon: '📝', title: 'Daily Care Notes', desc: 'Read detailed notes from every caregiver visit.' },
  { icon: '📊', title: 'Health Monitoring', desc: 'Track vital signs, mood, and wellness trends.' },
  { icon: '💬', title: 'Direct Messaging', desc: 'Communicate directly with your care team.' },
  { icon: '🧾', title: 'Billing & Invoices', desc: 'View and download invoices and payment history.' },
  { icon: '🔔', title: 'Real-Time Alerts', desc: 'Instant notifications for any changes or concerns.' },
]
export default function FamilyPortalPage() {
  return (
    <>
      <section className="bg-section-gradient py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="trust-pill inline-flex mb-5 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Family Portal</div>
          <h1 className="text-display-lg text-white mb-4">Your Family Care Hub</h1>
          <p className="text-body-lg text-white/75 max-w-xl mx-auto">Stay connected to your loved one's care — anytime, anywhere. Complete transparency, total peace of mind.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/admin/login" className="btn-white btn-lg">🔐 Login to Portal</Link>
            <Link href="/contact" className="btn-ghost btn-lg">📋 Get Access</Link>
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Portal Features</div>
            <h2 className="text-display-sm mb-4">Everything You Need to Stay Connected</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portalFeatures.map(f => (
              <div key={f.title} className="card card-hover p-6 text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h4 className="text-heading-md text-primary-500 mb-1">{f.title}</h4>
                <p className="text-body-sm text-neutral-500">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-body-md text-neutral-500 mb-5">Portal access is provided free to all Aethla Care clients and their families.</p>
            <Link href="/contact" className="btn-primary btn-lg">Book Care to Get Access →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
