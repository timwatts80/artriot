'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg z-50 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-200">
            Art<span style={{ color: '#f11568' }}>Riot</span>
          </Link>
          <div className="flex items-center space-x-6">
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
        </div>
      </div>
    </nav>
  );
}