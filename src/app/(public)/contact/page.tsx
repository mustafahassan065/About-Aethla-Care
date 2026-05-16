'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { publicApi } from '@/lib/api'
import toast from 'react-hot-toast'

const schema = z.object({
  firstName:   z.string().min(2, 'Required'),
  lastName:    z.string().min(2, 'Required'),
  phone:       z.string().min(8, 'Valid phone required'),
  email:       z.string().email('Valid email required'),
  service:     z.string().min(1, 'Please select a service'),
  location:    z.string().min(1, 'Please select your area'),
  message:     z.string().optional(),
})

type FormData = z.infer<typeof schema>

const services = [
  'Elderly Care', 'Disability Support', 'Newborn Baby Care',
  'Maternity Care', 'Home Wellness Services', 'Telehealth Support',
  'Patient Navigation', 'Not sure — need advice',
]

const locations = ['Doha', 'Lusail', 'Al Wakrah', 'Al Rayyan', 'Other']

const contactItems = [
  { icon: '📞', title: 'Phone',          value: '+974 4000 0000',       href: 'tel:+97440000000' },
  { icon: '💬', title: 'WhatsApp (24/7)', value: '+974 5000 0000',      href: 'https://wa.me/97450000000' },
  { icon: '✉️', title: 'Email',          value: 'care@aethlacare.qa',   href: 'mailto:care@aethlacare.qa' },
  { icon: '📍', title: 'Office',         value: 'West Bay, Doha, Qatar', href: '#' },
  { icon: '🕐', title: 'Office Hours',   value: 'Sun–Thu 8am–6pm · Emergency 24/7', href: '#' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await publicApi.submitConsultation(data)
      setSubmitted(true)
      reset()
      toast.success('Consultation request submitted! We\'ll contact you within 2 hours.')
    } catch {
      toast.error('Something went wrong. Please try again or call us directly.')
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-section-gradient py-24 px-4 text-center">
        <div className="trust-pill inline-flex mb-5 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Get in Touch</div>
        <h1 className="text-display-lg text-white mb-4">Book Your Free Care Consultation</h1>
        <p className="text-body-lg text-white/75 max-w-lg mx-auto">
          Our care advisors are ready to help design the perfect care plan for your family. No obligation, no pressure.
        </p>
      </section>

      {/* Form section */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Contact info */}
            <div className="lg:col-span-2">
              <h3 className="text-heading-xl mb-6">How to Reach Us</h3>
              <div className="flex flex-col gap-4 mb-8">
                {contactItems.map((c) => (
                  <a
                    key={c.title}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4 p-4 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-xl flex-shrink-0">{c.icon}</div>
                    <div>
                      <strong className="block text-body-sm font-bold font-poppins text-neutral-800">{c.title}</strong>
                      <span className="text-body-sm text-neutral-500">{c.value}</span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'var(--color-primary-light)', border: '1.5px solid rgba(27,107,138,0.15)' }}>
                <h4 className="text-heading-sm text-primary-500 mb-2">📋 Service Areas</h4>
                <p className="text-body-sm text-neutral-600">
                  We serve families across <strong>Doha, Lusail, Al Wakrah, Al Rayyan</strong>, and surrounding areas throughout Qatar.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card p-8" style={{ boxShadow: '0 8px 32px rgba(27,107,138,0.10)' }}>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-heading-xl text-neutral-800 mb-2">Consultation Request Submitted!</h3>
                    <p className="text-body-md text-neutral-500 mb-6">
                      A care advisor will contact you within 2 hours during business hours. For urgent needs, please call us directly.
                    </p>
                    <button onClick={() => setSubmitted(false)} className="btn-primary">Submit Another Request</button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-heading-xl mb-1">Book a Free Consultation</h3>
                    <p className="text-body-sm text-neutral-400 mb-6">Fill in your details and a care advisor will contact you within 2 hours.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">First Name</label>
                          <input {...register('firstName')} placeholder="Your first name" className="form-input" />
                          {errors.firstName && <p className="text-caption text-red-500 mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                          <label className="form-label">Last Name</label>
                          <input {...register('lastName')} placeholder="Your last name" className="form-input" />
                          {errors.lastName && <p className="text-caption text-red-500 mt-1">{errors.lastName.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Phone Number</label>
                          <input {...register('phone')} placeholder="+974 XXXX XXXX" className="form-input" />
                          {errors.phone && <p className="text-caption text-red-500 mt-1">{errors.phone.message}</p>}
                        </div>
                        <div>
                          <label className="form-label">Email Address</label>
                          <input {...register('email')} type="email" placeholder="your@email.com" className="form-input" />
                          {errors.email && <p className="text-caption text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="form-label">Care Service Needed</label>
                        <select {...register('service')} className="form-input">
                          <option value="">Select a service...</option>
                          {services.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.service && <p className="text-caption text-red-500 mt-1">{errors.service.message}</p>}
                      </div>

                      <div>
                        <label className="form-label">Location in Qatar</label>
                        <select {...register('location')} className="form-input">
                          <option value="">Select your area...</option>
                          {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                        {errors.location && <p className="text-caption text-red-500 mt-1">{errors.location.message}</p>}
                      </div>

                      <div>
                        <label className="form-label">Tell Us More (Optional)</label>
                        <textarea
                          {...register('message')}
                          placeholder="Describe your care needs, timeline, or any specific requirements..."
                          className="form-input min-h-[100px] resize-y"
                        />
                      </div>

                      <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg w-full">
                        {isSubmitting ? '⏳ Submitting...' : '📋 Submit Consultation Request'}
                      </button>

                      <p className="text-caption text-neutral-400 text-center">
                        🔒 Your information is 100% confidential and secure. We will contact you within 2 hours during business hours.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
