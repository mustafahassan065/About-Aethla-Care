import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Elderly Care at Home Qatar | Aethla Care',
  description: 'Professional elderly home care services in Qatar — daily living support, medication management, companionship, mobility assistance, and 24/7 monitoring.',
}

export default function ElderlyCare() {
  return (
    <>
      {/* Hero */}
      <section className="bg-section-gradient py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="trust-pill inline-flex mb-5 justify-center">
            <span className="w-2 h-2 rounded-full bg-accent-400" /> Elderly Care
          </div>
          <h1 className="text-display-lg text-white mb-4">Elderly Care at Home in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-2xl mx-auto">
            Compassionate, professional in-home care for elderly family members — supporting independence, dignity, and wellbeing at every stage.
          </p>
        </div>
      </section>

      {/* Image 1 — Left image, right text */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="h-[420px] rounded-3xl overflow-hidden shadow-lg">
              <img
                src="/images/Elderly Care/Medication Reminders.png"
                alt="Elderly Care Qatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="section-label mb-3">About This Service</div>
              <h2 className="text-display-sm mb-5">Professional Elderly Home Care</h2>
              <p className="text-body-md text-neutral-600 leading-relaxed mb-4">
                Aethla Care provides qualified caregivers who support elderly clients with the activities of daily living — from personal hygiene and meal preparation to medication reminders, mobility support, and meaningful companionship.
              </p>
              <p className="text-body-md text-neutral-600 leading-relaxed mb-8">
                Our care is delivered in the comfort of your family member&apos;s own home, maintaining their independence and quality of life while giving families complete peace of mind.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  'Personal hygiene and grooming assistance',
                  'Medication reminders and management support',
                  'Meal planning and preparation',
                  'Mobility and transfer support',
                  'Companionship and social engagement',
                  'Post-hospital recovery care',
                  'Overnight and live-in care options',
                  'Family portal with real-time visit updates',
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-body-sm text-neutral-700">
                    <div className="w-5 h-5 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Image 2 — Right image, left text */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-3">Who We Help</div>
              <h2 className="text-display-sm mb-5">Who This Service Is For</h2>
              <div className="flex flex-col gap-4">
                {[
                  { title: 'Elderly Living Alone',         desc: 'Regular visits for elderly individuals who need support and companionship.' },
                  { title: 'Post-Hospital Recovery',       desc: 'Transitional care following hospital discharge for safe recovery at home.' },
                  { title: 'Chronic Condition Management', desc: 'Ongoing daily support for managing long-term conditions such as diabetes or dementia.' },
                  { title: 'Mobility Challenges',          desc: 'Support for individuals with limited mobility — movement, transfers, and fall prevention.' },
                  { title: 'Family Respite',               desc: 'Relief for family members who are primary caregivers, allowing them time to rest.' },
                  { title: 'Dementia & Memory Care',       desc: 'Specialist support for clients living with dementia — maintaining routine and safety.' },
                ].map(f => (
                  <div key={f.title} className="card p-4 flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-accent-400 flex-shrink-0 mt-2" />
                    <div>
                      <h4 className="text-body-sm font-bold font-poppins text-neutral-800 mb-0.5">{f.title}</h4>
                      <p className="text-body-sm text-neutral-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[520px] rounded-3xl overflow-hidden shadow-lg">
              <img
                src="/images/Elderly Care/Mobility Assistance.png"
                alt="Elderly care caregiver"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Image 3 — Left image, right text */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="h-[420px] rounded-3xl overflow-hidden shadow-lg">
              <img
                src="/images/Elderly Care/Overnight Care.png"
                alt="Overnight elderly care"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="section-label mb-3">Why Aethla Care</div>
              <h2 className="text-display-sm mb-5">Why Choose Aethla Care</h2>
              <div className="flex flex-col gap-4">
                {[
                  { title: 'Licensed Care Professionals',  desc: 'All caregivers are Ministry of Health verified and background checked.' },
                  { title: 'Personalised Care Plans',      desc: 'Every arrangement is tailored to the individual — no generic packages.' },
                  { title: 'Multilingual Team',            desc: 'We match caregivers by language for a comfortable experience.' },
                  { title: 'Family Portal Access',         desc: 'Family members can monitor visits, care notes, and billing online.' },
                  { title: 'Flexible Scheduling',          desc: 'Daily visits, live-in care, overnight support, or part-time arrangements.' },
                  { title: '24/7 Coordinator Support',     desc: 'Our coordinators are available around the clock for any questions.' },
                ].map(f => (
                  <div key={f.title} className="card p-4 flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-accent-400 flex-shrink-0 mt-2" />
                    <div>
                      <h4 className="text-body-sm font-bold font-poppins text-neutral-800 mb-0.5">{f.title}</h4>
                      <p className="text-body-sm text-neutral-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-section-gradient text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm text-white mb-4">Arrange Elderly Care at Home</h2>
          <p className="text-body-lg text-white/75 mb-8">
            Contact our team for a free home assessment and care plan tailored to your family member&apos;s needs.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="btn-white btn-lg">Book a Free Consultation</Link>
            <a href="tel:+97440000000" className="btn-outline-white btn-lg">+974 4000 0000</a>
          </div>
        </div>
      </section>
    </>
  )
}