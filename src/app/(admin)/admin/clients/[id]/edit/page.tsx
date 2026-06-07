'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useClient, useUpdateClient } from '@/hooks'
import { FormInput, FormSelect, FormTextarea, PageHeader } from '@/components/ui/index'

const schema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName:  z.string().min(2, 'Required'),
  phone:     z.string().min(8, 'Required'),
  email:     z.string().email().optional().or(z.literal('')),
  careType:  z.string().min(1, 'Required'),
  status:    z.string().min(1, 'Required'),
  area:      z.string().min(1, 'Required'),
  notes:     z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: client, isLoading } = useClient(params.id)
  const updateClient = useUpdateClient(params.id)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (client) {
      reset({
        firstName: client.firstName,
        lastName:  client.lastName,
        phone:     client.phone,
        email:     client.email || '',
        careType:  client.careType?.[0] || '',
        status:    client.status,
        area:      client.address?.area || '',
        notes:     client.notes || '',
      })
    }
  }, [client, reset])

  const onSubmit = async (data: FormData) => {
    await updateClient.mutateAsync({
      firstName: data.firstName, lastName: data.lastName,
      phone: data.phone, email: data.email || undefined,
      careType: [data.careType], status: data.status,
      address: { ...(client?.address || {}), area: data.area },
      notes: data.notes,
    })
    router.push(`/admin/clients/${params.id}`)
  }

  if (isLoading) return <div className="skeleton h-64 rounded-2xl" />

  return (
    <div>
      <PageHeader
        title="Edit Client"
        subtitle={`${client?.firstName} ${client?.lastName}`}
        action={<Link href={`/admin/clients/${params.id}`} className="btn-outline btn-sm">← Back</Link>}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-5">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="First Name" required error={errors.firstName?.message} {...register('firstName')} />
                <FormInput label="Last Name" required error={errors.lastName?.message} {...register('lastName')} />
                <FormInput label="Phone" required error={errors.phone?.message} {...register('phone')} />
                <FormInput label="Email" type="email" error={errors.email?.message} {...register('email')} />
                <FormSelect label="Status" required error={errors.status?.message}
                  options={[
                    { value: 'active', label: 'Active' }, { value: 'pending', label: 'Pending' },
                    { value: 'inactive', label: 'Inactive' }, { value: 'discharged', label: 'Discharged' },
                  ]} {...register('status')} />
                <FormInput label="Area" required error={errors.area?.message} {...register('area')} />
              </div>
            </div>
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Notes</h3>
              <FormTextarea placeholder="Additional notes..." {...register('notes')} />
            </div>
          </div>
          <div className="space-y-5">
            <div className="card p-6">
              <h3 className="text-heading-md font-poppins mb-4">Care Service</h3>
              <FormSelect label="Service" required error={errors.careType?.message}
                options={[
                  { value: 'elderly', label: 'Elderly Care' }, { value: 'disability', label: 'Disability' },
                  { value: 'newborn', label: 'Newborn Care' }, { value: 'maternity', label: 'Maternity' },
                  { value: 'wellness', label: 'Wellness' }, { value: 'telehealth', label: 'Telehealth' },
                  { value: 'navigation', label: 'Navigation' },
                ]} {...register('careType')} />
            </div>
            <div className="card p-5 space-y-3">
              <button type="submit" disabled={updateClient.isPending} className="btn-primary btn-lg w-full">
                {updateClient.isPending ? '⏳ Saving...' : '✅ Save Changes'}
              </button>
              <Link href={`/admin/clients/${params.id}`} className="btn-outline w-full text-center block py-3">Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
