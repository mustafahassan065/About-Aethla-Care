import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home Wellness Services in Qatar | Aethla Care',
  description: 'Preventative health and wellness programs delivered at home across Qatar. Screening, nutritional counseling, lifestyle coaching, and chronic condition support.',
}

const services = [
  { title: 'Diabetes & Blood Sugar Monitoring', desc: 'Regular glucose checks and practical guidance on managing diet and lifestyle to control blood sugar levels.' },
  { title: 'Cholesterol & Cardiovascular Checks', desc: 'Routine screening and advice on reducing cardiovascular risk through manageable lifestyle changes.' },
  { title: 'Nutritional Counseling',            desc: 'Tailored dietary guidance based on health status, cultural preferences, and specific conditions.' },
  { title: 'Weight Management Programs',         desc: 'Structured, realistic support for reaching and maintaining a healthy weight — at home, at your pace.' },
  { title: 'Smoking Cessation Support',          desc: 'A supportive, evidence-informed programme for people who are ready to quit smoking.' },
  { title: 'Preventative Health Consultations',  desc: 'Routine wellness reviews that catch early warning signs and help people stay ahead of chronic conditions.' },
]

export default function HomeWellness() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Home Wellness</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Preventative Health Programs, Delivered at Home</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Structured wellness support that helps people stay healthier for longer — without leaving home.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="btn-accent btn-lg">Start a Wellness Plan</Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label mb-3">Preventative Care</div>
              <h2 className="text-display-sm mb-4">Keeping People Well Before They Become Unwell</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                Many of the conditions most common in Qatar — diabetes, hypertension, cardiovascular disease — are strongly influenced by lifestyle. Our wellness team works with clients at home to make meaningful, sustainable changes.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                Programs are built around the individual&apos;s current health status, medical history, and daily routine. Progress is monitored and shared with the client&apos;s doctor where appropriate.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {services.map((s) => (
                <div key={s.title} className="card p-5">
                  <h4 className="text-heading-sm text-primary-500 mb-1">{s.title}</h4>
                  <p className="text-body-sm text-neutral-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm mb-4">Start Looking After Your Health at Home</h2>
          <p className="text-body-lg text-neutral-500 mb-8">Speak with our team and we will put together a wellness plan that fits your schedule and health goals.</p>
          <Link href="/contact" className="btn-primary btn-lg">Book a Wellness Consultation</Link>
        </div>
      </section>
    </>
  )
}