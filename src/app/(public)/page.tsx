import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home Healthcare & Family Wellness in Qatar | Aethla Care',
  description:
    'Aethla Care brings personalized, in-home medical and wellness support to families across Qatar — covering elderly care, disability assistance, maternity and newborn support, telehealth, and preventative health programs in Doha, Lusail, Al Wakrah and Al Rayyan.',
}

// ── Reusable sub-components ───────────────────────────────

function HeroBadge() {
  return (
    <div className="trust-pill inline-flex mb-6">
      <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow flex-shrink-0" />
      Trusted In-Home Care, Built for Qatari Families
    </div>
  )
}

function HeroStats() {
  const stats = [
    { value: '2,400+', label: 'Families Supported' },
    { value: '150+',   label: 'Verified Caregivers' },
    { value: '24/7',   label: 'On-Call Coordination' },
    { value: '98%',    label: 'Family Satisfaction' },
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
    { icon: '🏅', title: 'MoH-Verified Team',     sub: 'Every caregiver fully credentialed' },
    { icon: '🕐', title: 'Round-the-Clock Care',  sub: 'A coordinator is always reachable' },
    { icon: '🌍', title: 'Multilingual Staff',    sub: 'Care in Arabic, English & beyond' },
    { icon: '📋', title: 'Tailored Care Plans',   sub: 'Built around your family\'s needs' },
    { icon: '🔒', title: 'Transparent Tracking',  sub: 'Live updates through our portal' },
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
    icon: '👴', tag: 'Most Requested',
    title: 'Elderly Care',
    desc: 'Day-to-day support at home that helps seniors stay independent, comfortable, and safe.',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/maternity-care',
    icon: '🤱', tag: null,
    title: 'Maternity Care',
    desc: 'Hands-on recovery support for new mothers, with wellness checks and feeding guidance.',
    img: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/newborn-care',
    icon: '👶', tag: null,
    title: 'Newborn Baby Care',
    desc: 'Trained baby nurses who help with feeding routines, sleep schedules, and new-parent guidance.',
    img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/disability-support',
    icon: '♿', tag: null,
    title: 'Disability Support',
    desc: 'Patient, dignity-led assistance with daily routines, mobility, and getting out into the community.',
    img: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/home-wellness',
    icon: '🌿', tag: null,
    title: 'Home Wellness',
    desc: 'Routine health checks, nutrition guidance, and lifestyle coaching delivered at your doorstep.',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/telehealth',
    icon: '💻', tag: null,
    title: 'Telehealth Support',
    desc: 'Remote check-ins with care professionals plus help managing appointments and follow-ups.',
    img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&q=80&auto=format&fit=crop',
  },
  {
    href: '/services/patient-navigation',
    icon: '🧭', tag: null,
    title: 'Patient Navigation',
    desc: 'A guide through insurance paperwork, scheduling, and understanding your treatment options.',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop',
  },
]

const processSteps = [
  { n: 1, title: 'Tell Us What You Need',   desc: 'A short call with a care coordinator to understand your situation and goals.' },
  { n: 2, title: 'Home Care Assessment',    desc: 'We visit in person to evaluate needs and outline the right level of support.' },
  { n: 3, title: 'Caregiver Matching',      desc: 'We pair you with a caregiver based on language, skills, and personality fit.' },
  { n: 4, title: 'Care Begins',             desc: 'Your care plan starts, with everything documented from day one.' },
  { n: 5, title: 'Ongoing Check-ins',       desc: 'Regular reviews and family updates so the plan keeps working for you.' },
]

const testimonials = [
  {
    initials: 'FM', name: 'Fatima Al-Mansouri', location: 'Doha · Elderly Care',
    text: 'After my mother\'s hip surgery, the team stepped in within two days. Her caregiver was patient, attentive, and genuinely warm — recovery would have been so much harder without that support.',
  },
  {
    initials: 'KA', name: 'Khalid & Aisha Al-Rashid', location: 'Lusail · Newborn Care',
    text: 'We had no idea what we were doing as new parents. Our newborn specialist walked us through feeding and sleep routines calmly, and our baby took to her right away. It made those first weeks far less stressful.',
  },
  {
    initials: 'SQ', name: 'Sara Al-Qahtani', location: 'Al Rayyan · Elderly Care',
    text: 'Being abroad for work, I worried constantly about my father. Now I can check his schedule and daily notes from my phone whenever I want. That visibility changed everything for our family.',
  },
]

