import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home Healthcare Services Areas in Qatar | Aethla Care',
  description: 'Aethla Care provides professional home healthcare services across Doha, Lusail, Al Wakrah, Al Rayyan, and all major areas of Qatar.',
  keywords: 'home healthcare Qatar, elderly care Doha, home nursing Lusail, caregiver Al Rayyan, home care Al Wakrah Qatar',
}

const areas = [
  {
    name: 'Doha',
    districts: ['West Bay', 'The Pearl', 'Al Waab', 'Al Sadd', 'Bin Mahmoud', 'Al Mansoura', 'Fereej Bin Dirham', 'Al Dafna', 'Al Hilal', 'Najma'],
    desc: 'Our primary service area. Full coverage across all districts of Doha with same-day caregiver availability.',
    available: true,
    highlight: true,
  },
  {
    name: 'Lusail',
    districts: ['Fox Hills', 'Al Erkyah', 'Marina District', 'Lusail City Centre', 'Al Khaleej', 'Rawdhat Lusail'],
    desc: 'Complete coverage across all Lusail districts including the new residential and commercial zones.',
    available: true,
    highlight: true,
  },
  {
    name: 'Al Wakrah',
    districts: ['Al Wakrah City', 'Al Wukair', 'Mesaieed Road', 'Old Al Wakrah'],
    desc: 'Professional home healthcare services available throughout Al Wakrah and surrounding communities.',
    available: true,
    highlight: false,
  },
  {
    name: 'Al Rayyan',
    districts: ['Al Rayyan', 'Muaither', 'Rawdat Al Hamama', 'Abu Hamour', 'Al Gharrafa', 'Muraikh'],
    desc: 'Serving families across Al Rayyan municipality with experienced multilingual caregivers.',
    available: true,
    highlight: false,
  },
  {
    name: 'Al Khor & Al Thakhira',
    districts: ['Al Khor City', 'Al Thakhira', 'Al Khor Industrial'],
    desc: 'Regular caregiver visits available with advance scheduling. Contact us to confirm availability.',
    available: true,
    highlight: false,
  },
  {
    name: 'Dukhan',
    districts: ['Dukhan City', 'Dukhan Industrial Area'],
    desc: 'Service available for Dukhan residents. Contact us for scheduling and caregiver availability.',
    available: true,
    highlight: false,
  },
  {
    name: 'Al Shamal',
    districts: ['Al Shamal', 'Madinat Al Shamal', 'Fraiha'],
    desc: 'Available with advance scheduling. Our team will confirm caregiver availability for your area.',
    available: true,
    highlight: false,
  },
  {
    name: 'Umm Salal',
    districts: ['Umm Salal Ali', 'Umm Salal Mohammed', 'Izghawa'],
    desc: 'Serving the Umm Salal communities with professional care services.',
    available: true,
    highlight: false,
  },
]

const services = [
  'Elderly Care',
  'Disability Support',
  'Newborn Baby Care',
  'Maternity Care',
  'Home Wellness',
  'Telehealth Support',
  'Patient Navigation',
  'Lifestyle & Preventative Wellness',
]

export default function AreasPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-section-gradient py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="trust-pill inline-flex mb-5 justify-center">
            <span className="w-2 h-2 rounded-full bg-accent-400" /> Service Coverage
          </div>
          <h1 className="text-display-lg text-white mb-4">
            Home Healthcare Services Across Qatar
          </h1>
          <p className="text-body-lg text-white/75 max-w-2xl mx-auto">
            Aethla Care provides professional home healthcare to families across Doha, Lusail, Al Wakrah, Al Rayyan, and all major areas of Qatar. Our caregivers come to you.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link href="/contact" className="btn-white btn-lg">Check Availability in Your Area</Link>
            <a href="https://wa.me/97440000000" target="_blank" rel="noopener noreferrer"
              className="btn-outline-white btn-lg">WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* Coverage Map Info */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Coverage Areas</div>
            <h2 className="text-display-sm mb-4">Areas We Serve</h2>
            <p className="text-body-lg text-neutral-500 max-w-2xl mx-auto">
              We currently serve families across Qatar. If your area is not listed, contact us — we will do our best to accommodate your location.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {areas.map(area => (
              <div key={area.name}
                className={`card card-hover p-6 ${area.highlight ? 'border-primary-200' : ''}`}
                style={area.highlight ? { borderColor: '#1B6B8A', borderWidth: '1.5px' } : {}}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-heading-lg font-poppins text-neutral-800">{area.name}</h3>
                  {area.highlight && (
                    <span className="badge-primary text-xs flex-shrink-0 ml-2">Primary Area</span>
                  )}
                </div>
                <p className="text-body-sm text-neutral-500 mb-4 leading-relaxed">{area.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {area.districts.map(d => (
                    <span key={d} className="px-2 py-0.5 rounded-full text-caption font-medium bg-neutral-100 text-neutral-600">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Not in list */}
          <div className="card p-8 mt-8 text-center" style={{ borderLeft: '4px solid #2DA88A' }}>
            <h3 className="text-heading-lg font-poppins text-neutral-800 mb-2">Not Sure If We Cover Your Area?</h3>
            <p className="text-body-md text-neutral-500 mb-5">
              Contact us with your location. We regularly expand our coverage and will let you know if we can reach you.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="btn-primary btn-sm">Contact Us</Link>
              <a href="tel:+97440000000" className="btn-outline btn-sm">+974 4000 0000</a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Available */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">What We Offer</div>
            <h2 className="text-display-sm mb-4">Services Available in All Areas</h2>
            <p className="text-body-lg text-neutral-500 max-w-xl mx-auto">
              All of our home healthcare services are available across our coverage areas in Qatar.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
            {services.map(s => (
              <div key={s} className="card p-4 text-center card-hover">
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(27,107,138,0.1), rgba(45,168,138,0.1))' }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }} />
                </div>
                <p className="text-body-sm font-semibold text-neutral-700">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-pad bg-white">
        <div className="container-max max-w-3xl">
          <div className="section-header">
            <div className="section-label justify-center mb-3">How It Works</div>
            <h2 className="text-display-sm mb-4">Getting Care at Home in Qatar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
            {[
              { step: '1', title: 'Contact Us',        desc: 'Call, WhatsApp, or fill in the consultation form. Tell us your area and what care you need.' },
              { step: '2', title: 'We Match a Carer',  desc: 'We match a qualified caregiver based on your location, language preference, and care needs.' },
              { step: '3', title: 'Care Begins at Home', desc: 'Your caregiver visits at the agreed time. All visits are tracked and documented digitally.' },
            ].map(s => (
              <div key={s.step} className="card p-6 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-extrabold font-poppins mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>
                  {s.step}
                </div>
                <h3 className="text-heading-sm font-poppins mb-2">{s.title}</h3>
                <p className="text-body-sm text-neutral-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact" className="btn-primary btn-lg">Book a Free Consultation</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-section-gradient text-center">
        <div className="container-max max-w-2xl">
          <h2 className="text-display-sm text-white mb-4">Ready to Start Care at Home?</h2>
          <p className="text-body-lg text-white/75 mb-8">
            Our care coordinators are available to discuss your needs and confirm availability in your area.
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