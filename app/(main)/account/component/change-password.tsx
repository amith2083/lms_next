'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useUpdateUser } from '@/app/hooks/useUser';

const formSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6, 'Minimum 6 characters'),
  confirmPassword: z.string().min(6, 'Minimum 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

export default function ChangePassword({ userId }: { userId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutateAsync, isPending } = useUpdateUser(userId);

  const onSubmit = async (values: FormValues) => {
    try {
      await mutateAsync({ data: values });
      toast.success('Password updated');
      form.reset();
      toggleEdit();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-tr from-rose-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Change Password</h3>
        </div>
        <Button variant="ghost" className="text-sm" onClick={toggleEdit}>
          {isEditing ? 'Cancel' : <><Pencil className="h-4 w-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="oldPassword" render={({ field }) => (
              <FormItem>
                <Label>Old Password</Label>
                <FormControl>
                  <Input type="password" className="focus:ring-rose-500" placeholder="Enter old password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="newPassword" render={({ field }) => (
              <FormItem>
                <Label>New Password</Label>
                <FormControl>
                  <Input type="password" className="focus:ring-rose-500" placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <Label>Confirm Password</Label>
                <FormControl>
                  <Input type="password" className="focus:ring-rose-500" placeholder="Confirm new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={isPending} className="bg-rose-600 hover:bg-rose-700 text-white">
              {isPending ? 'Saving...' : 'Save Password'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
