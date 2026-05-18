import { useEffect, useState } from 'react';
import { Clock3, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { APP_NAME, APP_ORGANIZATION, appTheme } from '../theme';

function getClockParts(now: Date) {
  return {
    time: now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
    day: now.toLocaleDateString([], { weekday: 'long' }),
    date: now.toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}

export function DigitalClockPage() {
  const { isDark } = useApp();
  const colors = isDark ? appTheme.dark : appTheme.light;
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const { time, day, date } = getClockParts(now);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      <div
        className="rounded-[2rem] overflow-hidden shadow-2xl"
        style={{
          border: `2px solid ${colors.brandAccent}`,
          boxShadow: colors.cardShadow,
          backgroundColor: colors.surfaceBackground,
        }}
      >
        <div
          className="px-6 py-6 sm:px-8 sm:py-8"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(31,58,95,0.95), rgba(15,32,80,0.98))'
              : 'linear-gradient(135deg, rgba(195,142,180,0.95), rgba(232,197,216,0.98))',
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.22em] mb-3"
            style={{ color: isDark ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.88)' }}
          >
            {APP_ORGANIZATION}
          </p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight">{APP_NAME} Clock</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.78)' }}>
                Live digital time display
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.24)',
                color: '#fff',
              }}
            >
              <Clock3 size={24} />
            </div>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <div
            className="rounded-[1.75rem] px-5 py-6 sm:px-7 sm:py-8 text-center"
            style={{
              backgroundColor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
            }}
          >
            <p
              className="font-mono font-bold tracking-[0.08em] leading-none"
              style={{
                color: colors.text,
                fontSize: 'clamp(2.25rem, 11vw, 4.9rem)',
              }}
            >
              {time}
            </p>

            <div className="mt-5 flex items-center justify-center gap-2" style={{ color: colors.mutedText }}>
              <CalendarDays size={16} />
              <span className="text-sm sm:text-base font-medium">{day}</span>
            </div>

            <p className="mt-2 text-sm sm:text-base" style={{ color: colors.faintText }}>
              {date}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className="rounded-2xl px-4 py-4"
              style={{
                backgroundColor: colors.bubbleBackground,
                border: `1px solid ${colors.border}`,
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: colors.faintText }}>
                Status
              </p>
              <p className="text-sm font-semibold" style={{ color: colors.text }}>
                Running in real time
              </p>
            </div>

            <div
              className="rounded-2xl px-4 py-4"
              style={{
                backgroundColor: colors.bubbleBackground,
                border: `1px solid ${colors.border}`,
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: colors.faintText }}>
                Refresh
              </p>
              <p className="text-sm font-semibold" style={{ color: colors.text }}>
                Updates every second
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
