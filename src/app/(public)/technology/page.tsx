import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Technology Platform | AI-Powered Home Healthcare Qatar',
  description: 'Discover Aethla Care\'s technology platform — AI caregiver matching, real-time family portal, GPS check-ins, digital care notes, and secure communications.',
}
const features = [
  { icon: '🤖', title: 'AI Caregiver Matching', desc: 'Our proprietary matching algorithm considers language, cultural compatibility, clinical skills, availability, proximity, and client preferences to find the ideal caregiver for every family.' },
  { icon: '📱', title: 'Real-Time Family Portal', desc: 'A secure, role-based portal giving families 24/7 visibility into care schedules, daily care notes, caregiver updates, billing, and direct messaging — on any device.' },
  { icon: '📍', title: 'GPS-Verified Check-Ins', desc: 'Caregivers check in and out via GPS-verified location tracking, giving families real-time confirmation that visits are happening on time, every time.' },
  { icon: '📝', title: 'Digital Care Notes', desc: 'Mobile-first care documentation with photo uploads, voice-to-text, vital signs tracking, medication logs, and instant family sharing after each visit.' },
  { icon: '📅', title: 'Smart Scheduling Engine', desc: 'Automated rostering with conflict detection, shift management, real-time alerts for missed visits, and automatic caregiver substitution suggestions.' },
  { icon: '🔒', title: 'Encrypted Communications', desc: 'HIPAA-inspired end-to-end encrypted messaging between families, caregivers, and care coordinators — keeping sensitive health information completely private.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Comprehensive operational analytics for our care coordinators — visit completion rates, incident tracking, revenue reporting, and staff performance KPIs.' },
  { icon: '🏥', title: 'EHR Integration Ready', desc: 'Built with HL7 FHIR standards in mind for future integration with Qatar\'s national health systems and hospital EMR platforms.' },
]
export default function TechnologyPage() {
  return (
    <>
      <section className="bg-section-gradient py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="trust-pill inline-flex mb-5 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Our Technology</div>
          <h1 className="text-display-lg text-white mb-4">Technology-Driven Home Healthcare</h1>
          <p className="text-body-lg text-white/75 max-w-2xl mx-auto">Our integrated platform makes care delivery smarter, safer, and more transparent — for families and caregivers alike.</p>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Platform Features</div>
            <h2 className="text-display-sm mb-4">Built for Every Stakeholder</h2>
            <p className="text-body-lg text-neutral-500">From AI-powered matching to real-time family visibility, our platform transforms how home healthcare is delivered in Qatar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {features.map((f) => (
              <div key={f.title} className="card card-hover p-6">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-heading-md text-primary-500 mb-2">{f.title}</h3>
                <p className="text-body-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-3">Family Portal</div>
              <h2 className="text-display-sm mb-4">Complete Transparency, Total Peace of Mind</h2>
              <p className="text-body-md text-neutral-500 mb-6">Our secure family portal gives you complete visibility into your loved one's care — from anywhere in the world. View daily care notes, track visit schedules, read caregiver updates, access billing, and communicate directly with your care team.</p>
              <ul className="flex flex-col gap-3 mb-8">
                {['View daily care notes and vital signs', 'Track visit schedules in real-time', 'Direct messaging with caregivers', 'Access and download invoices', 'Receive instant alerts for any concerns', 'Multi-family member access'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-body-sm text-neutral-600">
                    <div className="w-6 h-6 rounded-full bg-accent-50 flex items-center justify-center text-accent-600 text-xs font-bold flex-shrink-0">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn-primary btn-lg">Get Access to the Portal →</Link>
            </div>
            <div className="card p-8" style={{ background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light))' }}>
              <div className="text-6xl mb-4 text-center">📱</div>
              <h3 className="text-heading-xl text-center text-primary-500 mb-3">Available on All Devices</h3>
              <p className="text-body-sm text-neutral-500 text-center mb-6">Access your family portal from any web browser — desktop, tablet, or mobile. No app download required.</p>
              <div className="grid grid-cols-3 gap-3">
                {['🖥️ Desktop', '📱 Mobile', '📟 Tablet'].map(d => (
                  <div key={d} className="card p-3 text-center text-body-sm font-semibold text-neutral-700">{d}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-section-gradient text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm text-white mb-4">Experience the Future of Home Healthcare</h2>
          <p className="text-body-lg text-white/75 mb-8">Book a free consultation and see how our technology keeps your family connected and informed every step of the way.</p>
          <Link href="/contact" className="btn-white btn-lg">Book Free Consultation →</Link>
        </div>
      </section>
    </>
  )
}
