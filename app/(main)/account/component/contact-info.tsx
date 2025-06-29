'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Phone, Globe, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useUpdateUser } from '@/app/hooks/useUser';

const formSchema = z.object({
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  website: z.string().url('Invalid URL').or(z.literal('')).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactInfo({ userInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: userInfo?.phone?.toString() || '',
      website: userInfo?.website || '',
    },
  });

  const { mutateAsync, isPending } = useUpdateUser(userInfo?.id);

  const onSubmit = async (values: FormValues) => {
    try {
      await mutateAsync({ data: { phone: Number(values.phone), website: values.website } });
      toast.success('Contact info updated');
      toggleEdit();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update contact info');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-tr from-sky-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Contact Info</h3>
        </div>
        <Button variant="ghost" className="text-sm" onClick={toggleEdit}>
          {isEditing ? 'Cancel' : <><Pencil className="h-4 w-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>Phone:</strong> {userInfo?.phone || '—'}</p>
          <p><strong>Website:</strong> {userInfo?.website || '—'}</p>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <Label>Phone</Label>
                <FormControl>
                  <Input type="tel" className="focus:ring-sky-500" placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="website" render={({ field }) => (
              <FormItem>
                <Label>Website</Label>
                <FormControl>
                  <Input type="url" className="focus:ring-sky-500" placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={isPending} className="bg-sky-600 hover:bg-sky-700 text-white">
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
