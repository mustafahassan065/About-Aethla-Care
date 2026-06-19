'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'

const services = [
  { href: '/services/elderly-care',       label: 'Elderly Care'                     },
  { href: '/services/disability-support', label: 'Disability Support'               },
  { href: '/services/newborn-care',       label: 'Newborn Baby Care'                },
  { href: '/services/maternity-care',     label: 'Maternity Care'                   },
  { href: '/services/home-wellness',      label: 'Home Wellness Services'           },
  { href: '/services/telehealth',         label: 'Telehealth Support'               },
  { href: '/services/patient-navigation', label: 'Patient Navigation'               },
  { href: '/services/lifestyle-wellness', label: 'Lifestyle & Preventative Wellness'},
]

const portals = [
  { key: 'administration', label: 'Administration', desc: 'Admin & coordinator access',    href: '/admin/login',    color: '#1B6B8A' },
  { key: 'employee',       label: 'Employee',        desc: 'Staff & caregiver access',      href: '/employee/login', color: '#2DA88A' },
  { key: 'patient',        label: 'Patient',         desc: 'Patients, guardians & family',  href: '/portal/login',   color: '#C9A84C' },
]

// Fetch settings from backend
async function fetchSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, { next: { revalidate: 60 } })
    if (res.ok) return res.json()
  } catch {}
  return null
}