const faqs = [
  {
    q: 'What kind of home healthcare does Aethla Care offer in Qatar?',
    a: 'We provide elderly care, disability support, maternity and newborn care, telehealth coordination, patient navigation, and preventative wellness programs — available across Doha, Lusail, Al Wakrah, and Al Rayyan.',
  },
  {
    q: 'Can I arrange a live-in caregiver?',
    a: 'Yes. We offer both live-in arrangements and scheduled visits, and we\'ll help you decide which fits your household best.',
  },
  {
    q: 'Do your caregivers speak languages other than Arabic?',
    a: 'Our team includes speakers of Arabic, English, Tagalog, Hindi, Urdu, and other languages, so communication is rarely a barrier.',
  },
  {
    q: 'How are caregivers vetted before placement?',
    a: 'Every caregiver completes Ministry of Health verification, a background check, and ongoing training before being matched with a family.',
  },
  {
    q: 'What can I do through the family portal?',
    a: 'You can view upcoming visits, read care notes after each session, see billing details, and stay in touch with your care coordinator — all from one place.',
  },
  {
    q: 'How soon can care start after I get in touch?',
    a: 'Most families begin receiving care within 24–48 hours of their initial assessment. If the situation is urgent, we can often move faster.',
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
                Care That Feels Like<br />
                <span className="gradient-text">Family, At Home.</span>
              </h1>
              <p className="text-body-lg text-white/75 mb-8 max-w-lg leading-relaxed animate-fade-in-up animation-delay-100">
                From a parent recovering at home to a newborn&apos;s first weeks, Aethla Care connects Qatari households with skilled caregivers and a platform that keeps everyone informed — every step of the way.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-200">
                <Link href="/contact" className="btn-accent btn-lg">
                  Book a Free Consultation
                </Link>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost btn-lg"
                >
                  Talk to a Care Coordinator
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
                    {['Verified Caregivers', 'Multilingual Support', 'Plans Built Around You'].map((b) => (
                      <span key={b} className="trust-pill text-xs">{b}</span>
                    ))}
                  </div>
                  <p className="text-body-sm font-semibold font-poppins text-white mb-1">Care Across Every Life Stage</p>
                  <p className="text-caption text-white/60">From newborn support to senior care — one trusted team</p>
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
            <div className="section-label justify-center mb-3">What We Offer</div>
            <h2 className="text-display-sm mb-4">Support Designed Around Your Family</h2>
            <p className="text-body-lg text-neutral-500">
              Whether you&apos;re welcoming a new baby or caring for an aging parent, our caregivers bring the right skills to your home.
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
              <h3 className="text-heading-md text-primary-500 mb-2">Not sure where to start?</h3>
              <p className="text-body-sm text-neutral-500 mb-5">Speak with a coordinator and we&apos;ll recommend the right type of support for your situation.</p>
              <Link href="/contact" className="btn-primary btn-sm">Get a Free Assessment</Link>
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
              <div className="section-label mb-3">Why Families Choose Us</div>
              <h2 className="text-display-sm mb-4">Care You Can Actually Keep Track Of</h2>
              <p className="text-body-lg text-neutral-500 mb-8">
                Good caregivers matter most — but so does knowing what&apos;s happening when you can&apos;t be there. We built our platform to give families that visibility.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: '🤖', title: 'Smarter Caregiver Matching', desc: 'We consider language, personality, and household needs before making an introduction.' },
                  { icon: '📱', title: 'A Portal Built for Families', desc: 'Check schedules, read visit notes, and review invoices — all from your phone.' },
                  { icon: '🌐', title: 'Care in Your Language', desc: 'Our team speaks Arabic, English, Tagalog, Hindi, Urdu, and more.' },
                  { icon: '✅', title: 'Verified, Trained Caregivers', desc: 'Every team member passes Ministry of Health checks and ongoing training.' },
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
            <div className="section-label justify-center mb-3">Getting Started</div>
            <h2 className="text-display-sm mb-4">From First Call to Ongoing Care</h2>
            <p className="text-body-lg text-neutral-500">Here&apos;s what working with Aethla Care typically looks like.</p>
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
            <div className="section-label justify-center mb-3">In Their Words</div>
            <h2 className="text-display-sm mb-4">Stories From Families We&apos;ve Worked With</h2>
            <p className="text-body-lg text-neutral-500">A few of the experiences families have shared with us.</p>
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
            <div className="section-label justify-center mb-3" style={{ color: '#5DD6B8' }}>Behind the Scenes</div>
            <h2 className="text-display-sm text-white mb-4">The Platform That Keeps Care Organized</h2>
            <p className="text-body-lg text-white/65">A few of the tools our coordinators and caregivers use to keep your care plan running smoothly.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '📍', title: 'Visit Tracking', desc: 'Check-ins are logged automatically so you know when a visit started and ended.' },
              { icon: '🔐', title: 'Private Family Access', desc: 'Each family gets a secure login to view their own care information only.' },
              { icon: '🤖', title: 'Caregiver Matching Tool', desc: 'Helps coordinators shortlist caregivers based on language, skills, and fit.' },
              { icon: '📝', title: 'Digital Visit Notes', desc: 'Caregivers log notes and photos after each visit, shared with the family.' },
              { icon: '📅', title: 'Coordinated Scheduling', desc: 'Shift planning that adjusts as needs change, with alerts for any gaps.' },
              { icon: '💬', title: 'Direct Coordinator Access', desc: 'A single point of contact for questions, changes, or concerns.' },
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
              See How It Works →
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
              <h2 className="text-display-md text-white mb-4">Ready to Talk About Your Family&apos;s Needs?</h2>
              <p className="text-body-lg text-white/80 max-w-xl mx-auto mb-8">
                A short conversation with our team is the first step. There&apos;s no cost and no commitment — just a clearer picture of your options.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact" className="btn-white btn-lg">Book a Free Consultation</Link>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-lg">
                  Message Us on WhatsApp
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
            <div className="section-label justify-center mb-3">Questions & Answers</div>
            <h2 className="text-display-sm mb-4">Common Questions From Families</h2>
            <p className="text-body-lg text-neutral-500">A few things people often ask before getting started.</p>
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