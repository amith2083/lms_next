'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, UserCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useUpdateUser } from '@/app/hooks/useUser';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().optional(),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PersonalDetails({ userInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userInfo?.name || '',
      designation: userInfo?.designation || '',
      bio: userInfo?.bio || '',
    },
  });

  const { mutateAsync, isPending } = useUpdateUser(userInfo?.id);

  const onSubmit = async (values: FormValues) => {
    try {
      await mutateAsync({ data: values });
      toast.success('Profile updated successfully');
      toggleEdit();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-tr from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
            <UserCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Personal Details</h3>
        </div>
        <Button variant="ghost" className="text-sm" onClick={toggleEdit}>
          {isEditing ? 'Cancel' : <><Pencil className="h-4 w-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>Name:</strong> {userInfo?.name}</p>
          <p><strong>Designation:</strong> {userInfo?.designation || '—'}</p>
          <p><strong>Bio:</strong> {userInfo?.bio || '—'}</p>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <Label>Name</Label>
                <FormControl>
                  <Input className="focus:ring-indigo-500" placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="designation" render={({ field }) => (
              <FormItem>
                <Label>Designation</Label>
                <FormControl>
                  <Input className="focus:ring-indigo-500" placeholder="Your job title" {...field} />
                </FormControl>
              </FormItem>
            )} />

            <FormField control={form.control} name="bio" render={({ field }) => (
              <FormItem>
                <Label>Bio</Label>
                <FormControl>
                  <Textarea className="focus:ring-indigo-500" placeholder="A short description..." {...field} />
                </FormControl>
              </FormItem>
            )} />

            <Button disabled={isPending} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
