'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg z-50 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-200" onClick={closeMobileMenu}>
            Art<span style={{ color: '#f11568' }}>Riot</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`transition-colors ${
                pathname === '/' ? 'text-white font-medium' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/register/art-meditation" 
              className={`transition-colors ${
                pathname.includes('/register') && !pathname.includes('/in-person') ? 'text-white font-medium' : 'text-gray-300 hover:text-white'
              }`}
            >
              Virtual Events
            </Link>
            <Link 
              href="/in-person-events" 
              className={`transition-colors ${
                pathname === '/in-person-events' || pathname.includes('/register/in-person') ? 'text-white font-medium' : 'text-gray-300 hover:text-white'
              }`}
            >
              In-Person Events
            </Link>
            <Link 
              href="/contact" 
              className={`transition-colors ${
                pathname === '/contact' ? 'text-white font-medium' : 'text-gray-300 hover:text-white'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="pt-4 pb-2 space-y-2">
            <Link 
              href="/" 
              className={`block py-2 px-4 rounded transition-colors ${
                pathname === '/' ? 'text-white font-medium bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              href="/register/art-meditation" 
              className={`block py-2 px-4 rounded transition-colors ${
                pathname.includes('/register') && !pathname.includes('/in-person') ? 'text-white font-medium bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              onClick={closeMobileMenu}
            >
              Virtual Events
            </Link>
            <Link 
              href="/in-person-events" 
              className={`block py-2 px-4 rounded transition-colors ${
                pathname === '/in-person-events' || pathname.includes('/register/in-person') ? 'text-white font-medium bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              onClick={closeMobileMenu}
            >
              In-Person Events
            </Link>
            <Link 
              href="/contact" 
              className={`block py-2 px-4 rounded transition-colors ${
                pathname === '/contact' ? 'text-white font-medium bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}