function Navbar() {
  const [isScrolled, setIsScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [portalsOpen, setPortalsOpen]   = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-md' : 'bg-white/90 backdrop-blur-md'}`}
        style={{ borderBottom: '1px solid rgba(27,107,138,0.10)' }}>
        <div className="container-max px-4 md:px-8">
          <div className="flex items-center justify-between h-[76px]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg font-bold font-poppins flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>A</div>
              <div>
                <span className="block text-xl font-extrabold font-poppins tracking-tight" style={{ color: '#1B6B8A' }}>Aethla Care</span>
                <span className="block text-[11px] font-medium uppercase tracking-widest" style={{ color: '#7A96A4' }}>Premium Home Healthcare · Qatar</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              <NavLink href="/" label="Home" pathname={pathname} />
              <NavLink href="/about" label="About" pathname={pathname} />

              <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                <button className={`flex items-center gap-1 text-body-sm font-medium transition-colors ${pathname.startsWith('/services') ? 'text-primary-500' : 'text-neutral-600 hover:text-primary-500'}`}>
                  Services <ChevronDown size={16} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl border border-neutral-100 p-2 z-50"
                      style={{ boxShadow: '0 20px 60px rgba(27,107,138,0.16)' }}>
                      {services.map(s => (
                        <Link key={s.href} href={s.href} className="flex items-center px-3 py-2.5 rounded-xl text-body-sm text-neutral-600 hover:text-primary-500 hover:bg-primary-50 transition-all">
                          {s.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink href="/areas" label="Areas" pathname={pathname} />
              <NavLink href="/technology" label="Technology" pathname={pathname} />
              <NavLink href="/blog" label="Resources" pathname={pathname} />
              <NavLink href="/careers" label="Careers" pathname={pathname} />
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="relative" onMouseEnter={() => setPortalsOpen(true)} onMouseLeave={() => setPortalsOpen(false)}>
                <button className="btn-outline btn-sm flex items-center gap-1.5">
                  Portal Access <ChevronDown size={14} className={`transition-transform ${portalsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {portalsOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}
                      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl border border-neutral-100 p-3 z-50"
                      style={{ boxShadow: '0 20px 60px rgba(27,107,138,0.16)' }}>
                      <p className="text-caption text-neutral-400 px-2 mb-2 uppercase tracking-wider">Select Your Portal</p>
                      {portals.map(p => (
                        <Link key={p.key} href={p.href} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 transition-all group">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}18`, border: `1.5px solid ${p.color}30` }}>
                            <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                          </div>
                          <div>
                            <p className="text-body-sm font-bold font-poppins text-neutral-800 group-hover:text-primary-500">{p.label}</p>
                            <p className="text-caption text-neutral-400">{p.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link href="/contact" className="btn-primary btn-sm">Book Consultation</Link>
            </div>

            <button className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-white lg:hidden overflow-y-auto" style={{ paddingTop: '76px' }}>
            <div className="flex flex-col p-6 gap-1">
              <MobileNavLink href="/" label="Home" />
              <MobileNavLink href="/about" label="About Us" />
              <div className="py-2 px-3">
                <p className="text-overline text-neutral-400 mb-2">Services</p>
                {services.map(s => (
                  <Link key={s.href} href={s.href} className="flex items-center py-2.5 text-body-sm text-neutral-600 hover:text-primary-500 transition-colors">{s.label}</Link>
                ))}
              </div>
              <MobileNavLink href="/areas" label="Areas We Serve" />
              <MobileNavLink href="/technology" label="Technology" />
              <MobileNavLink href="/blog" label="Resources" />
              <MobileNavLink href="/careers" label="Careers" />
              <MobileNavLink href="/contact" label="Contact" />

              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-overline text-neutral-400 mb-3 px-3">Portal Access</p>
                {portals.map(p => (
                  <Link key={p.key} href={p.href} className="flex items-center gap-3 py-3 px-3 rounded-xl mb-1 transition-all"
                    style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: p.color }}>
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                    <div>
                      <p className="text-body-sm font-bold font-poppins" style={{ color: p.color }}>{p.label}</p>
                      <p className="text-caption text-neutral-400">{p.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Link href="/contact" className="btn-primary text-center py-3">Book Free Consultation</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const isActive = pathname === href
  return (
    <Link href={href} className={`text-body-sm font-medium transition-colors ${isActive ? 'text-primary-500' : 'text-neutral-600 hover:text-primary-500'}`}>
      {label}
    </Link>
  )
}

function MobileNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex items-center py-3 px-3 text-body-md font-medium text-neutral-700 hover:text-primary-500 border-b border-neutral-100 transition-colors">
      {label}
    </Link>
  )
}

function Footer({ settings }: { settings: any }) {
  const phone          = settings?.phone          || '+974 4000 0000'
  const emergencyPhone = settings?.emergencyPhone || '+974 6000 0000'
  const email          = settings?.email          || 'info@aethlacare.com'
  const address        = settings?.address        || 'West Bay, Doha, Qatar'
  const whatsapp       = settings?.whatsappNumber || '97440000000'

  return (
    <footer style={{ background: '#0D2B3E' }} className="pt-20 pb-8 px-4 md:px-8">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg font-bold font-poppins"
                style={{ background: 'linear-gradient(135deg, #1B6B8A, #2DA88A)' }}>A</div>
              <div>
                <span className="block text-lg font-extrabold font-poppins text-white">Aethla Care</span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-white/40">Premium Home Healthcare</span>
              </div>
            </div>
            <p className="text-body-sm text-white/55 leading-relaxed mb-6 max-w-xs">
              Qatar&apos;s technology-enabled home healthcare and family wellness provider. Compassionate care for every generation.
            </p>
          </div>

          <div>
            <h5 className="text-body-sm font-bold font-poppins text-white mb-5">Services</h5>
            <ul className="flex flex-col gap-2.5">
              {services.map(s => (
                <li key={s.href}><Link href={s.href} className="text-body-sm text-white/55 hover:text-accent-400 transition-colors">{s.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-body-sm font-bold font-poppins text-white mb-5">Portal Access</h5>
            <ul className="flex flex-col gap-3">
              {portals.map(p => (
                <li key={p.key}>
                  <Link href={p.href} className="flex items-center gap-2 text-body-sm text-white/55 hover:text-accent-400 transition-colors">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-white/10">
              <h5 className="text-body-sm font-bold font-poppins text-white mb-3">Company</h5>
              <ul className="flex flex-col gap-2.5">
                {[
                  { href: '/about',      label: 'About Us'        },
                  { href: '/areas',      label: 'Areas We Serve'  },
                  { href: '/technology', label: 'Technology'       },
                  { href: '/careers',    label: 'Careers'          },
                  { href: '/blog',       label: 'Blog & Resources' },
                  { href: '/contact',    label: 'Contact Us'       },
                ].map(l => (
                  <li key={l.href}><Link href={l.href} className="text-body-sm text-white/55 hover:text-accent-400 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h5 className="text-body-sm font-bold font-poppins text-white mb-5">Contact</h5>
            <ul className="flex flex-col gap-3 mb-5">
              <li>
                <p className="text-[11px] text-white/30 uppercase tracking-wider mb-0.5">Phone</p>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-body-sm text-white/55 hover:text-accent-400 transition-colors">{phone}</a>
              </li>
              <li>
                <p className="text-[11px] text-white/30 uppercase tracking-wider mb-0.5">WhatsApp</p>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-body-sm text-white/55 hover:text-accent-400 transition-colors">Message Our Team</a>
              </li>
              <li>
                <p className="text-[11px] text-white/30 uppercase tracking-wider mb-0.5">Email</p>
                <a href={`mailto:${email}`} className="text-body-sm text-white/55 hover:text-accent-400 transition-colors">{email}</a>
              </li>
              <li>
                <p className="text-[11px] text-white/30 uppercase tracking-wider mb-0.5">Location</p>
                <p className="text-body-sm text-white/55">{address}</p>
              </li>
            </ul>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <p className="text-caption text-white/40 mb-1">Emergency Care Line</p>
              <a href={`tel:${emergencyPhone.replace(/\s/g, '')}`} className="text-heading-sm font-bold font-poppins text-white">{emergencyPhone}</a>
              <p className="text-caption mt-0.5" style={{ color: '#2DA88A' }}>Available 24 hours, 7 days</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-caption text-white/35">
            &copy; {new Date().getFullYear()} Aethla Care. All rights reserved. Licensed by Qatar Ministry of Health.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href="#" className="text-[12px] text-white/35 hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFab({ whatsapp }: { whatsapp: string }) {
  return (
    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
      className="whatsapp-fab" aria-label="Chat on WhatsApp">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSettings()

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '76px' }}>{children}</main>
      <Footer settings={settings} />
      <WhatsAppFab whatsapp={settings?.whatsappNumber || '97440000000'} />
    </>
  )
}