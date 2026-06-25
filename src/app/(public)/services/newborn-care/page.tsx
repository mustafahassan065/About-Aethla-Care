import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Newborn Baby Care Qatar | Aethla Care',
  description: 'Professional newborn baby care services at home in Qatar — compassionate, qualified care tailored to your family needs.',
}

export default function ServicePage() {
  const features = ['Certified baby nurse support', 'Newborn health monitoring', 'Infant feeding and breastfeeding support', 'Bath and hygiene routines', 'Sleep schedule guidance', 'Postpartum education for parents', '24/7 coordinator availability', 'Family portal with visit updates']
  const whoItems = [{'title': 'New Parents', 'desc': 'Practical guidance and hands-on support for first-time parents caring for a newborn at home.'}, {'title': 'Premature Babies', 'desc': 'Specialist monitoring and care for premature newborns transitioning home from hospital.'}, {'title': 'Breastfeeding Support', 'desc': 'Expert help establishing feeding routines and overcoming common breastfeeding challenges.'}, {'title': 'Sleep Routine Support', 'desc': 'Professional guidance to establish healthy sleep patterns for your newborn.'}, {'title': 'Hygiene and Bathing', 'desc': 'Safe bathing, cord care, and hygiene routines guided by our certified baby nurses.'}, {'title': 'Twins and Multiples', 'desc': 'Additional support for families managing the demands of twins or multiple newborns.'}]

  return (
    <>
      {/* Hero */}
      <section className="bg-section-gradient py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="trust-pill inline-flex mb-5 justify-center">
            <span className="w-2 h-2 rounded-full bg-accent-400" /> Newborn Baby Care
          </div>
          <h1 className="text-display-lg text-white mb-4">Newborn Baby Care in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-2xl mx-auto">
            Professional newborn baby care services delivered at home across Qatar — compassionate, qualified care tailored to each family.
          </p>
        </div>
      </section>

      {/* Image 1 — Left image, right text */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="h-[420px] rounded-3xl overflow-hidden shadow-lg">
              <img
                src="/images/Newborn Baby Care/Baby Hygiene.png"
                alt="Newborn Baby Care Qatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="section-label mb-3">About This Service</div>
              <h2 className="text-display-sm mb-5">Professional Newborn Baby Care</h2>
              <p className="text-body-md text-neutral-600 leading-relaxed mb-4">
                Aethla Care provides qualified professionals who deliver expert newborn baby care directly in the comfort of your home.
                Every care plan is tailored to the individual&apos;s needs, preferences, and health requirements.
              </p>
              <p className="text-body-md text-neutral-600 leading-relaxed mb-8">
                Our caregivers are Ministry of Health verified, background checked, and trained to deliver the highest standard of home healthcare across Qatar.
              </p>
              <ul className="flex flex-col gap-3">
                {features.map(f => (
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
                {whoItems.map((f: any) => (
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
                src="/images/Newborn Baby Care/New Parent Education.png"
                alt="Newborn Baby Care at home Qatar"
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
                src="/images/Newborn Baby Care/Sleep Routines.png"
                alt="Newborn Baby Care Aethla Care Qatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="section-label mb-3">Why Aethla Care</div>
              <h2 className="text-display-sm mb-5">Why Choose Aethla Care</h2>
              <div className="flex flex-col gap-4">
                {[
                  { title: 'Licensed Professionals',   desc: 'Every caregiver is Ministry of Health verified, background checked, and regularly trained.' },
                  { title: 'Personalised Care Plans',  desc: 'Every care arrangement is tailored to the individual — no generic packages.' },
                  { title: 'Multilingual Team',        desc: 'We match caregivers by language and cultural background for a comfortable experience.' },
                  { title: 'Family Portal Access',     desc: 'Family members can monitor visits, read care notes, and communicate with the care team online.' },
                  { title: 'Flexible Scheduling',      desc: 'Choose from daily visits, live-in care, overnight support, or part-time arrangements.' },
                  { title: '24/7 Coordinator Support', desc: 'Our care coordinators are available around the clock for questions and urgent situations.' },
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
          <h2 className="text-display-sm text-white mb-4">Arrange Newborn Baby Care at Home</h2>
          <p className="text-body-lg text-white/75 mb-8">
            Contact our team today for a free consultation and care plan tailored to your family.
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