'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

const TicketSchema = z.object({
  title: z.string().min(3),
  category: z.enum(['plumbing', 'electrical', 'internet', 'other']),
  description: z.string().min(10),
})

export default function TicketForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(TicketSchema) })

  const onSubmit = async (data) => {
    try {
      await api.post('/tickets', data)
      reset()
      alert('Ticket submitted')
    } catch (err) {
      console.error(err)
      alert('Failed to submit ticket')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Title" {...register('title')} />
      {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

      <Input placeholder="Category (plumbing/electrical/internet/other)" {...register('category')} />
      {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}

      <Textarea rows={5} placeholder="Describe the issue" {...register('description')} />
      {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit Ticket'}</Button>
    </form>
  )
}
