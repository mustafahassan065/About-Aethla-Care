'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const services = [
  { href: '/services/elderly-care',       label: 'Elderly Care'                    },
  { href: '/services/disability-support', label: 'Disability Support'              },
  { href: '/services/newborn-care',       label: 'Newborn Baby Care'               },
  { href: '/services/maternity-care',     label: 'Maternity Care'                  },
  { href: '/services/home-wellness',      label: 'Home Wellness Services'          },
  { href: '/services/telehealth',         label: 'Telehealth Support'              },
  { href: '/services/patient-navigation', label: 'Patient Navigation'              },
  { href: '/services/lifestyle-wellness', label: 'Lifestyle & Preventative Wellness'},
]

const trustIndicators = [
  'Licensed Care Professionals',
  '24/7 Support',
  'Multilingual Care Teams',
  'Personalized Care Plans',
  'Secure Digital Care Monitoring',
]

const processSteps = [
  { n: 1, title: 'Initial Consultation',               desc: 'Speak with a care coordinator to discuss your needs and goals.' },
  { n: 2, title: 'Personalized Care Assessment',       desc: 'We visit your home to assess requirements and outline a tailored care plan.' },
  { n: 3, title: 'Caregiver Matching',                 desc: 'We match you with the right caregiver based on skills, language, and compatibility.' },
  { n: 4, title: 'Care Plan Activation',               desc: 'Your care begins — fully documented from day one through our digital platform.' },
  { n: 5, title: 'Ongoing Monitoring & Family Updates',desc: 'Regular reviews and family updates to ensure care continues to meet your needs.' },
]

const staticFaqs = [
  { q: 'What home healthcare services does Aethla Care provide in Qatar?', a: 'Aethla Care provides elderly care, disability support, maternity care, newborn care, telehealth coordination, and preventative wellness services across Qatar.' },
  { q: 'Do you provide live-in caregivers in Doha?',                       a: 'Yes, Aethla Care offers both live-in and scheduled caregiver support services.' },
  { q: 'Is your care team multilingual?',                                  a: "Yes, our caregivers and coordinators support multiple languages for Qatar's diverse community." },
  { q: 'How quickly can care begin after contacting Aethla Care?',         a: 'Most families can begin receiving care within 24 to 48 hours of their initial assessment. Urgent cases can be arranged sooner.' },
  { q: 'Are your caregivers licensed and background checked?',             a: 'Yes. Every caregiver is verified by the Qatar Ministry of Health, has passed a full background check, and receives ongoing training.' },
  { q: 'What is the family portal?',                                       a: 'The family portal gives family members secure online access to view schedules, read care notes, check billing, and communicate with the care team.' },
]

// Slideshow images for hero background — replace with client images as needed
const heroSlides = [
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1920&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1920&q=80&auto=format&fit=crop',
]

