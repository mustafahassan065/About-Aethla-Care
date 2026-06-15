import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lifestyle & Preventative Wellness in Qatar | Aethla Care',
  description: 'Preventative health and lifestyle wellness programs delivered at home across Qatar. Diabetes screening, nutritional counseling, weight management, and more.',
  keywords: 'wellness services Doha, preventative health Qatar, lifestyle wellness Qatar, diabetes screening Doha',
}

const services = [
  { title: 'Diabetes Screening',       desc: 'Regular blood sugar monitoring and practical support for managing diet and lifestyle to control diabetes at home.' },
  { title: 'Cholesterol Checks',       desc: 'Routine cholesterol screening with guidance on reducing cardiovascular risk through sustainable lifestyle changes.' },
  { title: 'Nutritional Counseling',   desc: 'Tailored dietary guidance based on your health status, cultural food preferences, and specific medical conditions.' },
  { title: 'Weight Management',        desc: 'Structured, realistic support for reaching and maintaining a healthy weight — delivered at your pace, at home.' },
  { title: 'Smoking Cessation Programs', desc: 'Evidence-based support for people ready to quit smoking, with regular check-ins and a structured programme.' },
]

const faqs = [
  {
    q: 'What is the difference between home wellness and regular healthcare?',
    a: 'Home wellness focuses on prevention — helping you stay healthy and manage lifestyle risk factors before they become serious conditions. It complements your existing medical care rather than replacing it.',
  },
  {
    q: 'Who are these wellness programs suitable for?',
    a: 'Our programs are suitable for adults managing chronic conditions such as diabetes or hypertension, those at risk of cardiovascular disease, and anyone looking to improve their lifestyle and overall health.',
  },
  {
    q: 'Do you coordinate with my doctor?',
    a: 'Yes. With your consent, our wellness team shares progress and any concerns with your treating physician to ensure everything is aligned with your medical care plan.',
  },
]

export default function LifestyleWellness() {
  return (
    <>
      <section className="relative min-h-[460px] flex items-end pb-16">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80&auto=format&fit=crop')",
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.55) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4"><span className="w-2 h-2 rounded-full bg-accent-400" /> Lifestyle &amp; Preventative Wellness</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Lifestyle &amp; Preventative Wellness</h1>
          <p className="text-body-lg text-white/75 max-w-xl">
            Proactive health programs that help you manage risk factors and build healthier habits — all delivered at home across Qatar.
          </p>
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
              <h2 className="text-display-sm mb-5">Preventative &amp; Lifestyle Wellness</h2>
              <p className="text-body-md text-neutral-500 leading-relaxed mb-4">
                Many of the most common health conditions affecting Qatar&apos;s population — including diabetes, hypertension, and cardiovascular disease — are strongly linked to lifestyle. Our wellness programs are designed to help individuals make meaningful, sustainable changes before these conditions worsen.
              </p>
              <p className="text-body-md text-neutral-500 leading-relaxed">
                Every program is built around the individual&apos;s current health status, medical history, cultural background, and daily routine. Progress is documented and shared with your doctor where appropriate.
              </p>
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

      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max max-w-3xl">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Questions</div>
            <h2 className="text-display-sm mb-4">Frequently Asked</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((f) => (
              <details key={f.q} className="card group">
                <summary className="flex justify-between items-center p-5 cursor-pointer font-semibold text-neutral-800 hover:text-primary-500 transition-colors list-none">
                  {f.q}
                  <span className="ml-4 flex-shrink-0 text-2xl text-primary-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-body-sm text-neutral-500 leading-relaxed border-t border-neutral-100 pt-4">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm mb-4">Start Your Wellness Program Today</h2>
          <p className="text-body-lg text-neutral-500 mb-8">
            Speak with our team and we will design a wellness plan that fits your health goals and daily routine.
          </p>
          <Link href="/contact" className="btn-primary btn-lg">Book a Free Consultation</Link>
        </div>
      </section>
    </>
  )
}