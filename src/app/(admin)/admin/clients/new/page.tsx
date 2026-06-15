'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import toast from 'react-hot-toast'
import apiClient from '@/lib/api'
import { FormInput, FormSelect, FormTextarea, PageHeader } from '@/components/ui/index'

const schema = z.object({
  firstName:        z.string().min(2, 'Required'),
  lastName:         z.string().min(2, 'Required'),
  dateOfBirth:      z.string().min(1, 'Required'),
  gender:           z.enum(['male', 'female', 'other']),
  phone:            z.string().min(8, 'Valid phone required'),
  email:            z.string().email().optional().or(z.literal('')),
  careType:         z.string().min(1, 'Select a service'),
  area:             z.string().min(1, 'Required'),
  city:             z.string().default('Doha'),
  notes:            z.string().optional(),
  emergencyName:    z.string().min(2, 'Required'),
  emergencyPhone:   z.string().min(8, 'Required'),
  emergencyRel:     z.string().min(2, 'Required'),
  // Family portal access
  createPortalAccess: z.boolean().default(false),
  portalEmail:      z.string().email().optional().or(z.literal('')),
  portalPassword:   z.string().optional(),
})
type FormData = z.infer<typeof schema>

const serviceOptions = [
  { value: 'elderly',    label: 'Elderly Care'       },
  { value: 'disability', label: 'Disability Support'  },
  { value: 'newborn',    label: 'Newborn Baby Care'   },
  { value: 'maternity',  label: 'Maternity Care'      },
  { value: 'wellness',   label: 'Home Wellness'       },
  { value: 'telehealth', label: 'Telehealth Support'  },
  { value: 'navigation', label: 'Patient Navigation'  },
]

const areaOptions = [
  { value: 'West Bay',  label: 'West Bay, Doha' },
  { value: 'Al Waab',   label: 'Al Waab, Doha'  },
  { value: 'Lusail',    label: 'Lusail'          },
  { value: 'Al Wakrah', label: 'Al Wakrah'       },
  { value: 'Al Rayyan', label: 'Al Rayyan'       },
  { value: 'Ain Khaled',label: 'Ain Khaled'      },
  { value: 'Other',     label: 'Other'           },
]

export default function NewClientPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createPortal, setCreatePortal] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { city: 'Doha', gender: 'male', createPortalAccess: false },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      let userId: string | undefined

      // Step 1: If portal access requested, create family user first
      if (data.createPortalAccess && data.portalEmail && data.portalPassword) {
        try {
          const userRes = await apiClient.post('/users', {
            firstName: data.firstName,
            lastName:  data.lastName,
            email:     data.portalEmail,
            password:  data.portalPassword,
            role:      'family',
            isActive:  true,
            isVerified: true,
          })
          userId = userRes.data._id
          toast.success('Family portal user created')
        } catch (e: any) {
          toast.error(e?.response?.data?.message || 'Could not create portal user — client will still be created')
        }
      }

      // Step 2: Create client, link to user if created
      const payload: any = {
        firstName:   data.firstName,
        lastName:    data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender:      data.gender,
        phone:       data.phone,
        email:       data.email || undefined,
        careType:    [data.careType],
        address:     { area: data.area, city: data.city, country: 'Qatar' },
        notes:       data.notes,
        status:      'pending',
        emergencyContacts: [{
          name:         data.emergencyName,
          phone:        data.emergencyPhone,
          relationship: data.emergencyRel,
        }],
      }

      if (userId) payload.userId = userId

      await apiClient.post('/clients', payload)
      toast.success('Client created successfully')
      router.push('/admin/clients')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create client')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Add New Client"
        subtitle="Create a new client profile"
        action={<Link href="/admin/clients" className="btn-outline btn-sm">← Back to Clients</Link>}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-5">
            {/* Personal Info */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="First Name" required error={errors.firstName?.message} placeholder="Ahmed" {...register('firstName')} />
                <FormInput label="Last Name" required error={errors.lastName?.message} placeholder="Al-Rashid" {...register('lastName')} />
                <FormInput label="Date of Birth" type="date" required error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />
                <FormSelect label="Gender" required error={errors.gender?.message}
                  options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]}
                  {...register('gender')} />
                <FormInput label="Phone Number" required error={errors.phone?.message} placeholder="+974 5500 0000" {...register('phone')} />
                <FormInput label="Email (Optional)" type="email" error={errors.email?.message} placeholder="client@email.com" {...register('email')} />
              </div>
            </div>

            {/* Location */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormSelect label="Area / District" required error={errors.area?.message}
                  options={areaOptions} placeholder="Select area..." {...register('area')} />
                <FormInput label="City" required error={errors.city?.message} placeholder="Doha" {...register('city')} />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Contact Name" required error={errors.emergencyName?.message} placeholder="Fatima Al-Rashid" {...register('emergencyName')} />
                <FormInput label="Relationship" required error={errors.emergencyRel?.message} placeholder="Daughter" {...register('emergencyRel')} />
                <FormInput label="Phone Number" required error={errors.emergencyPhone?.message} placeholder="+974 5500 1234" {...register('emergencyPhone')} className="col-span-2" />
              </div>
            </div>

            {/* Family Portal Access */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-heading-md font-poppins">Family Portal Access</h3>
                  <p className="text-body-sm text-neutral-400 mt-0.5">
                    Create a login so family members can view care updates online
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createPortal}
                    onChange={e => setCreatePortal(e.target.checked)}
                    className="w-5 h-5 accent-primary-500"
                  />
                </label>
              </div>

              {createPortal && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                  <div className="col-span-2">
                    <p className="text-caption text-neutral-400 mb-3">
                      These credentials will be shared with the family member to access the portal at{' '}
                      <strong className="text-primary-500">aethlacare.com/portal/login</strong>
                    </p>
                  </div>
                  <FormInput
                    label="Portal Email"
                    type="email"
                    required
                    error={errors.portalEmail?.message}
                    placeholder="family@email.com"
                    {...register('portalEmail')}
                  />
                  <FormInput
                    label="Portal Password"
                    type="password"
                    required
                    error={errors.portalPassword?.message}
                    placeholder="Min. 8 characters"
                    {...register('portalPassword')}
                  />
                  <div className="col-span-2 p-3 rounded-xl" style={{ background: 'var(--color-primary-light)' }}>
                    <p className="text-caption text-primary-700">
                      The family member can log in at <strong>aethlacare.com/portal/login</strong> with the email and password above.
                      Share these credentials with them after creating the client.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Additional Notes</h3>
              <FormTextarea placeholder="Medical history, special requirements, caregiver preferences..." {...register('notes')} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Care Service</h3>
              <FormSelect
                label="Primary Service" required error={errors.careType?.message}
                options={serviceOptions} placeholder="Select service..."
                {...register('careType')}
              />
            </div>

            <div className="card p-6 space-y-3">
              <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg w-full">
                {isSubmitting ? 'Creating...' : 'Create Client'}
              </button>
              <Link href="/admin/clients" className="btn-outline w-full text-center block py-3">Cancel</Link>
            </div>

            {createPortal && (
              <div className="card p-5" style={{ borderLeft: '4px solid #2DA88A' }}>
                <p className="text-body-sm font-semibold text-neutral-800 mb-1">Portal will be created</p>
                <p className="text-caption text-neutral-500">
                  A family user account will be created and automatically linked to this client.
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}