import { Outlet, Link, useLocation } from 'react-router';
import { Moon, Sun, Mail, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

export function Root() {
  const { isDark, toggleDark, messages } = useApp();
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const pendingCount = messages.filter((m) => m.status === 'pending').length;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}
      style={{
        backgroundColor: isDark ? '#0B1F4A' : '#F4F0E6',
      }}
    >
      {/* Top Navigation */}
      <nav
        className="sticky top-0 z-50 border-b transition-colors duration-300"
        style={{
          backgroundColor: isDark ? '#07153A' : '#003087',
          borderBottomColor: isDark ? '#1A3A7A' : '#002070',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white text-xs font-black">BU</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-orange-300 text-[10px] uppercase tracking-widest leading-none">College of Science</p>
              <p className="text-white text-sm font-semibold leading-tight">Clock Display</p>
            </div>
            <p className="sm:hidden text-white text-sm font-semibold">Clock Display</p>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              to={isAdmin ? '/' : '/admin'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: isAdmin ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.1)',
                color: isAdmin ? '#FF6B00' : 'rgba(255,255,255,0.85)',
              }}
            >
              {isAdmin ? (
                <>
                  <Mail size={14} />
                  <span className="hidden sm:inline">Student</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  <span className="hidden sm:inline">Admin</span>
                  {pendingCount > 0 && (
                    <span className="bg-[#FF6B00] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </>
              )}
            </Link>

            <button
              onClick={toggleDark}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}
              aria-label="Toggle dark mode"
            >
              <motion.div
                key={isDark ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center pb-6 mt-4">
        <p
          className="text-xs"
          style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
        >
          Bicol University College of Science · ESP32 Clock Display System
        </p>
      </footer>
    </div>
  );
}