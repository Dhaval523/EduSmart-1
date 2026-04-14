import React from 'react'
import { motion } from 'framer-motion'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Courses', href: '#courses' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' }
]

const Navbar = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mt-4 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <a href="#home" className="text-lg font-bold tracking-tight text-[#0f172a]">
              Smart Tutor Academy
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#475467]">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-[#6C5CE7]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button className="hidden sm:inline-flex items-center rounded-full border border-[#6C5CE7]/20 bg-white px-4 py-2 text-sm font-semibold text-[#6C5CE7] shadow-sm transition hover:shadow-md">
                Sign In
              </button>
              <button className="inline-flex items-center rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#8E7CFF] px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar

