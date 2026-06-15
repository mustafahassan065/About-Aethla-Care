import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Technology-Driven Home Healthcare | Aethla Care Qatar',
  description: 'Aethla Care\'s integrated healthcare platform — real-time care tracking, secure family portal, AI-powered caregiver matching, digital care notes, and smart scheduling.',
}

const features = [
  {
    title: 'Real-Time Care Tracking',
    desc: 'Every visit is logged at check-in and check-out. Families receive automatic confirmation and can view timing records through the portal at any time.',
  },
  {
    title: 'Secure Family Portal',
    desc: 'A private, role-based online space where family members can view schedules, read care notes, access billing, and message the care team directly.',
  },
  {
    title: 'AI-Powered Caregiver Matching',
    desc: 'Our matching system considers language, gender preference, location, skills, availability, and cultural compatibility to find the most suitable caregiver for each family.',
  },
  {
    title: 'Digital Care Notes',
    desc: 'Caregivers complete structured digital notes after every visit — covering tasks completed, observations, vital signs, and any items flagged for follow-up.',
  },
  {
    title: 'Smart Scheduling',
    desc: 'Coordinated shift planning with real-time alerts for gaps or changes, automated rostering support, and GPS-verified check-in and check-out.',
  },
  {
    title: 'Secure Communication Systems',
    desc: 'All messages between families, caregivers, and coordinators are encrypted. Health data is handled to HIPAA-inspired standards and Qatar privacy guidelines.',
  },
]

const familyPortalFeatures = [
  'View schedules',
  'Access care notes',
  'Caregiver updates',
  'Notifications',
  'Billing overview',
  'Secure messaging',
]

export default function TechnologyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-section-gradient py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="trust-pill inline-flex mb-5 justify-center">
            <span className="w-2 h-2 rounded-full bg-accent-400" /> Our Platform
          </div>
          <h1 className="text-display-lg text-white mb-4">Technology-Driven Home Healthcare</h1>
          <p className="text-body-lg text-white/75 max-w-2xl mx-auto">
            Our integrated healthcare management system allows real-time care monitoring, secure family communication, digital care records, and transparent scheduling for complete peace of mind.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Platform Features</div>
            <h2 className="text-display-sm mb-4">What Our Platform Does</h2>
            <p className="text-body-lg text-neutral-500 max-w-2xl mx-auto">
              Technology that makes care delivery more transparent, consistent, and easy to follow — for families and the care team.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {features.map((f) => (
              <div key={f.title} className="card card-hover p-6">
                <h3 className="text-heading-md text-primary-500 mb-2">{f.title}</h3>
                <p className="text-body-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Portal */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-3">Family Portal</div>
              <h2 className="text-display-sm mb-4">Secure Family Portal</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-6">
                The Aethla Care family portal gives family members direct, secure access to their loved one&apos;s care — from anywhere in the world. Available on any device, no app download required.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {familyPortalFeatures.map(item => (
                  <li key={item} className="flex items-center gap-3 text-body-sm text-neutral-700">
                    <div className="w-5 h-5 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn-primary btn-lg">Get Access to the Portal</Link>
            </div>
            <div className="card p-8">
              <h3 className="text-heading-xl text-primary-500 mb-3">Available on All Devices</h3>
              <p className="text-body-sm text-neutral-500 mb-6">
                Access your family portal from any web browser — desktop, tablet, or mobile. Sign in with the credentials provided by your care coordinator.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {['Desktop', 'Mobile', 'Tablet'].map(d => (
                  <div key={d} className="card p-3 text-center text-body-sm font-semibold text-neutral-700">{d}</div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--color-primary-light)' }}>
                <p className="text-body-sm text-primary-700 font-medium">Portal access is set up when your care arrangement begins. Contact your coordinator to get started.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-section-gradient text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm text-white mb-4">See the Platform in Action</h2>
          <p className="text-body-lg text-white/75 mb-8">
            Book a free consultation and we will walk you through how our technology supports your family&apos;s care.
          </p>
          <Link href="/contact" className="btn-white btn-lg">Book a Free Consultation</Link>
        </div>
      </section>
    </>
  )
}