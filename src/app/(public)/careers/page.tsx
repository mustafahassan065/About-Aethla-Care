import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Careers at Aethla Care | Home Healthcare Jobs in Qatar',
  description: 'Join Qatar\'s leading home healthcare team. Caregiver, coordinator, nurse, and administrative positions available across Doha and Qatar.',
}
const openings = [
  { title: 'Registered Nurse – Elderly Care', type: 'Full-time', location: 'Doha', dept: 'Clinical' },
  { title: 'Certified Baby Nurse', type: 'Full-time / Part-time', location: 'Doha, Lusail', dept: 'Newborn Care' },
  { title: 'Postnatal Care Specialist', type: 'Full-time', location: 'Qatar-wide', dept: 'Maternity' },
  { title: 'Disability Support Worker', type: 'Full-time', location: 'Doha', dept: 'Disability Support' },
  { title: 'Care Coordinator', type: 'Full-time', location: 'Doha HQ', dept: 'Operations' },
  { title: 'Wellness Nurse / Health Coach', type: 'Full-time', location: 'Qatar-wide', dept: 'Wellness' },
]
const benefits = [
  { icon: '💰', title: 'Competitive Salary', desc: 'Market-leading compensation with performance bonuses' },
  { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive medical coverage for you and your family' },
  { icon: '📚', title: 'Continuous Training', desc: 'Annual professional development and certification support' },
  { icon: '✈️', title: 'Visa Sponsorship', desc: 'Full Qatar work visa and residency support for expats' },
  { icon: '🏠', title: 'Accommodation Support', desc: 'Housing assistance packages for new joiners' },
  { icon: '🌟', title: 'Career Growth', desc: 'Clear progression paths and leadership opportunities' },
]
export default function CareersPage() {
  return (
    <>
      <section className="bg-section-gradient py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="trust-pill inline-flex mb-5 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Join Our Team</div>
          <h1 className="text-display-lg text-white mb-4">Make a Difference. Build a Career.</h1>
          <p className="text-body-lg text-white/75 max-w-xl mx-auto">Join Qatar's most compassionate and innovative home healthcare team. We're hiring dedicated professionals who share our passion for making lives better.</p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Why Aethla Care</div>
            <h2 className="text-display-sm mb-4">Benefits & Perks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
            {benefits.map(b => (
              <div key={b.title} className="card card-hover p-6">
                <div className="text-4xl mb-3">{b.icon}</div>
                <h4 className="text-heading-md text-primary-500 mb-1">{b.title}</h4>
                <p className="text-body-sm text-neutral-500">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="section-header">
            <div className="section-label justify-center mb-3">Open Positions</div>
            <h2 className="text-display-sm mb-4">Current Openings in Qatar</h2>
          </div>
          <div className="flex flex-col gap-3 max-w-4xl mx-auto">
            {openings.map(j => (
              <div key={j.title} className="card card-hover p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-heading-sm text-neutral-800 mb-1">{j.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge-primary">{j.dept}</span>
                    <span className="badge-accent">{j.type}</span>
                    <span className="text-caption text-neutral-400">📍 {j.location}</span>
                  </div>
                </div>
                <Link href="/contact" className="btn-primary btn-sm flex-shrink-0">Apply Now →</Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-body-md text-neutral-500 mb-4">Don't see your role? We're always looking for talented healthcare professionals.</p>
            <Link href="/contact" className="btn-outline btn-lg">Send Your CV →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
