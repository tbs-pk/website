"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const Header = ({ logoUrl }: { logoUrl: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <header className="bg-background shadow-1 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={logoUrl} alt="TBS Logo" className="w-20" width={80} height={20} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
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

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="w-20 h-10 bg-neutral-200 rounded animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className={`font-semibold transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-text hover:text-primary'}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/profile" 
                className={`font-semibold transition-colors ${isActive('/profile') ? 'text-primary' : 'text-text hover:text-primary'}`}
              >
                <span className="text-text font-medium">Hi, {user.name}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Logout
              </button>
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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-text focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
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

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-neutral-200">
              {loading ? (
                <div className="w-full h-10 bg-neutral-200 rounded animate-pulse" />
              ) : user ? (
                <div className="space-y-4">
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
                    <span className="text-text font-medium">Hi, {user.name}</span>
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2 border border-primary text-primary rounded-lg"
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
