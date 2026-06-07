'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'

const schema = z.object({
  firstName:      z.string().min(2, 'Required'),
  lastName:       z.string().min(2, 'Required'),
  email:          z.string().email('Valid email required'),
  phone:          z.string().min(8, 'Required'),
  licenseNumber:  z.string().min(3, 'Required'),
  licenseExpiry:  z.string().min(1, 'Required'),
  specialization: z.string().min(1, 'Required'),
  language:       z.string().min(1, 'Required'),
  experience:     z.coerce.number().min(0),
  hourlyRate:     z.coerce.number().min(0),
  bio:            z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function NewStaffPage() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      // Payload - _userData alag, caregiver data alag
      const payload = {
        // Caregiver fields
        licenseNumber:       data.licenseNumber,
        licenseExpiry:       data.licenseExpiry,
        specializations:     [data.specialization],
        languages:           [data.language],
        experience:          data.experience,
        hourlyRate:          data.hourlyRate,
        bio:                 data.bio || '',
        status:              'active',
        backgroundCheckStatus: 'pending',
        rating:              0,
        totalReviews:        0,
        currentClients:      [],
        availability:        [],
        certifications:      [],

        // User data - backend isko use karke pehle User banayega
        _userData: {
          firstName: data.firstName,
          lastName:  data.lastName,
          email:     data.email,
          phone:     data.phone,
          role:      'caregiver',
        },
      }

      console.log('Sending payload:', payload)
      const response = await apiClient.post('/caregivers', payload)
      console.log('Response:', response.data)

      toast.success('Caregiver added successfully!')
      router.push('/admin/staff')
    } catch (err: any) {
      console.error('Error:', err)
      toast.error(err?.response?.data?.message || 'Failed to add caregiver')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Add Caregiver</h1>
          <p className="text-body-sm text-neutral-400">Register a new care professional</p>
        </div>
        <Link href="/admin/staff" className="btn-outline btn-sm">← Back</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left - Personal + Professional */}
          <div className="lg:col-span-2 space-y-5">

            {/* Personal Details */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name <span className="text-red-500">*</span></label>
                  <input {...register('firstName')} className="form-input" placeholder="Maria" />
                  {errors.firstName && <p className="text-caption text-red-500 mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="form-label">Last Name <span className="text-red-500">*</span></label>
                  <input {...register('lastName')} className="form-input" placeholder="Santos" />
                  {errors.lastName && <p className="text-caption text-red-500 mt-1">{errors.lastName.message}</p>}
                </div>
                <div>
                  <label className="form-label">Email <span className="text-red-500">*</span></label>
                  <input {...register('email')} type="email" className="form-input" placeholder="maria@example.com" />
                  {errors.email && <p className="text-caption text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="form-label">Phone <span className="text-red-500">*</span></label>
                  <input {...register('phone')} className="form-input" placeholder="+974 5500 0000" />
                  {errors.phone && <p className="text-caption text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Professional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">License Number <span className="text-red-500">*</span></label>
                  <input {...register('licenseNumber')} className="form-input" placeholder="MOH-12345" />
                  {errors.licenseNumber && <p className="text-caption text-red-500 mt-1">{errors.licenseNumber.message}</p>}
                </div>
                <div>
                  <label className="form-label">License Expiry <span className="text-red-500">*</span></label>
                  <input {...register('licenseExpiry')} type="date" className="form-input" />
                  {errors.licenseExpiry && <p className="text-caption text-red-500 mt-1">{errors.licenseExpiry.message}</p>}
                </div>
                <div>
                  <label className="form-label">Years Experience</label>
                  <input {...register('experience')} type="number" min="0" className="form-input" placeholder="3" />
                </div>
                <div>
                  <label className="form-label">Hourly Rate (QAR)</label>
                  <input {...register('hourlyRate')} type="number" min="0" className="form-input" placeholder="50" />
                </div>
              </div>
              <div className="mt-4">
                <label className="form-label">Bio</label>
                <textarea {...register('bio')} className="form-input min-h-[80px] resize-y" placeholder="Professional background and specialties..." />
              </div>
            </div>
          </div>

          {/* Right - Specialization + Submit */}
          <div className="space-y-5">
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Specialization</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Primary Specialization <span className="text-red-500">*</span></label>
                  <select {...register('specialization')} className="form-input">
                    <option value="">Select...</option>
                    <option value="elderly">Elderly Care</option>
                    <option value="disability">Disability Support</option>
                    <option value="newborn">Newborn Care</option>
                    <option value="maternity">Maternity Care</option>
                    <option value="wellness">Home Wellness</option>
                    <option value="telehealth">Telehealth</option>
                  </select>
                  {errors.specialization && <p className="text-caption text-red-500 mt-1">{errors.specialization.message}</p>}
                </div>
                <div>
                  <label className="form-label">Primary Language <span className="text-red-500">*</span></label>
                  <select {...register('language')} className="form-input">
                    <option value="">Select...</option>
                    <option value="Arabic">Arabic</option>
                    <option value="English">English</option>
                    <option value="Tagalog">Tagalog</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Malayalam">Malayalam</option>
                  </select>
                  {errors.language && <p className="text-caption text-red-500 mt-1">{errors.language.message}</p>}
                </div>
              </div>
            </div>

            <div className="card p-5 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary btn-lg w-full"
              >
                {isSubmitting ? '⏳ Adding...' : '✅ Add Caregiver'}
              </button>
              <Link href="/admin/staff" className="btn-outline w-full text-center block py-3">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}