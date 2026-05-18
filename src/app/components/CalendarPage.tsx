import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { APP_NAME, APP_ORGANIZATION, appTheme } from '../theme';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildMonthGrid(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: Array<{ day: number; inCurrentMonth: boolean; iso: string }> = [];

  for (let i = firstWeekDay - 1; i >= 0; i -= 1) {
    const day = prevMonthDays - i;
    const date = new Date(year, month - 1, day);
    cells.push({
      day,
      inCurrentMonth: false,
      iso: date.toISOString(),
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({
      day,
      inCurrentMonth: true,
      iso: date.toISOString(),
    });
  }

  while (cells.length % 7 !== 0) {
    const nextDay = cells.length - (firstWeekDay + daysInMonth) + 1;
    const date = new Date(year, month + 1, nextDay);
    cells.push({
      day: nextDay,
      inCurrentMonth: false,
      iso: date.toISOString(),
    });
  }

  return cells;
}

export function CalendarPage() {
  const { isDark } = useApp();
  const colors = isDark ? appTheme.dark : appTheme.light;
  const today = new Date();
  const [activeMonth, setActiveMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const monthLabel = activeMonth.toLocaleDateString([], {
    month: 'long',
    year: 'numeric',
  });

  const monthCells = useMemo(() => buildMonthGrid(activeMonth), [activeMonth]);

  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

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
              : 'linear-gradient(135deg, rgba(232,197,216,0.98), rgba(195,142,180,0.94))',
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.22em] mb-3"
            style={{ color: 'rgba(255,255,255,0.78)' }}
          >
            {APP_ORGANIZATION}
          </p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight">{APP_NAME} Calendar</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                A clean monthly calendar view
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.24)',
                color: '#fff',
              }}
            >
              <CalendarDays size={24} />
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-7 sm:py-7">
          <div className="flex items-center justify-between gap-3 mb-5">
            <button
              onClick={() =>
                setActiveMonth((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))
              }
              className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{
                backgroundColor: colors.bubbleBackground,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: colors.faintText }}>
                Current view
              </p>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: colors.text }}>
                {monthLabel}
              </h2>
            </div>

            <button
              onClick={() =>
                setActiveMonth((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))
              }
              className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{
                backgroundColor: colors.bubbleBackground,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div
            className="rounded-[1.6rem] overflow-hidden"
            style={{
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.cardBackground,
            }}
          >
            <div className="grid grid-cols-7">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{
                    color: colors.mutedText,
                    backgroundColor: colors.bubbleBackground,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  {day}
                </div>
              ))}

              {monthCells.map((cell) => {
                const date = new Date(cell.iso);
                const cellKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                const isToday = cellKey === todayKey;

                return (
                  <div
                    key={cell.iso}
                    className="aspect-square p-2 sm:p-3"
                    style={{ borderBottom: `1px solid ${colors.border}`, borderRight: `1px solid ${colors.border}` }}
                  >
                    <div
                      className="w-full h-full rounded-2xl flex items-start justify-end p-2 text-sm sm:text-base font-semibold"
                      style={{
                        backgroundColor: isToday
                          ? colors.actionAccent
                          : cell.inCurrentMonth
                          ? 'transparent'
                          : colors.bubbleBackground,
                        color: isToday
                          ? isDark
                            ? colors.text
                            : '#FFFFFF'
                          : cell.inCurrentMonth
                          ? colors.text
                          : colors.faintText,
                        opacity: cell.inCurrentMonth ? 1 : 0.7,
                      }}
                    >
                      {cell.day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm" style={{ color: colors.mutedText }}>
              Today: {today.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <button
              onClick={() => setActiveMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="rounded-full px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
              style={{
                backgroundColor: colors.bubbleBackground,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              Jump to Today
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
