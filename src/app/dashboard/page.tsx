'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

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
        setStreak(3);
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
          <p className="text-neutral-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { icon: 'home', label: 'Dashboard', path: '/dashboard' },
    { icon: 'book-open', label: 'My Courses', path: '/courses' },
    { icon: 'tool', label: 'Tools', path: '/tools' },
    { icon: 'file-text', label: 'Certificates', path: '/dashboard/certificates' },
    { icon: 'user', label: 'Profile', path: '/profile' },
    { icon: 'settings', label: 'Settings', path: '/dashboard/settings' },
  ];

  const stats = [
    { label: 'Courses Enrolled', value: '0', icon: 'book', color: 'primary' },
    { label: 'Completed Lessons', value: '0', icon: 'check-circle', color: 'success' },
    { label: 'Certificates', value: '0', icon: 'award', color: 'info' },
    { label: 'Learning Hours', value: '0', icon: 'clock', color: 'warning' },
  ];

  const courses = [
    { 
      id: '1', 
      name: 'Advanced Web Development', 
      instructor: 'John Smith', 
      progress: 0, 
      duration: '24h', 
      category: 'Development', 
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
      slug: 'advanced-web-dev'
    },
    { 
      id: '2', 
      name: 'UI/UX Design Fundamentals', 
      instructor: 'Sarah Johnson', 
      progress: 0, 
      duration: '16h', 
      category: 'Design', 
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',
      slug: 'ui-ux-fundamentals'
    },
  ];

  const achievements = [
    { id: '1', title: 'Welcome to TBS!', icon: 'star', date: 'Today' },
    { id: '2', title: 'First Login', icon: 'heart', date: 'Today' },
  ];

  const activity = [
    { id: '1', action: 'Account Created', item: 'Welcome to TBS! 🎉', time: 'Just now' },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-neutral-200 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="text-xl font-bold text-text">TBS Academy</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${pathname === item.path 
                  ? 'bg-secondary text-primary' 
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-text'}
              `}
            >
              <span className={`
                w-5 h-5 flex items-center justify-center
                ${pathname === item.path ? 'text-primary' : 'text-neutral-500 group-hover:text-neutral-700'}
              `}>
                {item.icon === 'home' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                )}
                {item.icon === 'book-open' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                )}
                {item.icon === 'tool' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>
                  </svg>
                )}
                {item.icon === 'file-text' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                )}
                {item.icon === 'user' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
                {item.icon === 'settings' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1-1.51V3a2 2 0 0 1 2-2h3.86a2 2 0 0 1 1.82.33l.06.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0-.33-1.82V9a1.65 1.65 0 0 0 1.51-1H21a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                )}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-200">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 text-neutral-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link 
                href="/" 
                className="flex items-center gap-2 text-neutral-700 hover:text-text font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </Link>
              <div className="relative flex-1 max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search courses, lessons, resources..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border-0 rounded-xl text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-8">
          <div className="bg-gradient-primary rounded-2xl p-6 lg:p-8 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-2xl font-bold text-primary">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-secondary/90 mb-4">
                    You're on a {streak}-day learning streak. Keep it up!
                  </p>
                  <div className="flex items-center gap-2 text-sm text-secondary/90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span>Streak Champion!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`
                    p-2.5 rounded-xl
                    ${stat.color === 'primary' && 'bg-secondary text-primary'}
                    ${stat.color === 'success' && 'bg-green-100 text-green-600'}
                    ${stat.color === 'info' && 'bg-blue-100 text-blue-600'}
                    ${stat.color === 'warning' && 'bg-yellow-100 text-yellow-600'}
                  `}>
                    {stat.icon === 'book' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                    {stat.icon === 'check-circle' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {stat.icon === 'award' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="8" r="6"/>
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                      </svg>
                    )}
                    {stat.icon === 'clock' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-text">{stat.value}</p>
                  <p className="text-sm text-neutral-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-text">Continue Learning</h2>
                  <Link href="/courses" className="text-primary hover:text-accent text-sm font-medium">
                    Browse Courses →
                  </Link>
                </div>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <Link key={course.id} href={`/courses/${course.slug}`} className="flex gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors group">
                      <img 
                        src={course.image} 
                        alt={course.name} 
                        className="w-28 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className="font-semibold text-text line-clamp-1">{course.name}</h3>
                          <span className="text-xs font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full flex-shrink-0">
                            {course.category}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mb-3">{course.instructor} • {course.duration}</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-600 font-medium">{course.progress}% Complete</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-primary rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <button className="self-center px-4 py-2 bg-primary hover:opacity-90 text-white rounded-xl text-sm font-medium transition-opacity">
                        Start Learning
                      </button>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                <h2 className="text-xl font-bold text-text mb-6">Recent Activity</h2>
                <div className="space-y-5">
                  {activity.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </div>
                      <div className="pb-5">
                        <p className="text-text">
                          <span className="font-medium">{item.action}</span> {item.item}
                        </p>
                        <p className="text-sm text-neutral-600 mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                <h2 className="text-xl font-bold text-text mb-6">Achievements</h2>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 border border-secondary/50">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-xl">
                        {achievement.icon === 'star' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                          </svg>
                        )}
                        {achievement.icon === 'heart' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-text">{achievement.title}</p>
                        <p className="text-xs text-neutral-600">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                <h2 className="text-xl font-bold text-text mb-6">Quick Links</h2>
                <div className="space-y-1">
                  <Link href="/courses" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 text-text transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-medium">Browse Courses</span>
                  </Link>
                  <Link href="/tools" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 text-text transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />
                    </svg>
                    <span className="font-medium">Use Tools</span>
                  </Link>
                  <Link href="/blog" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 text-text transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2v1m2 13a2 2 0 002-2v-6a2 2 0 00-2-2h-1" />
                    </svg>
                    <span className="font-medium">Read Blog</span>
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 text-text transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="font-medium">View Profile</span>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
