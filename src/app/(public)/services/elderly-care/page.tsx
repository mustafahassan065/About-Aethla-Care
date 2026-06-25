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
      <section className="relative min-h-[480px] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0">
          {/* HERO IMAGE 1 — Replace src with client image */}
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80&auto=format&fit=crop"
            alt="Elderly Care at Home Qatar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.5) 60%, transparent 100%)' }} />
        </div>
        <div className="container-max px-4 md:px-8 relative z-10">
          <div className="trust-pill inline-flex mb-4">
            <span className="w-2 h-2 rounded-full bg-accent-400" /> Elderly Care
          </div>
          <h1 className="text-display-lg text-white mb-3">Elderly Care at Home in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-2xl">
            Compassionate, professional in-home care for elderly family members — supporting independence, dignity, and wellbeing at every stage.
          </p>
        </div>
      </section>

      {/* About the Service */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-3">About This Service</div>
              <h2 className="text-display-sm mb-5">Professional Elderly Home Care</h2>
              <p className="text-body-md text-neutral-600 leading-relaxed mb-4">
                Aethla Care provides qualified caregivers who support elderly clients with the activities of daily living — from personal hygiene and meal preparation to medication reminders, mobility support, and meaningful companionship.
              </p>
              <p className="text-body-md text-neutral-600 leading-relaxed mb-8">
                Our care is delivered in the comfort and familiarity of your family member&apos;s own home, maintaining their independence and quality of life while giving families complete peace of mind.
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

            {/* IMAGE 2 — Replace src with client image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl h-[460px]">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop"
                  alt="Elderly care caregiver with patient"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 card p-5 max-w-[200px] shadow-lg">
                <p className="text-2xl font-extrabold font-poppins text-primary-500 mb-0.5">24/7</p>
                <p className="text-caption text-neutral-500">Care coordinator support available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE 3 — Full width section with client image */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&q=80&auto=format&fit=crop"
          alt="Elderly care home environment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(13,43,62,0.65)' }}>
          <div className="text-center px-4">
            <p className="text-display-sm text-white mb-4">
              &ldquo;Our caregivers become part of the family.&rdquo;
            </p>
            <p className="text-body-lg text-white/70">Aethla Care — Qatar&apos;s trusted home healthcare provider</p>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Who We Help</div>
            <h2 className="text-display-sm mb-4">Who This Service Is For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {[
              { title: 'Elderly Living Alone',         desc: 'Regular visits and check-ins for elderly individuals living independently who need support and companionship.' },
              { title: 'Post-Hospital Recovery',       desc: 'Transitional care at home following hospital discharge, supporting safe and complete recovery.' },
              { title: 'Chronic Condition Management', desc: 'Ongoing daily support for elderly clients managing long-term conditions such as diabetes, dementia, or cardiovascular disease.' },
              { title: 'Mobility Challenges',          desc: 'Support for elderly individuals with limited mobility — assisting with movement, transfers, and fall prevention.' },
              { title: 'Family Respite',               desc: 'Relief for family members who are primary caregivers, allowing them time to rest while loved ones are well cared for.' },
              { title: 'Dementia & Memory Care',       desc: 'Specialist support for elderly clients living with dementia — maintaining routine, safety, and dignity.' },
            ].map(f => (
              <div key={f.title} className="card p-6">
                <h3 className="text-heading-sm font-poppins text-primary-500 mb-2">{f.title}</h3>
                <p className="text-body-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
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