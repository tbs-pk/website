'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
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
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
          <p className="text-neutral-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-neutral-700 hover:text-text font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="border-b border-neutral-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-text">Settings</h1>
          </div>
          
          <div className="flex">
            <div className="w-64 border-r border-neutral-200 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-secondary text-primary'
                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-text'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex-1 p-6 lg:p-8">
              {activeTab === 'account' && (
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold text-text mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name || ''}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold text-text mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                      Update Password
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold text-text mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { id: 'email', label: 'Email Notifications', desc: 'Receive course updates via email' },
                      { id: 'push', label: 'Push Notifications', desc: 'Receive browser notifications' },
                      { id: 'marketing', label: 'Marketing Emails', desc: 'Receive new course announcements' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl">
                        <div>
                          <p className="font-medium text-text">{item.label}</p>
                          <p className="text-sm text-neutral-600">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'privacy' && (
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold text-text mb-6">Privacy Settings</h2>
                  <div className="space-y-4">
                    {[
                      { id: 'profile', label: 'Profile Visibility', desc: 'Who can see your profile' },
                      { id: 'activity', label: 'Activity Visibility', desc: 'Show your learning activity' },
                    ].map((item) => (
                      <div key={item.id} className="p-4 border border-neutral-200 rounded-xl">
                        <p className="font-medium text-text mb-2">{item.label}</p>
                        <p className="text-sm text-neutral-600 mb-4">{item.desc}</p>
                        <select className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                          <option>Everyone</option>
                          <option>Only Me</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}