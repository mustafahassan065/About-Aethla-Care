import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Elderly Care Services in Qatar | Home Senior Care Doha',
  description: 'Professional elderly home care services in Qatar. Daily living assistance, medication reminders, companionship, mobility support, overnight care, and post-hospital care across Doha, Lusail & Al Rayyan.',
  keywords: ['elderly care Qatar', 'home elderly care Doha', 'senior care Qatar', 'live-in caregiver Doha'],
}

const includes = [
  { title: 'Daily Living Assistance',    desc: 'Bathing, dressing, grooming, and personal hygiene support with dignity and respect.' },
  { title: 'Medication Reminders',       desc: 'Timely prompts and health monitoring to ensure medication compliance and wellbeing.' },
  { title: 'Companionship & Social Support', desc: 'Meaningful engagement, conversation, and activities to prevent loneliness.' },
  { title: 'Mobility Assistance',        desc: 'Safe support with movement, transfers, and gentle exercise to maintain function.' },
  { title: 'Overnight Care',             desc: '24-hour overnight supervision for seniors requiring round-the-clock attention.' },
  { title: 'Post-Hospital Support',      desc: 'Specialized recovery care following hospitalization to ensure safe healing at home.' },
]

const faqs = [
  { q: 'What areas in Qatar do you provide elderly care?', a: 'We provide elderly home care across Doha, Lusail, Al Wakrah, Al Rayyan, and surrounding areas of Qatar.' },
  { q: 'Do you provide live-in elderly caregivers?', a: 'Yes, we offer both live-in caregivers and scheduled visit arrangements depending on your loved one\'s needs.' },
  { q: 'Are your elderly caregivers dementia trained?', a: 'Yes — all our senior caregivers receive specialist training in dementia, Alzheimer\'s, and palliative care.' },
]

export default function ElderlyCare() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[500px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.95) 0%, rgba(13,43,62,0.7) 60%, rgba(13,43,62,0.4) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Elderly Care Services</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Professional Elderly Home Care in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-lg mb-6">Supporting independence, dignity, safety, and emotional wellbeing for seniors across Doha and Qatar.</p>
          <Link href="/contact" className="btn-accent btn-lg">Book Elderly Care Assessment</Link>
        </div>
      </section>

      {/* Main content */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Includes */}
            <div className="lg:col-span-2">
              <h2 className="text-display-sm mb-8">What&apos;s Included in Our Elderly Care</h2>
              <div className="flex flex-col gap-4">
                {includes.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600 font-bold text-sm flex-shrink-0">✓</div>
                    <div>
                      <strong className="block text-body-md font-semibold font-poppins text-neutral-800 mb-1">{item.title}</strong>
                      <p className="text-body-sm text-neutral-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="card p-6 sticky top-24">
                <div className="text-4xl mb-3">👴</div>
                <h3 className="text-heading-xl mb-3">Why Families Choose Us</h3>
                <p className="text-body-sm text-neutral-500 mb-5">Our elderly care specialists are handpicked for their clinical expertise and natural warmth.</p>
                <ul className="flex flex-col gap-2.5 mb-6">
                  {['MoH Licensed & Background Checked', 'Dementia & Alzheimer\'s Trained', 'Multilingual Care Teams', '24/7 Family Support Line', 'Real-Time Family Portal Access'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-body-sm text-neutral-600">
                      <span className="text-accent-500 font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn-primary btn-lg w-full text-center block">Book Free Assessment →</Link>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-display-sm mb-6 text-center">Common Questions</h2>
            <div className="max-w-2xl mx-auto flex flex-col gap-3">
              {faqs.map((f) => (
                <details key={f.q} className="card group">
                  <summary className="flex justify-between items-center p-5 cursor-pointer font-semibold text-neutral-800 hover:text-primary-500 transition-colors list-none">
                    {f.q}
                    <span className="ml-4 text-2xl text-primary-400 group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-body-sm text-neutral-500 border-t border-neutral-100 pt-4">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-section-gradient text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm text-white mb-4">Ready to Begin Elderly Care?</h2>
          <p className="text-body-lg text-white/75 mb-8">Book a free home assessment today and let us design a personalized care plan.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-white btn-lg">📋 Book Free Assessment</Link>
            <a href="https://wa.me/97400000000" target="_blank" rel="noopener noreferrer" className="btn-ghost btn-lg">💬 WhatsApp Us</a>
          </div>
        </div>
      </section>
    </>
  )
}