function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev]       = useState<number | null>(null)
  const [fading, setFading]   = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setPrev(current)
        setCurrent(c => (c + 1) % heroSlides.length)
        setFading(false)
      }, 800)
    }, 4500)
    return () => clearInterval(timer)
  }, [current])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Previous slide — stays visible during fade */}
      {prev !== null && (
        <div
          key={`prev-${prev}`}
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${heroSlides[prev]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
            mixBlendMode: 'luminosity',
          }}
        />
      )}
      {/* Current slide */}
      <div
        key={`curr-${current}`}
        className="absolute inset-0 transition-opacity"
        style={{
          backgroundImage: `url('${heroSlides[current]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: fading ? 0 : 0.18,
          mixBlendMode: 'luminosity',
          transitionDuration: '800ms',
          transitionTimingFunction: 'ease-in-out',
        }}
      />
      {/* Slide indicators */}
      <div className="absolute bottom-6 right-8 flex gap-2 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPrev(current); setCurrent(i) }}
            className="transition-all duration-300"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function FAQSection() {
  const [faqs, setFaqs] = useState(staticFaqs)
  const [open, setOpen]  = useState<number | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq/public`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data.map((f: any) => ({ q: f.question, a: f.answer })))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }} id="faq">
      <div className="container-max max-w-4xl">
        <div className="section-header">
          <div className="section-label justify-center mb-3">FAQ</div>
          <h2 className="text-display-sm mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f, i) => (
            <div key={i} className="card group">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex justify-between items-center w-full p-5 cursor-pointer font-semibold text-neutral-800 hover:text-primary-500 transition-colors text-left"
              >
                <span>{f.q}</span>
                <span className={`ml-4 flex-shrink-0 text-2xl text-primary-400 transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-body-sm text-neutral-500 leading-relaxed border-t border-neutral-100 pt-4">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[calc(100vh-76px)] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />

        {/* Dynamic sliding background images */}
        <HeroSlideshow />

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="container-max px-4 md:px-8 relative z-10 py-16">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <h1 className="text-display-lg text-white mb-5">
                Premium Home Healthcare &amp; Wellness Services in Qatar
              </h1>
              <p className="text-body-lg text-white/75 mb-8 max-w-lg leading-relaxed">
                Aethla Care delivers compassionate, personalized home healthcare, elderly support, disability assistance, maternity care, and wellness services across Qatar.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-accent btn-lg">Book a Consultation</Link>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-lg">
                  Speak to a Care Advisor
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="glass-card overflow-hidden">
                <div className="h-full w-full" style={{
                  backgroundImage: "url('/images/aethladoctor.jpeg')",
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }} />
                <div className="p-5">
                  <p className="text-body-sm font-semibold font-poppins text-white mb-1">Trusted by Families Across Qatar</p>
                  <p className="text-caption text-white/60">Professional home healthcare at every stage of life</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section style={{ background: '#134F66' }} className="py-8 px-4 md:px-8">
        <div className="container-max">
          <p className="text-white/70 text-body-sm text-center mb-6 max-w-2xl mx-auto">
            Trusted by families across Qatar for reliable, compassionate, and professional care services tailored to every stage of life.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {trustIndicators.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-400 flex-shrink-0" />
                <span className="text-white text-body-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section-pad bg-white" id="services">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Our Services</div>
            <h2 className="text-display-sm mb-4">Home Healthcare Services</h2>
            <p className="text-body-lg text-neutral-500 max-w-2xl mx-auto">
              Professional care services delivered at home across Qatar — from newborn care to elderly support.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {services.map((s) => (
              <Link key={s.href} href={s.href} className="card card-hover p-6 group">
                <h3 className="text-heading-md text-neutral-800 mb-2 group-hover:text-primary-500 transition-colors">{s.label}</h3>
                <span className="text-body-sm text-primary-500 font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn More <span>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE AETHLA CARE */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="h-full rounded-4xl" style={{
              backgroundImage: "url('/images/aethladoctor2.jpeg')",
              backgroundSize: 'cover', backgroundPosition: 'center',
              boxShadow: '0 20px 60px rgba(27,107,138,0.16)',
            }} />
            <div>
              <div className="section-label mb-3">Why Choose Aethla Care</div>
              <h2 className="text-display-sm mb-5">Redefining Home Healthcare in Qatar</h2>
              <p className="text-body-md text-neutral-600 leading-relaxed mb-4">
                Aethla Care is redefining home healthcare in Qatar through technology-enabled, patient-centered care services designed for families seeking quality, dignity, safety, and convenience.
              </p>
              <p className="text-body-md text-neutral-600 leading-relaxed mb-8">
                Our integrated healthcare management system allows real-time care monitoring, secure family communication, digital care records, and transparent scheduling for complete peace of mind.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { title: 'Licensed Care Professionals',   desc: 'Every caregiver is Ministry of Health verified and background checked.'        },
                  { title: 'AI-Powered Caregiver Matching', desc: 'We match caregivers by language, skills, availability, and cultural fit.'      },
                  { title: 'Secure Family Portal',          desc: 'Real-time access to schedules, care notes, and billing from any device.'       },
                  { title: 'Multilingual Care Teams',       desc: 'Support in Arabic, English, Tagalog, Hindi, Urdu, and more.'                   },
                ].map((f) => (
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

      {/* PROCESS SECTION */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">How It Works</div>
            <h2 className="text-display-sm mb-4">Getting Started with Aethla Care</h2>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
            <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5" style={{ background: 'linear-gradient(90deg, #1B6B8A, #2DA88A)' }} />
            {processSteps.map((step) => (
              <div key={step.n} className="text-center relative z-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold font-poppins text-white mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)', boxShadow: '0 4px 16px rgba(27,107,138,0.35)' }}>
                  {step.n}
                </div>
                <h4 className="text-heading-sm mb-1.5">{step.title}</h4>
                <p className="text-body-sm text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Testimonials</div>
            <h2 className="text-display-sm mb-4">What Families Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: 'Aethla Care provided exceptional support for my mother after surgery. The caregivers were compassionate, professional, and reliable.', name: 'Fatima Al-Mansouri', location: 'Doha'      },
              { text: 'Our baby nurse was outstanding with our newborn. She guided us through every step and gave us real confidence as first-time parents.', name: 'Khalid Al-Rashid',   location: 'Lusail'    },
              { text: 'The family portal gives me peace of mind while I am abroad. I can see every visit, every care note, and every update in real time.',   name: 'Sara Al-Qahtani',   location: 'Al Rayyan' },
            ].map((t) => (
              <div key={t.name} className="card card-hover p-7">
                <p className="text-body-sm text-neutral-600 italic leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-body-sm font-bold font-poppins text-neutral-800">{t.name}</p>
                  <p className="text-caption text-neutral-400">{t.location}, Qatar</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="relative overflow-hidden rounded-4xl p-12 md:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)', boxShadow: '0 30px 80px rgba(27,107,138,0.25)' }}>
            <h2 className="text-display-md text-white mb-4">Start Your Care Journey Today</h2>
            <p className="text-body-lg text-white/80 max-w-xl mx-auto mb-8">
              Contact our care team for a free consultation and let us build the right care plan for your family.
            </p>
            <Link href="/contact" className="btn-white btn-lg">Book a Free Care Consultation</Link>
          </div>
        </div>
      </section>

      {/* FAQ — Dynamic from CMS, fallback to static */}
      <FAQSection />
    </>
  )
}