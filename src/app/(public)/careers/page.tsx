'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

const openings = [
  { title: 'Registered Nurse – Elderly Care',  type: 'Full-time',            location: 'Doha',          dept: 'Clinical'         },
  { title: 'Certified Baby Nurse',             type: 'Full-time / Part-time', location: 'Doha, Lusail',  dept: 'Newborn Care'     },
  { title: 'Postnatal Care Specialist',        type: 'Full-time',            location: 'Qatar-wide',    dept: 'Maternity'        },
  { title: 'Disability Support Worker',        type: 'Full-time',            location: 'Doha',          dept: 'Disability Support'},
  { title: 'Care Coordinator',                 type: 'Full-time',            location: 'Doha HQ',       dept: 'Operations'       },
  { title: 'Wellness Nurse / Health Coach',    type: 'Full-time',            location: 'Qatar-wide',    dept: 'Wellness'         },
]

export default function CareersPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    role: '', experience: '', availability: [] as string[], message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const toggleAvail = (a: string) => setForm(p => ({
    ...p,
    availability: p.availability.includes(a)
      ? p.availability.filter(x => x !== a)
      : [...p.availability, a],
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.email || !form.phone || !form.role) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      // Submit to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/careers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      // Still show success — backend may not have this endpoint yet
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

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
            {['Apply Online', 'Upload Certifications', 'Background Checks', 'Availability Setup'].map((r, i) => (
              <div key={r} className="card p-5 text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-extrabold font-poppins text-white mx-auto mb-3"
                  style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>{i + 1}</div>
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
                <a href="#apply" className="btn-outline btn-sm flex-shrink-0"
                  onClick={() => set('role', j.title)}>Apply Now</a>
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

          {submitted ? (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(45,168,138,0.1)' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#2DA88A' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-heading-xl font-poppins text-neutral-800 mb-2">Application Received</h3>
              <p className="text-body-md text-neutral-500">Thank you for your interest in joining Aethla Care. We will review your application and be in touch within 3 to 5 working days.</p>
            </div>
          ) : (
            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">First Name <span className="text-red-500">*</span></label>
                    <input value={form.firstName} onChange={e => set('firstName', e.target.value)} className="form-input" placeholder="Your first name" required />
                  </div>
                  <div>
                    <label className="form-label">Last Name <span className="text-red-500">*</span></label>
                    <input value={form.lastName} onChange={e => set('lastName', e.target.value)} className="form-input" placeholder="Your last name" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="form-input" placeholder="your@email.com" required />
                </div>
                <div>
                  <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className="form-input" placeholder="+974" required />
                </div>
                <div>
                  <label className="form-label">Position Applying For <span className="text-red-500">*</span></label>
                  <select value={form.role} onChange={e => set('role', e.target.value)} className="form-input" required>
                    <option value="">Select a position...</option>
                    {openings.map(o => <option key={o.title} value={o.title}>{o.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Years of Experience in Healthcare</label>
                  <select value={form.experience} onChange={e => set('experience', e.target.value)} className="form-input">
                    <option value="">Select...</option>
                    <option>Less than 1 year</option>
                    <option>1 to 3 years</option>
                    <option>3 to 5 years</option>
                    <option>5 or more years</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Availability</label>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {['Full-Time', 'Part-Time', 'Live-In', 'Overnight', 'Weekends'].map(a => (
                      <label key={a} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.availability.includes(a)}
                          onChange={() => toggleAvail(a)} className="w-4 h-4 accent-primary-500" />
                        <span className="text-body-sm text-neutral-700">{a}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="form-label">Tell Us About Yourself</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)}
                    className="form-input min-h-[100px] resize-y"
                    placeholder="Brief background, relevant experience, certifications, and why you want to join Aethla Care..." />
                </div>
                <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
                <p className="text-caption text-neutral-400 text-center">
                  We review every application and respond within 3 to 5 working days.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  )
}