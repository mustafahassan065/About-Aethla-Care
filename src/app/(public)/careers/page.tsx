import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Careers at Aethla Care Qatar | Join Our Caregiving Team',
  description: 'Join Aethla Care as a licensed caregiver, nurse, or care coordinator in Qatar. Apply online, upload your certifications, and become part of a professional care team.',
}

const benefits = [
  { title: 'Structured Onboarding',     desc: 'Every new team member goes through a thorough onboarding programme before their first placement.' },
  { title: 'Ongoing Training',           desc: 'We invest in continuous professional development so our team stays current with best practice.' },
  { title: 'Digital Tools',              desc: 'Our platform makes documentation straightforward and keeps coordinators close for any support needed.' },
  { title: 'Supportive Coordinators',    desc: 'You are never on your own. Coordinators are accessible throughout every placement.' },
  { title: 'Flexible Arrangements',      desc: 'We work with caregivers to find placements that fit their availability and experience.' },
  { title: 'Professional Environment',   desc: 'Families we work with respect and value caregivers. We set those expectations from the start.' },
]

const roles = [
  { title: 'Senior Caregiver / Elderly Care Specialist', tags: ['Elderly Care', 'Full-Time', 'Doha'] },
  { title: 'Baby Nurse / Newborn Care Specialist',        tags: ['Newborn Care', 'Full-Time', 'Qatar-Wide'] },
  { title: 'Maternity Care Support Worker',               tags: ['Maternity', 'Part-Time / Full-Time', 'Doha'] },
  { title: 'Disability Support Worker',                   tags: ['Disability Support', 'Full-Time', 'Qatar-Wide'] },
  { title: 'Care Coordinator',                            tags: ['Coordination', 'Office-Based', 'Doha'] },
]

export default function Careers() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Join Our Team</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Build a Career Doing Work That Genuinely Matters</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Aethla Care is looking for qualified, caring professionals to join a team that takes quality seriously.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="#apply" className="btn-accent btn-lg">Apply Now</Link>
          </div>
        </div>
      </section>

      {/* Why join */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Why Aethla Care</div>
            <h2 className="text-display-sm mb-4">What We Offer Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {benefits.map((b) => (
              <div key={b.title} className="card p-6">
                <h4 className="text-heading-md text-primary-500 mb-2">{b.title}</h4>
                <p className="text-body-sm text-neutral-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Current Openings</div>
            <h2 className="text-display-sm mb-4">Roles We Are Recruiting For</h2>
          </div>
          <div className="flex flex-col gap-4 mt-8 max-w-3xl mx-auto">
            {roles.map((r) => (
              <div key={r.title} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-heading-sm text-neutral-800 mb-2">{r.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {r.tags.map((t) => <span key={t} className="badge-primary text-xs">{t}</span>)}
                  </div>
                </div>
                <Link href="#apply" className="btn-outline btn-sm flex-shrink-0">Apply</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="section-pad bg-white" id="apply">
        <div className="container-max max-w-2xl">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Applications</div>
            <h2 className="text-display-sm mb-4">Submit Your Application</h2>
            <p className="text-body-lg text-neutral-500 mb-8">Complete the form below and a member of our team will be in touch within 3–5 working days.</p>
          </div>
          <div className="card p-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label">First Name</label>
                <input type="text" className="form-input" placeholder="Your first name" />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input type="text" className="form-input" placeholder="Your last name" />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="your@email.com" />
            </div>
            <div className="mb-4">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" placeholder="+974" />
            </div>
            <div className="mb-4">
              <label className="form-label">Role Applying For</label>
              <select className="form-input">
                <option value="">Select a role...</option>
                {roles.map(r => <option key={r.title} value={r.title}>{r.title}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label">Years of Experience in Care</label>
              <select className="form-input">
                <option value="">Select...</option>
                <option>Less than 1 year</option>
                <option>1–3 years</option>
                <option>3–5 years</option>
                <option>5+ years</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="form-label">Tell Us About Yourself</label>
              <textarea className="form-input min-h-[100px] resize-y" placeholder="Brief background, relevant experience, and why you are interested in joining Aethla Care..." />
            </div>
            <button className="btn-primary btn-lg w-full">Submit Application</button>
            <p className="text-caption text-neutral-400 text-center mt-3">We review every application and respond within 3–5 working days.</p>
          </div>
        </div>
      </section>
    </>
  )
}