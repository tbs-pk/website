'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    education: '',
    location: '',
    skills: [] as string[],
    newSkill: '',
  });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bannerPic, setBannerPic] = useState<string | null>(null);
  const profilePicInput = useRef<HTMLInputElement>(null);
  const bannerPicInput = useRef<HTMLInputElement>(null);
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
        setFormData(prev => ({ ...prev, name: data.user.name }));
        
        // Load saved images from localStorage
        const savedProfilePic = localStorage.getItem('profilePic');
        const savedBannerPic = localStorage.getItem('bannerPic');
        if (savedProfilePic) setProfilePic(savedProfilePic);
        if (savedBannerPic) setBannerPic(savedBannerPic);
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
          <p className="text-neutral-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePic(result);
        localStorage.setItem('profilePic', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerPicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBannerPic(result);
        localStorage.setItem('bannerPic', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: '',
      }));
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile saved successfully!');
  };

  const stats = [
    { label: 'Courses Completed', value: '0' },
    { label: 'Learning Hours', value: '0' },
    { label: 'Certificates', value: '0' },
    { label: 'Community Points', value: '0' },
  ];

  const defaultSkills = ['JavaScript', 'React', 'TypeScript', 'Node.js', 'UI/UX Design', 'Python'];

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-neutral-700 hover:text-text font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-primary">
            <div className="absolute inset-0 bg-black/10"></div>
            
            {bannerPic && (
              <img
                src={bannerPic}
                alt="Profile Banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            
            {isEditing && (
              <button
                onClick={() => bannerPicInput.current?.click()}
                className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 text-neutral-800 rounded-xl text-sm font-medium hover:bg-white transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Change Banner
              </button>
            )}
            <input
              type="file"
              ref={bannerPicInput}
              onChange={handleBannerPicChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="px-6 lg:px-10 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-16 gap-6">
              <div className="flex items-end gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-primary flex items-center justify-center text-5xl font-bold text-white border-4 border-white shadow-lg overflow-hidden">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  
                  {isEditing && (
                    <button
                      onClick={() => profilePicInput.current?.click()}
                      className="absolute bottom-2 right-2 w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                  <input
                    type="file"
                    ref={profilePicInput}
                    onChange={handleProfilePicChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                <div className="pb-3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="text-3xl font-bold text-text bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-text">{user?.name}</h1>
                  )}
                  <p className="text-neutral-600 mt-1">{user?.email}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-primary rounded-full text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pro Member
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-text rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-primary hover:opacity-90 text-white rounded-xl font-medium transition-opacity"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-text rounded-xl font-medium transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => {
                        fetch('/api/auth/logout').then(() => {
                          router.push('/');
                          router.refresh();
                        });
                      }}
                      className="px-6 py-2.5 bg-white border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-xl font-medium transition-colors"
                    >
                      Log Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
                  <p className="text-2xl font-bold text-text">{stat.value}</p>
                  <p className="text-sm text-neutral-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <h2 className="text-xl font-bold text-text mb-6">About</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 block">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-700 text-sm leading-relaxed"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-neutral-700 text-sm leading-relaxed">
                      {formData.bio || 'Passionate full-stack developer with a love for creating beautiful, functional web applications. Always learning and sharing knowledge with the community.'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 block">Education Level</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-700 font-medium"
                      placeholder="Your education..."
                    />
                  ) : (
                    <p className="text-neutral-700 font-medium">
                      {formData.education || "Bachelor's Degree in Computer Science"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 block">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-700"
                      placeholder="Your location..."
                    />
                  ) : (
                    <p className="text-neutral-700">
                      {formData.location || 'San Francisco, CA'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3 block">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(formData.skills.length > 0 ? formData.skills : defaultSkills).map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 text-primary rounded-full text-sm font-medium">
                        <span>{skill}</span>
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:bg-primary/20 rounded-full p-0.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.newSkill}
                        onChange={(e) => setFormData(prev => ({ ...prev, newSkill: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                        className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        placeholder="Add a skill..."
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <h2 className="text-xl font-bold text-text mb-6">Settings Quick Links</h2>
              <div className="space-y-1">
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 text-text transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Account Settings</span>
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 text-text transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-medium">Security</span>
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 text-text transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="font-medium">Notifications</span>
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 text-text transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-medium">Privacy</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
