'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
    const router = useRouter();
  const [form, setForm] = useState({ email: '', otp: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
  const formData = {
    ...form,
    otp: Number(form.otp) // Convert OTP to number
  }

    const res = await fetch('/api/users/reset-password', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await res.json()
    if (res.ok) {
      toast.success("Password reset successful")
      router.push('/login')
    } else {
      toast.error(data.message)
    }
  }

  return (
    <Card className="mx-auto max-w-sm w-full mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">
          <p className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj">
            <span className="relative inline-flex sm:inline">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
              <span className="relative">Reset Password</span>
            </span>
          </p>
        </CardTitle>
        <CardDescription>
          Enter your email, OTP, and new password below to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="otp">OTP</Label>
            <Input name="otp"  placeholder="OTP" onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input name="password" type="password" placeholder="New Password" onChange={handleChange} required />
          </div>
          <Button type="submit" className="w-1/2 mx-auto" variant='black'>Reset Password</Button>
        </form>
      </CardContent>
    </Card>
  )
}
