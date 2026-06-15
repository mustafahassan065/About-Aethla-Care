import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Careers at Aethla Care | Caregiver Jobs Qatar | Nursing Assistant Jobs Doha',
  description: 'Join Aethla Care as a caregiver, nurse, or coordinator in Qatar. Apply online, upload certifications, background checks, and availability setup.',
  keywords: 'caregiver jobs Qatar, nursing assistant jobs Doha, healthcare jobs Qatar',
}

const openings = [
  { title: 'Registered Nurse – Elderly Care',  type: 'Full-time',           location: 'Doha',          dept: 'Clinical'         },
  { title: 'Certified Baby Nurse',             type: 'Full-time / Part-time', location: 'Doha, Lusail', dept: 'Newborn Care'     },
  { title: 'Postnatal Care Specialist',        type: 'Full-time',           location: 'Qatar-wide',    dept: 'Maternity'        },
  { title: 'Disability Support Worker',        type: 'Full-time',           location: 'Doha',          dept: 'Disability Support' },
  { title: 'Care Coordinator',                 type: 'Full-time',           location: 'Doha HQ',       dept: 'Operations'       },
  { title: 'Wellness Nurse / Health Coach',    type: 'Full-time',           location: 'Qatar-wide',    dept: 'Wellness'         },
]

const requirements = [
  'Apply online',
  'Upload certifications',
  'Background checks',
  'Availability setup',
]

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-section-gradient py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="trust-pill inline-flex mb-5 justify-center">
            <span className="w-2 h-2 rounded-full bg-accent-400" /> Careers at Aethla Care
          </div>
          <h1 className="text-display-lg text-white mb-4">Caregiver Jobs in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-xl mx-auto">
            Join Qatar&apos;s leading home healthcare team. We are hiring dedicated professionals who care about making a real difference in people&apos;s lives.
          </p>
        </div>
      </section>

      {/* Application Process */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">How to Apply</div>
            <h2 className="text-display-sm mb-4">Application Process</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-8">
            {requirements.map((r, i) => (
              <div key={r} className="card p-5 text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-extrabold font-poppins text-white mx-auto mb-3"
                  style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>
                  {i + 1}
                </div>
                <p className="text-body-sm font-semibold text-neutral-700">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Open Positions</div>
            <h2 className="text-display-sm mb-4">Current Openings in Qatar</h2>
          </div>
          <div className="flex flex-col gap-3 max-w-4xl mx-auto mt-8">
            {openings.map(j => (
              <div key={j.title} className="card card-hover p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-heading-sm text-neutral-800 mb-2">{j.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge text-xs">{j.type}</span>
                    <span className="badge text-xs">{j.location}</span>
                    <span className="badge-primary text-xs">{j.dept}</span>
                  </div>
                </div>
                <Link href="#apply" className="btn-outline btn-sm flex-shrink-0">Apply Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-pad bg-white" id="apply">
        <div className="container-max max-w-2xl">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Apply Online</div>
            <h2 className="text-display-sm mb-4">Submit Your Application</h2>
            <p className="text-body-lg text-neutral-500 mb-8">
              Complete the form below and our team will review your application and be in touch within 3 to 5 working days.
            </p>
          </div>
          <div className="card p-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label">First Name <span className="text-red-500">*</span></label>
                <input type="text" className="form-input" placeholder="Your first name" />
              </div>
              <div>
                <label className="form-label">Last Name <span className="text-red-500">*</span></label>
                <input type="text" className="form-input" placeholder="Your last name" />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Email Address <span className="text-red-500">*</span></label>
              <input type="email" className="form-input" placeholder="your@email.com" />
            </div>
            <div className="mb-4">
              <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" className="form-input" placeholder="+974" />
            </div>
            <div className="mb-4">
              <label className="form-label">Position Applying For <span className="text-red-500">*</span></label>
              <select className="form-input">
                <option value="">Select a position...</option>
                {openings.map(o => <option key={o.title} value={o.title}>{o.title}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label">Years of Experience in Healthcare</label>
              <select className="form-input">
                <option value="">Select...</option>
                <option>Less than 1 year</option>
                <option>1 to 3 years</option>
                <option>3 to 5 years</option>
                <option>5 or more years</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label">Upload Certifications</label>
              <input type="file" className="form-input py-2" accept=".pdf,.jpg,.jpeg,.png" multiple />
              <p className="text-caption text-neutral-400 mt-1">PDF, JPG or PNG. Maximum 5MB per file.</p>
            </div>
            <div className="mb-4">
              <label className="form-label">Availability</label>
              <div className="flex flex-wrap gap-3 mt-1">
                {['Full-Time', 'Part-Time', 'Live-In', 'Overnight', 'Weekends'].map(a => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-primary-500" />
                    <span className="text-body-sm text-neutral-700">{a}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="form-label">Tell Us About Yourself</label>
              <textarea className="form-input min-h-[100px] resize-y" placeholder="Brief background, relevant experience, certifications, and why you want to join Aethla Care..." />
            </div>
            <button className="btn-primary btn-lg w-full">Submit Application</button>
            <p className="text-caption text-neutral-400 text-center mt-3">
              We review every application and respond within 3 to 5 working days.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}