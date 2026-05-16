import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Disability Support Services in Qatar | Home Care Doha',
  description: 'Compassionate disability support services in Qatar — daily living assistance, personal care, social engagement, transport, and family respite support across Doha.',
  keywords: ['disability support Qatar', 'home disability care Doha', 'NDIS Qatar', 'disability caregiver Qatar'],
}
const services = [
  { title: 'Daily Living Support', desc: 'Assistance with personal care, daily routines, and household activities tailored to individual needs.' },
  { title: 'Personal Care', desc: 'Dignified assistance with hygiene, grooming, dressing, and personal care routines.' },
  { title: 'Social Engagement', desc: 'Supporting participation in social activities, hobbies, and community life.' },
  { title: 'Community Participation', desc: 'Facilitating access to education, recreational activities, and public services.' },
  { title: 'Transport Assistance', desc: 'Safe, reliable transportation support to medical appointments and daily activities.' },
  { title: 'Family Respite Support', desc: 'Giving family caregivers essential time to rest, knowing their loved one is in safe hands.' },
]
export default function DisabilitySupport() {
  return (
    <>
      <section className="relative min-h-[500px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.95) 0%, rgba(13,43,62,0.7) 60%, rgba(13,43,62,0.4) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Disability Support Services</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Compassionate Disability Support in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-lg mb-6">Empowering individuals with disabilities to live with independence, dignity, and full community participation.</p>
          <Link href="/contact" className="btn-accent btn-lg">Book Disability Support</Link>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-display-sm mb-8">Disability Support Services</h2>
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
                <div className="text-4xl mb-3">♿</div>
                <h3 className="text-heading-xl mb-3">Person-Centered Support</h3>
                <p className="text-body-sm text-neutral-500 mb-5">Our disability support specialists are trained in person-centered approaches, working alongside individuals and families to build support plans that maximize independence.</p>
                <Link href="/contact" className="btn-primary btn-lg w-full text-center block">Get a Support Assessment →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
