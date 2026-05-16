import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Patient Navigation Services in Qatar | Healthcare Guidance Doha',
  description: 'Insurance guidance, healthcare system navigation, appointment scheduling, and medical information interpretation in Qatar.',
}
const services = [
  { title: 'Insurance Guidance', desc: 'Expert help understanding your health insurance coverage, claims process, and benefits in Qatar.' },
  { title: 'Healthcare System Navigation', desc: 'Guiding patients through Qatar\'s healthcare system — PHCC, HMC, and private sector providers.' },
  { title: 'Appointment Scheduling', desc: 'Comprehensive appointment booking, reminder management, and specialist referral coordination.' },
  { title: 'Medical Information Interpretation', desc: 'Translating complex medical information into clear, understandable language for patients and families.' },
  { title: 'Pre-Appointment Preparation', desc: 'Helping patients prepare questions, documents, and information for medical appointments.' },
  { title: 'Post-Appointment Follow-Up', desc: 'Ensuring recommendations are understood, implemented, and followed up appropriately.' },
]
export default function PatientNavigation() {
  return (
    <>
      <section className="relative min-h-[500px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.95) 0%, rgba(13,43,62,0.7) 60%, rgba(13,43,62,0.4) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Patient Navigation</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Patient Navigation & Healthcare Guidance in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-lg mb-6">Expert guidance to help you navigate Qatar's healthcare system with confidence, clarity, and ease.</p>
          <Link href="/contact" className="btn-accent btn-lg">Get Navigation Support</Link>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-display-sm mb-8">Patient Navigation Services</h2>
              <div className="flex flex-col gap-4">
                {services.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600 font-bold text-sm flex-shrink-0">✓</div>
                    <div><strong className="block text-body-md font-semibold font-poppins text-neutral-800 mb-1">{item.title}</strong><p className="text-body-sm text-neutral-500">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="card p-6 sticky top-24">
                <div className="text-4xl mb-3">🧭</div>
                <h3 className="text-heading-xl mb-3">Never Navigate Alone</h3>
                <p className="text-body-sm text-neutral-500 mb-5">Qatar's healthcare system can be complex. Our bilingual patient navigators are here to guide you every step of the way.</p>
                <Link href="/contact" className="btn-primary btn-lg w-full text-center block">Get Navigation Support →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
