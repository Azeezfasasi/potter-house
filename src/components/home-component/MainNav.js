import React from 'react'
import Link from 'next/link'

export default function MainNav() {
  return (
    <>
      {/* Header Section */}
      <header className="relative w-full h-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop')`}}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
              </svg>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-2 sm:space-y-4">
            <p className="text-white text-sm sm:text-base font-semibold tracking-widest uppercase">
              First Time
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Registration Portal
            </h1>
          </div>

          {/* CTA Button */}
          <div className="mt-12 sm:mt-16">
            <Link href="/register" className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              Get Started
            </Link>
          </div>

          {/* Scroll Indicator */}
          <Link href="/register" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </div>
      </header>
    </>
  )
}
