import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Telehealth Services in Qatar | Virtual Healthcare Doha',
  description: 'Virtual consultations, remote chronic care support, wellness monitoring, and appointment coordination across Qatar.',
}
const services = [
  { title: 'Virtual Consultations', desc: 'Secure video and audio consultations with healthcare professionals from the comfort of home.' },
  { title: 'Wellness Monitoring', desc: 'Remote health tracking with regular check-ins, vital sign reviews, and digital health reports.' },
  { title: 'Remote Chronic Care Support', desc: 'Ongoing virtual support for diabetes, hypertension, and other chronic conditions.' },
  { title: 'Appointment Coordination', desc: 'Comprehensive scheduling, preparation support, and follow-up coordination for all medical appointments.' },
  { title: 'Prescription Management', desc: 'Medication review support, refill coordination, and digital prescription management.' },
  { title: 'Mental Health Support', desc: 'Virtual counseling referrals and emotional wellness check-ins by trained coordinators.' },
]
export default function Telehealth() {
  return (
    <>
      <section className="relative min-h-[500px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.95) 0%, rgba(13,43,62,0.7) 60%, rgba(13,43,62,0.4) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Telehealth Support</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Telehealth & Virtual Care Services in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-lg mb-6">Connecting you to professional healthcare from the comfort of your home through secure, easy-to-use virtual platforms.</p>
          <Link href="/contact" className="btn-accent btn-lg">Book a Virtual Consultation</Link>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-display-sm mb-8">Telehealth Services</h2>
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
                <div className="text-4xl mb-3">💻</div>
                <h3 className="text-heading-xl mb-3">Healthcare at Your Fingertips</h3>
                <p className="text-body-sm text-neutral-500 mb-5">Our telehealth platform is designed for simplicity — no technical expertise required. Access professional care from any device, anytime.</p>
                <Link href="/contact" className="btn-primary btn-lg w-full text-center block">Book Virtual Consultation →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
