"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const Header = ({ logoUrl }: { logoUrl: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user);
        const savedProfilePic = localStorage.getItem('profilePic');
        if (savedProfilePic) setProfilePic(savedProfilePic);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = () => {
    fetch('/api/auth/logout').then(() => {
      setUser(null);
      router.push('/');
      router.refresh();
    });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 1500); // 1.5 second delay
  };

  return (
    <header className="bg-background shadow-1 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src={logoUrl} alt="TBS Logo" className="w-20" width={80} height={20} />
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`font-body font-semibold transition-colors ${isActive('/') && pathname === '/' ? 'text-primary' : 'text-text hover:text-primary'}`}
            >
              Home
            </Link>
            <Link 
              href="/courses" 
              className={`font-body font-semibold transition-colors ${isActive('/courses') ? 'text-primary' : 'text-text hover:text-primary'}`}
            >
              Courses
            </Link>
            <Link 
              href="/blog" 
              className={`font-body font-semibold transition-colors ${isActive('/blog') ? 'text-primary' : 'text-text hover:text-primary'}`}
            >
              Blog
            </Link>
            <Link 
              href="/tools" 
              className={`font-body font-semibold transition-colors ${isActive('/tools') ? 'text-primary' : 'text-text hover:text-primary'}`}
            >
              Tools
            </Link>
            <Link 
              href="/tips-tricks" 
              className={`font-body font-semibold transition-colors ${isActive('/tips-tricks') ? 'text-primary' : 'text-text hover:text-primary'}`}
            >
              Tips & Tricks
            </Link>
            <Link 
              href="/about" 
              className={`font-body font-semibold transition-colors ${isActive('/about') ? 'text-primary' : 'text-text hover:text-primary'}`}
            >
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="w-10 h-10 bg-neutral-200 rounded-full animate-pulse" />
            ) : user ? (
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all"
                >
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="font-semibold text-text">{user.name}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9,22 9,12 15,12 15,22"/>
                        </svg>
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1-1.51V3a2 2 0 0 1 2-2h3.86a2 2 0 0 1 1.82.33l.06.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0-.33-1.82V9a1.65 1.65 0 0 0 1.51-1H21a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-neutral-100 py-1">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                          if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="text-text font-semibold hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        <button 
          className="md:hidden text-text focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-neutral-200 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`font-body font-semibold py-2 transition-colors ${isActive('/') && pathname === '/' ? 'text-primary' : 'text-text hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/courses" 
              className={`font-body font-semibold py-2 transition-colors ${isActive('/courses') ? 'text-primary' : 'text-text hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              href="/blog" 
              className={`font-body font-semibold py-2 transition-colors ${isActive('/blog') ? 'text-primary' : 'text-text hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/tools" 
              className={`font-body font-semibold py-2 transition-colors ${isActive('/tools') ? 'text-primary' : 'text-text hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tools
            </Link>
            <Link 
              href="/tips-tricks" 
              className={`font-body font-semibold py-2 transition-colors ${isActive('/tips-tricks') ? 'text-primary' : 'text-text hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tips & Tricks
            </Link>
            <Link 
              href="/about" 
              className={`font-body font-semibold py-2 transition-colors ${isActive('/about') ? 'text-primary' : 'text-text hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            <div className="pt-4 border-t border-neutral-200">
              {loading ? (
                <div className="w-full h-10 bg-neutral-200 rounded animate-pulse" />
              ) : user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-3 py-2 bg-neutral-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold overflow-hidden">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-text">{user.name}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                  <Link 
                    href="/dashboard" 
                    className={`font-semibold block py-2 transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-text hover:text-primary'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className={`font-semibold block py-2 transition-colors ${isActive('/profile') ? 'text-primary' : 'text-text hover:text-primary'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/dashboard/settings" 
                    className={`font-semibold block py-2 transition-colors ${isActive('/dashboard/settings') ? 'text-primary' : 'text-text hover:text-primary'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2 border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link 
                    href="/login" 
                    className="w-full block text-center py-2 border border-primary text-primary rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="w-full block text-center py-2 bg-primary text-white rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
