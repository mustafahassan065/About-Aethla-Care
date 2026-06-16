'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useCreateClient } from '@/hooks'
import { FormInput, FormSelect, FormTextarea, PageHeader } from '@/components/ui/index'

const schema = z.object({
  firstName:   z.string().min(2, 'Required'),
  lastName:    z.string().min(2, 'Required'),
  dateOfBirth: z.string().min(1, 'Required'),
  gender:      z.enum(['male', 'female', 'other']),
  phone:       z.string().min(8, 'Valid phone required'),
  email:       z.string().email().optional().or(z.literal('')),
  careType:    z.string().min(1, 'Select a service'),
  area:        z.string().min(1, 'Required'),
  city:        z.string().default('Doha'),
  notes:       z.string().optional(),
  emergencyName:  z.string().min(2, 'Required'),
  emergencyPhone: z.string().min(8, 'Required'),
  emergencyRel:   z.string().min(2, 'Required'),
})
type FormData = z.infer<typeof schema>

const serviceOptions = [
  { value: 'elderly', label: 'Elderly Care' },
  { value: 'disability', label: 'Disability Support' },
  { value: 'newborn', label: 'Newborn Baby Care' },
  { value: 'maternity', label: 'Maternity Care' },
  { value: 'wellness', label: 'Home Wellness' },
  { value: 'telehealth', label: 'Telehealth Support' },
  { value: 'navigation', label: 'Patient Navigation' },
]

const areaOptions = [
  { value: 'West Bay', label: 'West Bay, Doha' },
  { value: 'Al Waab', label: 'Al Waab, Doha' },
  { value: 'Lusail', label: 'Lusail' },
  { value: 'Al Wakrah', label: 'Al Wakrah' },
  { value: 'Al Rayyan', label: 'Al Rayyan' },
  { value: 'Ain Khaled', label: 'Ain Khaled' },
  { value: 'Other', label: 'Other' },
]

export default function NewClientPage() {
  const router = useRouter()
  const createClient = useCreateClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { city: 'Doha', gender: 'male' },
  })

  const onSubmit = async (data: FormData) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phone: data.phone,
      email: data.email || undefined,
      careType: [data.careType],
      address: { area: data.area, city: data.city, country: 'Qatar' },
      notes: data.notes,
      status: 'pending',
      emergencyContacts: [{
        name: data.emergencyName,
        phone: data.emergencyPhone,
        relationship: data.emergencyRel,
      }],
    }
    await createClient.mutateAsync(payload)
    router.push('/admin/clients')
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

          {/* Personal Info */}
          <div className="lg:col-span-2 space-y-5">
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

            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormSelect label="Area / District" required error={errors.area?.message}
                  options={areaOptions} placeholder="Select area..." {...register('area')} />
                <FormInput label="City" required error={errors.city?.message} placeholder="Doha" {...register('city')} />
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Contact Name" required error={errors.emergencyName?.message} placeholder="Fatima Al-Rashid" {...register('emergencyName')} />
                <FormInput label="Relationship" required error={errors.emergencyRel?.message} placeholder="Daughter" {...register('emergencyRel')} />
                <FormInput label="Phone Number" required error={errors.emergencyPhone?.message} placeholder="+974 5500 1234" {...register('emergencyPhone')} className="col-span-2" />
              </div>
            </div>

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
              <button type="submit" disabled={createClient.isPending} className="btn-primary btn-lg w-full">
                {createClient.isPending ? '⏳ Creating...' : '✅ Create Client'}
              </button>
              <Link href="/admin/clients" className="btn-outline w-full text-center block py-3">Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
