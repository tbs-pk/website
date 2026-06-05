'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.user) {
          router.push('/login');
          return;
        }
        setUser(data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-neutral-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-text mb-2">Your Profile</h1>
          <p className="text-neutral-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-200">
            <div className="bg-primary/20 p-6 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text">{user?.name}</h2>
              <p className="text-neutral-600">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Full Name</label>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-text">{user?.name}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Email Address</label>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-text">{user?.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Member Since</label>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-text">Today</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 px-6 py-3 border border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all">
            Edit Profile
          </button>
          <button
            onClick={() => {
              fetch('/api/auth/logout').then(() => {
                router.push('/');
                router.refresh();
              });
            }}
            className="flex-1 px-6 py-3 border border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-all"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
