import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Premium Home Healthcare & Wellness Services in Qatar',
  description:
    'Aethla Care delivers compassionate home healthcare in Qatar — elderly care, disability support, maternity & newborn care, telehealth, and preventative wellness services across Doha, Lusail, Al Wakrah & Al Rayyan.',
}

// ── Reusable sub-components ───────────────────────────────

function HeroBadge() {
  return (
    <div className="trust-pill inline-flex mb-6">
      <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow flex-shrink-0" />
      Qatar&apos;s Most Trusted Home Healthcare Provider
    </div>
  )
}

function HeroStats() {
  const stats = [
    { value: '2,400+', label: 'Families Served' },
    { value: '150+',   label: 'Licensed Caregivers' },
    { value: '24/7',   label: 'Support Available' },
    { value: '98%',    label: 'Satisfaction Rate' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-10 border-t border-white/15">
      {stats.map((s) => (
        <div key={s.label}>
          <span className="block text-4xl font-extrabold font-poppins text-white leading-none mb-1">{s.value}</span>
          <span className="block text-caption text-white/60">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function TrustBar() {
  const items = [
    { icon: '🏅', title: 'Licensed Professionals', sub: 'MoH certified caregivers' },
    { icon: '🕐', title: '24/7 Support',           sub: 'Always available for you' },
    { icon: '🌍', title: 'Multilingual Teams',     sub: 'Arabic, English & more' },
    { icon: '📋', title: 'Personalized Plans',     sub: 'Tailored to every family' },
    { icon: '🔒', title: 'Secure Monitoring',      sub: 'Real-time digital care tracking' },
  ]
  return (
    <div style={{ background: '#134F66' }} className="py-5 px-4 md:px-8">
      <div className="container-max">
        <div className="flex flex-wrap justify-between gap-4">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3 flex-1 min-w-[140px]">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}>
                {item.icon}
              </div>
              <div>
                <strong className="block text-body-sm font-semibold font-poppins text-white">{item.title}</strong>
                <span className="text-caption text-white/55">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const services = [
  {
    href: '/services/elderly-care',
    icon: '👴', tag: 'Most Popular',
    title: 'Elderly Care',
    desc: 'Professional in-home support promoting independence, dignity, and quality of life for seniors.',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/maternity-care',
    icon: '🤱', tag: null,
    title: 'Maternity Care',
    desc: 'Postnatal recovery support, mother wellness monitoring, and lactation guidance at home.',
    img: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/newborn-care',
    icon: '👶', tag: null,
    title: 'Newborn Baby Care',
    desc: 'Expert newborn care, feeding support, and parent education from certified baby nurses.',
    img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/disability-support',
    icon: '♿', tag: null,
    title: 'Disability Support',
    desc: 'Compassionate daily support, personal care, and community participation assistance.',
    img: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/home-wellness',
    icon: '🌿', tag: null,
    title: 'Home Wellness',
    desc: 'Preventative health, diabetes screening, nutritional counseling, and lifestyle programs.',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/telehealth',
    icon: '💻', tag: null,
    title: 'Telehealth Support',
    desc: 'Virtual consultations, remote chronic care support, and appointment coordination.',
    img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/patient-navigation',
    icon: '🧭', tag: null,
    title: 'Patient Navigation',
    desc: 'Insurance guidance, healthcare navigation, and medical information interpretation.',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop',
  },
]

const processSteps = [
  { n: 1, title: 'Initial Consultation', desc: 'Free call with a care advisor to understand your needs and goals.' },
  { n: 2, title: 'Care Assessment', desc: 'Personalized home visit and detailed care evaluation.' },
  { n: 3, title: 'Caregiver Matching', desc: 'AI-powered matching with your ideal care professional.' },
  { n: 4, title: 'Care Activation', desc: 'Your personalized care plan begins immediately.' },
  { n: 5, title: 'Ongoing Updates', desc: 'Continuous monitoring, family updates & plan adjustments.' },
]

const testimonials = [
  {
    initials: 'FM', name: 'Fatima Al-Mansouri', location: 'Doha · Elderly Care',
    text: 'Aethla Care provided exceptional support for my mother after her hip surgery. The caregivers were compassionate, professional, and incredibly reliable. We could not imagine going through recovery without them.',
  },
  {
    initials: 'KA', name: 'Khalid & Aisha Al-Rashid', location: 'Lusail · Newborn Care',
    text: 'As first-time parents we were overwhelmed. The newborn care specialist from Aethla was a lifesaver — patient, knowledgeable, and so caring with our baby. We felt supported every single step of the way.',
  },
  {
    initials: 'SQ', name: 'Sara Al-Qahtani', location: 'Al Rayyan · Elderly Care',
    text: "The family portal is brilliant — I can see my father's schedule, read daily notes, and message the caregiver from my phone. The transparency gave me complete peace of mind even while I was working abroad.",
  },
]

const faqs = [
  {
    q: 'What home healthcare services does Aethla Care provide in Qatar?',
    a: 'Aethla Care provides elderly care, disability support, maternity care, newborn care, telehealth coordination, patient navigation, and preventative wellness services across Qatar including Doha, Lusail, Al Wakrah, and Al Rayyan.',
  },
  {
    q: 'Do you provide live-in caregivers in Doha?',
    a: 'Yes, Aethla Care offers both live-in and scheduled caregiver support. We tailor the arrangement to your family\'s specific needs and preferences.',
  },
  {
    q: 'Is your care team multilingual?',
    a: 'Yes — our caregivers and coordinators support Arabic, English, Tagalog, Hindi, Urdu, and more to serve Qatar\'s diverse community.',
  },
  {
    q: 'Are your caregivers licensed and verified?',
    a: 'Absolutely. All professionals undergo Qatar Ministry of Health verification, thorough background checks, and continuous training before placement.',
  },
  {
    q: 'How does the family portal work?',
    a: 'Our secure portal lets you view care schedules, read daily care notes, receive caregiver updates, access billing, and communicate directly with your care team — from any device.',
  },
  {
    q: 'How quickly can care services begin?',
    a: 'Following consultation and assessment, services typically begin within 24–48 hours. For urgent needs we offer expedited placement.',
  },
]

// ── Page ──────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-76px)] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
            mixBlendMode: 'luminosity',
          }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="container-max px-4 md:px-8 relative z-10 py-16">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div>
              <HeroBadge />
              <h1 className="text-display-lg text-white mb-5 animate-fade-in-up">
                Compassionate Care.<br />
                <span className="gradient-text">Delivered at Home.</span>
              </h1>
              <p className="text-body-lg text-white/75 mb-8 max-w-lg leading-relaxed animate-fade-in-up animation-delay-100">
                Aethla Care delivers premium, personalized home healthcare — elderly support, disability assistance, maternity &amp; newborn care, and wellness — across Qatar with a technology-driven approach.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-200">
                <Link href="/contact" className="btn-accent btn-lg">
                  📋 Book a Free Consultation
                </Link>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost btn-lg"
                >
                  💬 Speak to a Care Advisor
                </a>
              </div>
              <HeroStats />
            </div>

            {/* Right — visual card */}
            <div className="hidden lg:block relative animate-fade-in animation-delay-300">
              <div className="glass-card overflow-hidden">
                <div
                  className="h-[320px] w-full"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['✓ Licensed Professionals', '✓ Multilingual Teams', '✓ Personalized Plans'].map((b) => (
                      <span key={b} className="trust-pill text-xs">{b}</span>
                    ))}
                  </div>
                  <p className="text-body-sm font-semibold font-poppins text-white mb-1">Comprehensive Home Healthcare</p>
                  <p className="text-caption text-white/60">From elderly care to newborn support — every stage of life</p>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-6 -right-5 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 animate-float" style={{ boxShadow: '0 12px 40px rgba(27,107,138,0.18)' }}>
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-lg">⭐</div>
                <div>
                  <strong className="block text-body-sm font-bold font-poppins text-neutral-800">4.9/5 Rating</strong>
                  <span className="text-caption text-neutral-400">From 847 families</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-7 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 animate-float animation-delay-200" style={{ boxShadow: '0 12px 40px rgba(27,107,138,0.18)' }}>
                <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-lg">🏥</div>
                <div>
                  <strong className="block text-body-sm font-bold font-poppins text-neutral-800">MoH Licensed</strong>
                  <span className="text-caption text-neutral-400">Qatar Ministry of Health</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <TrustBar />

      {/* ── SERVICES ── */}
      <section className="section-pad" id="services">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Our Services</div>
            <h2 className="text-display-sm mb-4">Care for Every Stage of Life</h2>
            <p className="text-body-lg text-neutral-500">
              From newborns to seniors, compassionate and professional home care tailored to every individual across Qatar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="card card-hover overflow-hidden group block"
              >
                <div className="relative h-44 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${s.img}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
                  {s.tag && (
                    <span className="absolute top-3 left-3 z-10 bg-white text-primary-500 text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                      {s.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-xl mb-3">{s.icon}</div>
                  <h3 className="text-heading-sm mb-1.5">{s.title}</h3>
                  <p className="text-body-sm text-neutral-500 mb-4 leading-relaxed">{s.desc}</p>
                  <span className="text-body-sm font-semibold text-primary-500 group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                    Learn More <span>→</span>
                  </span>
                </div>
              </Link>
            ))}

            {/* CTA card */}
            <div className="rounded-3xl border-2 border-accent-300 flex flex-col justify-center items-center text-center p-8" style={{ background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light))' }}>
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-heading-md text-primary-500 mb-2">Not sure which service?</h3>
              <p className="text-body-sm text-neutral-500 mb-5">Our care advisors will guide you to the perfect plan for your family.</p>
              <Link href="/contact" className="btn-primary btn-sm">Get Free Assessment</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ── */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <div className="relative">
              <div
                className="w-full h-[500px] rounded-4xl object-cover"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80&auto=format&fit=crop')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '1.75rem',
                  boxShadow: '0 20px 60px rgba(27,107,138,0.16)',
                }}
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 min-w-[180px]" style={{ boxShadow: '0 8px 32px rgba(27,107,138,0.14)' }}>
                <div className="flex gap-1 text-base mb-2">{'⭐⭐⭐⭐⭐'}</div>
                <div className="text-4xl font-extrabold font-poppins text-primary-500 leading-none">98%</div>
                <div className="text-caption text-neutral-400 mt-1">Family Satisfaction Rate</div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-5" style={{ boxShadow: '0 8px 32px rgba(27,107,138,0.14)' }}>
                <div className="text-4xl font-extrabold font-poppins text-accent-500 leading-none">8+</div>
                <div className="text-caption text-neutral-400 mt-1">Years Serving Qatar</div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="section-label mb-3">Why Aethla Care</div>
              <h2 className="text-display-sm mb-4">Redefining Home Healthcare in Qatar</h2>
              <p className="text-body-lg text-neutral-500 mb-8">
                We combine the warmth of human compassion with the precision of modern technology to deliver care that truly makes a difference.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: '🤖', title: 'AI-Powered Caregiver Matching', desc: 'Intelligent matching based on language, cultural compatibility, skills, and availability.' },
                  { icon: '📱', title: 'Real-Time Family Portal', desc: 'Schedules, care notes, caregiver updates, and billing — all in one secure platform.' },
                  { icon: '🌐', title: 'Multilingual Care Teams', desc: 'Arabic, English, Tagalog, Hindi, Urdu and more — every family feels at home.' },
                  { icon: '✅', title: 'Licensed & Verified Professionals', desc: 'MoH verification, background checks, and continuous professional training.' },
                ].map((f) => (
                  <div key={f.title} className="card card-hover flex gap-4 p-5 items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl flex-shrink-0">{f.icon}</div>
                    <div>
                      <h4 className="text-heading-sm mb-1">{f.title}</h4>
                      <p className="text-body-sm text-neutral-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">How It Works</div>
            <h2 className="text-display-sm mb-4">Your Care Journey in 5 Simple Steps</h2>
            <p className="text-body-lg text-neutral-500">From your first call to ongoing care, we&apos;re with you every step of the way.</p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
            {/* connector line */}
            <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5" style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />
            {processSteps.map((step) => (
              <div key={step.n} className="text-center relative z-10">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold font-poppins text-white mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)', boxShadow: '0 4px 16px rgba(27,107,138,0.35)' }}
                >
                  {step.n}
                </div>
                <h4 className="text-heading-sm mb-1.5">{step.title}</h4>
                <p className="text-body-sm text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">Testimonials</div>
            <h2 className="text-display-sm mb-4">Trusted by Families Across Qatar</h2>
            <p className="text-body-lg text-neutral-500">Real stories from real families who found peace of mind with Aethla Care.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card card-hover p-7">
                <div className="flex gap-1 text-lg mb-4">⭐⭐⭐⭐⭐</div>
                <blockquote className="text-body-sm text-neutral-600 italic leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-body-sm font-bold font-poppins text-primary-500">
                    {t.initials}
                  </div>
                  <div>
                    <strong className="block text-body-sm font-bold font-poppins text-neutral-800">{t.name}</strong>
                    <span className="text-caption text-neutral-400">{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY ── */}
      <section className="section-pad bg-section-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="container-max relative z-10">
          <div className="section-header">
            <div className="section-label justify-center mb-3" style={{ color: '#5DD6B8' }}>Our Technology</div>
            <h2 className="text-display-sm text-white mb-4">Technology-Driven Home Healthcare</h2>
            <p className="text-body-lg text-white/65">Our integrated platform ensures every aspect of care is transparent, trackable, and seamlessly coordinated.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '📍', title: 'Real-Time Care Tracking', desc: 'GPS-verified check-ins and live schedule updates so families always know what\'s happening.' },
              { icon: '🔐', title: 'Secure Family Portal', desc: 'Encrypted, role-based access to care notes, schedules, billing, and direct messaging.' },
              { icon: '🤖', title: 'AI Caregiver Matching', desc: 'Smart algorithms matching clients with caregivers based on language, skills, and compatibility.' },
              { icon: '📝', title: 'Digital Care Notes', desc: 'Mobile documentation with photo uploads, voice-to-text, and instant family sharing.' },
              { icon: '📅', title: 'Smart Scheduling', desc: 'Automated rostering, shift management, and real-time alerts for seamless coordination.' },
              { icon: '💬', title: 'Secure Communications', desc: 'HIPAA-inspired encrypted messaging between families, caregivers, and coordinators.' },
            ].map((t) => (
              <div key={t.title} className="glass-card p-6 hover:bg-white/15 transition-all cursor-default group">
                <div className="text-4xl mb-4">{t.icon}</div>
                <h3 className="text-heading-md text-white mb-2">{t.title}</h3>
                <p className="text-body-sm text-white/60 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/technology" className="btn-white btn-lg">
              Explore Our Technology →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div
            className="relative overflow-hidden rounded-4xl p-12 md:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)', boxShadow: '0 30px 80px rgba(27,107,138,0.25)' }}
          >
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/6" />
            <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-white/4" />
            <div className="relative z-10">
              <h2 className="text-display-md text-white mb-4">Start Your Care Journey Today</h2>
              <p className="text-body-lg text-white/80 max-w-xl mx-auto mb-8">
                Book a free consultation and let our expert care advisors design the perfect care plan for your family. No obligation, no pressure.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact" className="btn-white btn-lg">📋 Book Free Consultation</Link>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-lg">
                  💬 WhatsApp Us Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-pad" style={{ background: 'var(--color-bg-soft)' }} id="faq">
        <div className="container-max">
          <div className="section-header">
            <div className="section-label justify-center mb-3">FAQ</div>
            <h2 className="text-display-sm mb-4">Frequently Asked Questions</h2>
            <p className="text-body-lg text-neutral-500">Everything you need to know about Aethla Care&apos;s services in Qatar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {faqs.map((f) => (
              <details key={f.q} className="card group">
                <summary className="flex justify-between items-center p-5 cursor-pointer font-semibold text-neutral-800 hover:text-primary-500 transition-colors list-none">
                  {f.q}
                  <span className="ml-4 flex-shrink-0 text-2xl text-primary-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-body-sm text-neutral-500 leading-relaxed border-t border-neutral-100 pt-4">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
