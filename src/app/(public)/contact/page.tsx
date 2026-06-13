'use client'
import { useState } from 'react'

const services = [
  'Elderly Care', 'Disability Support', 'Newborn Baby Care',
  'Maternity Care', 'Home Wellness', 'Telehealth Support',
  'Patient Navigation', 'Not Sure — Need Guidance',
]

const areas = ['Doha', 'Lusail', 'Al Wakrah', 'Al Rayyan', 'Ain Khaled', 'Other']

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    service: '', location: '', message: '',
  })

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.phone || !form.service) return
    setLoading(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-24" style={{ background: 'linear-gradient(135deg, #0D2B3E 0%, #1B6B8A 100%)' }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="container-max px-4 md:px-8 relative z-10 text-center">
          <div className="trust-pill inline-flex mb-4 justify-center">
            <span className="w-2 h-2 rounded-full bg-accent-400" /> Get In Touch
          </div>
          <h1 className="text-display-lg text-white mb-4">Start With a Free Consultation</h1>
          <p className="text-body-lg text-white/70 max-w-xl mx-auto">
            Tell us a little about your situation and a coordinator will be in touch within two hours.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Contact info */}
            <div>
              <h2 className="text-heading-xl font-poppins text-neutral-800 mb-6">How to Reach Us</h2>
              <div className="flex flex-col gap-5 mb-8">
                {[
                  { label: 'Phone',    value: '+974 4000 0000',        href: 'tel:+97440000000' },
                  { label: 'WhatsApp', value: 'Message Our Team',      href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` },
                  { label: 'Email',    value: 'info@aethlacare.com',   href: 'mailto:info@aethlacare.com' },
                  { label: 'Office',   value: 'West Bay, Doha, Qatar', href: undefined },
                ].map((c) => (
                  <div key={c.label}>
                    <p className="text-caption text-neutral-400 uppercase tracking-wider mb-0.5">{c.label}</p>
                    {c.href
                      ? <a href={c.href} className="text-body-md font-semibold text-primary-500 hover:underline">{c.value}</a>
                      : <p className="text-body-md font-semibold text-neutral-700">{c.value}</p>
                    }
                  </div>
                ))}
              </div>

              <div className="card p-5 mb-4">
                <p className="text-heading-sm font-poppins text-neutral-800 mb-2">Response Times</p>
                <p className="text-body-sm text-neutral-500 mb-3">We respond to all enquiries within two hours during operating hours.</p>
                <p className="text-body-sm text-neutral-500">For urgent situations, please call us directly — a coordinator is available around the clock.</p>
              </div>

              <div className="card p-5" style={{ borderLeft: '4px solid #2DA88A' }}>
                <p className="text-caption text-neutral-400 mb-1">24-Hour Care Line</p>
                <a href="tel:+97460000000" className="text-heading-md font-bold font-poppins text-primary-500">+974 6000 0000</a>
                <p className="text-body-sm text-neutral-500 mt-1">For urgent and emergency care requests</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="card p-10 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(45,168,138,0.1)' }}>
                    <svg className="w-8 h-8 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#2DA88A' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-heading-xl font-poppins text-neutral-800 mb-3">We have received your enquiry</h3>
                  <p className="text-body-md text-neutral-500">A care coordinator will call you within two hours. For urgent assistance, please call <strong>+974 4000 0000</strong> directly.</p>
                </div>
              ) : (
                <div className="card p-8">
                  <h2 className="text-heading-xl font-poppins text-neutral-800 mb-1">Tell Us About Your Needs</h2>
                  <p className="text-body-sm text-neutral-400 mb-6">A coordinator will review your request and follow up shortly.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">First Name <span className="text-red-500">*</span></label>
                        <input value={form.firstName} onChange={e => set('firstName', e.target.value)} className="form-input" placeholder="Ahmed" required />
                      </div>
                      <div>
                        <label className="form-label">Last Name</label>
                        <input value={form.lastName} onChange={e => set('lastName', e.target.value)} className="form-input" placeholder="Al-Rashid" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
                        <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className="form-input" placeholder="+974 5500 0000" required />
                      </div>
                      <div>
                        <label className="form-label">Email Address</label>
                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="form-input" placeholder="your@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Type of Care Needed <span className="text-red-500">*</span></label>
                      <select value={form.service} onChange={e => set('service', e.target.value)} className="form-input" required>
                        <option value="">Select a service...</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Your Location</label>
                      <select value={form.location} onChange={e => set('location', e.target.value)} className="form-input">
                        <option value="">Select your area...</option>
                        {areas.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Anything else we should know?</label>
                      <textarea value={form.message} onChange={e => set('message', e.target.value)} className="form-input min-h-[100px] resize-y" placeholder="Tell us about the person who needs care, specific requirements, or how soon you are looking to start..." />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
                      {loading ? 'Sending...' : 'Submit Consultation Request'}
                    </button>
                    <p className="text-caption text-neutral-400 text-center">We respond within 2 hours. Your information is kept strictly confidential.</p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}