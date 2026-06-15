import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home Wellness Services in Qatar | Aethla Care',
  description: 'Home wellness services across Qatar including preventative health programs, nutritional counseling, chronic condition support, and lifestyle coaching at home.',
  keywords: 'wellness services Doha, home wellness Qatar',
}

const services = [
  { title: 'Diabetes Screening',          desc: 'Regular glucose monitoring and dietary guidance to manage blood sugar levels and reduce complications.' },
  { title: 'Cholesterol Checks',          desc: 'Routine screening and lifestyle advice to reduce cardiovascular risk.' },
  { title: 'Nutritional Counseling',      desc: 'Tailored dietary guidance based on health status, cultural preferences, and specific conditions.' },
  { title: 'Weight Management',           desc: 'Realistic, structured support for achieving and maintaining a healthy weight at home.' },
  { title: 'Smoking Cessation Programs',  desc: 'Evidence-based support for individuals ready to quit smoking, with regular follow-up and structured guidance.' },
]

export default function HomeWellness() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Home Wellness Services</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Home Wellness Services</h1>
          <p className="text-body-lg text-white/75 max-w-xl">Preventative health and lifestyle wellness programs delivered at home — helping families in Qatar stay healthier for longer.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contact" className="btn-accent btn-lg">Book a Consultation</Link>
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label mb-3">Services Included</div>
              <h2 className="text-display-sm mb-5">Home Wellness Services</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed">Our wellness programs are built around the individual — their health status, lifestyle, and goals — with progress shared with their medical team where appropriate.</p>
              <Link href="/contact" className="btn-primary btn-lg mt-6 inline-block">Start a Wellness Plan</Link>
            </div>
            <div className="flex flex-col gap-4">
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
    </>
  )
}