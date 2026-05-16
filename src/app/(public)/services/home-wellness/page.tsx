import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Home Wellness & Preventative Health Services Qatar',
  description: 'Preventative wellness, diabetes screening, nutritional counseling, weight management, and lifestyle programs at home in Qatar.',
}
const services = [
  { title: 'Diabetes Screening & Management', desc: 'Regular blood glucose monitoring, dietary guidance, and medication support for diabetic patients.' },
  { title: 'Cholesterol & Cardiovascular Checks', desc: 'Home-based cardiovascular risk assessments and lifestyle modification programs.' },
  { title: 'Nutritional Counseling', desc: 'Personalized dietary plans developed by certified nutritionists for optimal health outcomes.' },
  { title: 'Weight Management Programs', desc: 'Structured, evidence-based programs combining nutrition, exercise, and behavioral support.' },
  { title: 'Smoking Cessation Programs', desc: 'Comprehensive support programs to help clients successfully quit smoking.' },
  { title: 'Wellness Monitoring', desc: 'Regular vital signs monitoring, health tracking, and preventative health assessments.' },
]
export default function HomeWellness() {
  return (
    <>
      <section className="relative min-h-[500px] flex items-end pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,62,0.95) 0%, rgba(13,43,62,0.7) 60%, rgba(13,43,62,0.4) 100%)' }} />
        <div className="container-max px-4 md:px-8 relative z-10 pt-20">
          <div className="trust-pill inline-flex mb-4 text-sm"><span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" /> Home Wellness Services</div>
          <h1 className="text-display-lg text-white max-w-2xl mb-4">Preventative & Lifestyle Wellness Services in Qatar</h1>
          <p className="text-body-lg text-white/75 max-w-lg mb-6">Comprehensive wellness programs to help you and your family maintain optimal health from the comfort of home.</p>
          <Link href="/contact" className="btn-accent btn-lg">Book a Wellness Assessment</Link>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-display-sm mb-8">Our Wellness Services</h2>
              <div className="flex flex-col gap-4">
                {services.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600 font-bold text-sm flex-shrink-0">✓</div>
                    <div><strong className="block text-body-md font-semibold font-poppins text-neutral-800 mb-1">{item.title}</strong><p className="text-body-sm text-neutral-500">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="card p-6 sticky top-24">
                <div className="text-4xl mb-3">🌿</div>
                <h3 className="text-heading-xl mb-3">Prevention is Better Than Cure</h3>
                <p className="text-body-sm text-neutral-500 mb-5">Our wellness programs are designed to prevent illness, manage chronic conditions, and enhance overall quality of life for every member of your family.</p>
                <Link href="/contact" className="btn-primary btn-lg w-full text-center block">Book Wellness Assessment →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
