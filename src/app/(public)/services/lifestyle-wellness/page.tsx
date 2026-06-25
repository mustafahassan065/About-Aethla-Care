import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lifestyle and Preventative Wellness Qatar | Aethla Care',
  description: 'Professional lifestyle and preventative wellness services at home in Qatar — compassionate, qualified care tailored to your family needs.',
}

export default function ServicePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[480px] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0">
          {/* IMAGE 1 — Hero image — Replace src with client-provided image */}
          <img
            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&q=80&auto=format&fit=crop"
            alt="Lifestyle and Preventative Wellness Qatar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,43,62,0.92) 0%, rgba(13,43,62,0.5) 60%, transparent 100%)' }} />
        </div>
        <div className="container-max px-4 md:px-8 relative z-10">
          <div className="trust-pill inline-flex mb-4">
            <span className="w-2 h-2 rounded-full bg-accent-400" /> Lifestyle and Preventative Wellness
          </div>
          <h1 className="text-display-lg text-white mb-3">Lifestyle and Preventative Wellness in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-2xl">
            Professional lifestyle and preventative wellness services delivered at home across Qatar — compassionate, qualified care tailored to each family.
          </p>
        </div>
      </section>

      {/* About + Image 2 */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-3">About This Service</div>
              <h2 className="text-display-sm mb-5">Professional Lifestyle and Preventative Wellness</h2>
              <p className="text-body-md text-neutral-600 leading-relaxed mb-4">
                Aethla Care provides qualified professionals who deliver expert lifestyle and preventative wellness directly in the comfort of your home.
                Every care plan is tailored to the individual&apos;s needs, preferences, and health requirements.
              </p>
              <p className="text-body-md text-neutral-600 leading-relaxed mb-8">
                Our caregivers are Ministry of Health verified, background checked, and trained to deliver the highest standard of home healthcare across Qatar.
              </p>
              <Link href="/contact" className="btn-primary btn-lg">Book a Free Consultation</Link>
            </div>

            {/* IMAGE 2 — Content section image — Replace src with client-provided image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl h-[460px]">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop"
                  alt="Lifestyle and Preventative Wellness at home"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 card p-5 max-w-[200px] shadow-lg">
                <p className="text-2xl font-extrabold font-poppins text-primary-500 mb-0.5">24/7</p>
                <p className="text-caption text-neutral-500">Care coordinator support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE 3 — Full width feature image — Replace src with client-provided image */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80&auto=format&fit=crop"
          alt="Lifestyle and Preventative Wellness Aethla Care Qatar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(13,43,62,0.65)' }}>
          <div className="text-center px-4 max-w-2xl">
            <p className="text-display-sm text-white mb-4">Compassionate care, delivered at home.</p>
            <p className="text-body-lg text-white/70">Aethla Care — Qatar&apos;s trusted home healthcare provider</p>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Why Aethla Care</div>
            <h2 className="text-display-sm mb-4">Why Choose Aethla Care for Lifestyle and Preventative Wellness</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {[
              { title: 'Qualified Professionals',  desc: 'All caregivers are Ministry of Health verified, background checked, and regularly trained.' },
              { title: 'Personalised Care Plans',  desc: 'Every care arrangement is tailored to the individual — no generic packages.' },
              { title: 'Multilingual Team',        desc: 'We match caregivers by language and cultural background for a comfortable experience.' },
              { title: 'Family Portal Access',     desc: 'Family members can monitor visits, read care notes, and communicate with the care team online.' },
              { title: 'Flexible Scheduling',      desc: 'Choose from daily visits, live-in care, overnight support, or part-time arrangements.' },
              { title: '24/7 Coordinator Support', desc: 'Our care coordinators are available around the clock for questions and urgent situations.' },
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
          <h2 className="text-display-sm text-white mb-4">Arrange Lifestyle and Preventative Wellness at Home</h2>
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