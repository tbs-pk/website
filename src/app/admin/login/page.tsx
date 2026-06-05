'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Wannan zai wanke duk wani tsohon error da ke jikin URL dinka idan ka bude shafin danya-danya
  useEffect(() => {
    if (window.location.search.includes('error')) {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid username or password');
      }

      // 1. Wanke cache ta Next.js client-side router nan take
      router.refresh();
      
      // 2. Tura mai amfani zuwa babban shafin admin dashboard lafiya lau
      router.push('/admin');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-10">
      {error && (
        <div className="mb-4 p-3 rounded border border-red-300 text-red-700 bg-red-50">
          {error}
        </div>
      )}
      
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-neutral-800">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-700" htmlFor="username">
              Username
            </label>
            <input 
              id="username" 
              name="username" 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-700" htmlFor="password">
              Password
            </label>
            <input 
              id="password" 
              name="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded w-full font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-neutral-500 mt-4">After login you will be redirected automatically.</p>
      </div>
    </div>
  );
}