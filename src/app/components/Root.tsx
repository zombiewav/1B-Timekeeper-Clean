import { Outlet, Link, useLocation } from 'react-router';
import { Moon, Sun, Mail, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { APP_NAME, APP_ORGANIZATION, APP_SYSTEM_NAME, appTheme } from '../theme';
import { AppLogo } from './AppLogo';

export function Root() {
  const { isDark, toggleDark, messages } = useApp();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const colors = isDark ? appTheme.dark : appTheme.light;
  const pendingCount = messages.filter((m) => m.status === 'pending').length;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}
      style={{ backgroundColor: colors.pageBackground }}
    >
      <nav
        className="sticky top-0 z-50 border-b transition-colors duration-300"
        style={{
          backgroundColor: colors.navBackground,
          borderBottomColor: colors.navBorder,
        }}
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <AppLogo size={32} className="rounded-full shadow-md group-hover:scale-105 transition-transform" />
            <div className="hidden sm:block">
              <p
                className="text-[10px] uppercase tracking-widest leading-none"
                style={{ color: 'rgba(255,255,255,0.76)' }}
              >
                {APP_ORGANIZATION}
              </p>
              <p className="text-white text-sm font-semibold leading-tight">{APP_NAME}</p>
            </div>
            <p className="sm:hidden text-white text-sm font-semibold">{APP_NAME}</p>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={isAdmin ? '/' : '/admin'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: isAdmin
                  ? isDark
                    ? 'rgba(134,168,207,0.18)'
                    : 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.14)',
                color: isAdmin ? (isDark ? colors.brandAccent : colors.text) : 'rgba(255,255,255,0.92)',
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
                    <span
                      className="text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: isDark ? colors.brandAccent : colors.actionAccent,
                        color: isDark ? colors.text : '#FFFFFF',
                      }}
                    >
                      {pendingCount}
                    </span>
                  )}
                </>
              )}
            </Link>

            <button
              onClick={toggleDark}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{
                backgroundColor: 'rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.92)',
              }}
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

      <main className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Outlet />
      </main>

      <footer className="text-center pb-6 mt-4">
        <p className="text-xs" style={{ color: colors.faintText }}>
          {APP_ORGANIZATION} | {APP_SYSTEM_NAME}
        </p>
      </footer>
    </div>
  );
}
