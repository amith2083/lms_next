'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

export default function SelectRolePage() {
  const { data: session } = useSession();
//   const[loginSession,setLoginSession]= useState<Session | null>(null);
//   console.log('google',session)
//   console.log(loginSession)
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
    // useEffect(()=>{
    //   setLoginSession(session)
    // },[session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return alert('Please select a role.');

    setLoading(true);

    const res = await fetch('/api/setrole', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({   email: session?.user?.email,
        role, }),
    });

    setLoading(false);

    if (res.ok) {
        router.push('/')
    } else {
      alert('Failed to set role. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Select Your Role</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="role"
              value="student"
              onChange={(e) => setRole(e.target.value)}
              className="accent-blue-500"
            />
            <span>Student</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="role"
              value="instructor"
              onChange={(e) => setRole(e.target.value)}
              className="accent-green-500"
            />
            <span>Instructor</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
