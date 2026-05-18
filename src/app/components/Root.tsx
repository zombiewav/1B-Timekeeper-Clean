import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { Moon, Sun, AlertCircle, User, Menu, X, ShieldCheck, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { APP_NAME, APP_ORGANIZATION, appTheme } from '../theme';

const SLIDES = [0, 1, 2, 3, 4];

const DEV_NOTE =
  'Our project is a multi-functional digital clock built around an ESP32 microcontroller. Through a web interface, users can send custom messages that appear wirelessly on the clock, set an alarm that triggers an audible beep, and enable motion detection that displays a welcome message when someone passes by. The clock also functions traditionally, continuously showing the current time, day, and date.';

export function Root() {
  const { isDark, toggleDark, messages } = useApp();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const colors = isDark ? appTheme.dark : appTheme.light;
  const pendingCount = messages.filter((m) => m.status === 'pending').length;
  const [activeSlide, setActiveSlide] = useState(0);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  const navLinks = ['HOME', 'CLOCK', 'WEATHER', 'CALENDAR'];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDark ? 'dark' : ''}`}
      style={{ backgroundColor: colors.pageBackground, position: 'relative', overflow: 'hidden' }}
    >
      {/* ── TOP NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-6">
        {/* Center nav links */}
        <div className="flex items-center gap-8 mx-auto">
          {navLinks.map((label) => (
            <Link
              key={label}
              to="/"
              className="text-[11px] font-bold tracking-[0.15em] transition-opacity hover:opacity-70"
              style={{ color: colors.navText }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: admin toggle */}
        <div className="ml-auto relative">
          <Link
            to={isAdmin ? '/' : '/admin'}
            className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-opacity hover:opacity-70"
            style={{ borderColor: colors.navText, color: colors.navText }}
            title={isAdmin ? 'Student view' : 'Admin panel'}
          >
            {isAdmin ? <Mail size={15} /> : <ShieldCheck size={15} />}
          </Link>
          {!isAdmin && pendingCount > 0 && (
            <span
              className="absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#E74C3C', color: '#fff' }}
            >
              {pendingCount}
            </span>
          )}
        </div>
      </nav>

      {/* ── HERO: Left panel + Right panel ── */}
      <div className="flex min-h-screen pt-14">

        {/* LEFT PANEL */}
        <div
          className="relative flex flex-col px-8 py-10 flex-shrink-0"
          style={{ width: '38%', minWidth: 260, backgroundColor: colors.leftPanel }}
        >
          {/* Vertical line divider */}
          <div
            className="absolute right-0 top-20 bottom-20 w-px"
            style={{ backgroundColor: colors.dividerLine }}
          />

          {/* BSIT 1B branding */}
          <div className="mt-8 flex-shrink-0">
            <div style={{ fontFamily: "'Impact','Arial Black','sans-serif'", lineHeight: 0.88 }}>
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="font-black uppercase select-none"
                  style={{
                    fontSize: 'clamp(1.8rem,4.5vw,3.2rem)',
                    color: colors.brandTitle,
                    WebkitTextStroke: `1.5px ${colors.brandStroke}`,
                  }}
                >
                  BSIT
                </span>
                <span
                  className="font-black select-none"
                  style={{
                    fontSize: 'clamp(1.8rem,4.5vw,3.2rem)',
                    color: colors.brandAccentTitle,
                  }}
                >
                  1B
                </span>
              </div>
              <div>
                <span
                  className="font-black uppercase block select-none"
                  style={{
                    fontSize: 'clamp(2.6rem,6.5vw,4.8rem)',
                    color: colors.brandTitle,
                    WebkitTextStroke: `1.5px ${colors.brandStroke}`,
                  }}
                >
                  TIME
                </span>
                <span
                  className="font-black uppercase block select-none"
                  style={{
                    fontSize: 'clamp(2.6rem,6.5vw,4.8rem)',
                    color: colors.brandTitle,
                    WebkitTextStroke: `1.5px ${colors.brandStroke}`,
                  }}
                >
                  KEEPER
                </span>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Stopwatch SVG */}
          <div className="flex items-end">
            <StopwatchSVG color={colors.iconColor} />
          </div>

          {/* Org label */}
          <p
            className="text-[10px] uppercase tracking-widest mt-3 opacity-50"
            style={{ color: colors.navText }}
          >
            {APP_NAME} — {APP_ORGANIZATION}
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="flex-1 relative flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: colors.rightPanel }}
        >
          {/* Glow blob */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: 0,
              background: isDark
                ? 'radial-gradient(ellipse 55% 55% at 60% 35%, rgba(134,168,207,0.14) 0%, transparent 68%)'
                : 'radial-gradient(ellipse 55% 55% at 60% 35%, rgba(255,255,255,0.3) 0%, transparent 68%)',
            }}
          />

          {/* Globe */}
          <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none select-none">
            <GlobeSVG isDark={isDark} />
          </div>

          {/* Floating hex logo */}
          <div className="relative z-10 flex flex-col items-center select-none">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="drop-shadow-2xl"
            >
              <HexBadge isDark={isDark} />
            </motion.div>
            {/* Reflection */}
            <div
              className="pointer-events-none blur-sm"
              style={{ opacity: 0.18, transform: 'scaleY(-1) translateY(-8px)', marginTop: 8 }}
            >
              <HexBadge isDark={isDark} size={140} />
            </div>
          </div>

          {/* Developer note — slide 1 */}
          <AnimatePresence>
            {activeSlide === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.35 }}
                className="absolute right-6 top-1/4 max-w-[260px] z-20"
              >
                <div
                  className="rounded-2xl p-5 shadow-2xl text-left"
                  style={{
                    backgroundColor: isDark ? 'rgba(15,32,80,0.9)' : 'rgba(255,255,255,0.88)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${isDark ? 'rgba(134,168,207,0.2)' : 'rgba(38,66,90,0.1)'}`,
                  }}
                >
                  <p className="text-[10px] font-semibold mb-1" style={{ color: colors.noteTitle }}>
                    Note from the developers,
                  </p>
                  <p className="text-[10px] italic leading-relaxed mb-3" style={{ color: colors.noteText }}>
                    {DEV_NOTE}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.noteAccent }}>
                    — BSIT 1B DEVELOPERS
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── SLIDE DOTS + RIGHT SIDEBAR ICONS ── */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2.5">
        {/* Dots */}
        <div className="flex flex-col gap-2 mb-3">
          {SLIDES.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSlide(s)}
              title={`Slide ${s + 1}`}
              style={{
                width: activeSlide === s ? 13 : 10,
                height: activeSlide === s ? 13 : 10,
                borderRadius: '50%',
                backgroundColor: activeSlide === s ? colors.dotActive : colors.dotInactive,
                border: `2px solid ${activeSlide === s ? colors.dotBorder : 'transparent'}`,
                transition: 'all 0.25s',
                outline: 'none',
              }}
            />
          ))}
        </div>

        {/* Dark/light toggle */}
        <SideIcon onClick={toggleDark} title={isDark ? 'Light mode' : 'Dark mode'} colors={colors}>
          <motion.div
            key={isDark ? 'sun' : 'moon'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </motion.div>
        </SideIcon>

        {/* Bug report */}
        <SideIcon onClick={() => {}} title="Report Bugs" colors={colors}>
          <AlertCircle size={15} />
        </SideIcon>

        {/* User / Privacy */}
        <SideIcon onClick={() => {}} title="Privacy Policy" colors={colors}>
          <User size={15} />
        </SideIcon>

        {/* Settings / hamburger */}
        <SideIcon onClick={() => setSideMenuOpen((v) => !v)} title="Settings" colors={colors}>
          {sideMenuOpen ? <X size={15} /> : <Menu size={15} />}
        </SideIcon>
      </div>

      {/* Side menu popup */}
      <AnimatePresence>
        {sideMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.22 }}
            className="fixed right-14 top-1/2 -translate-y-1/2 z-50 rounded-2xl shadow-2xl"
            style={{
              backgroundColor: isDark ? 'rgba(22,42,90,0.96)' : 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(134,168,207,0.18)' : 'rgba(38,66,90,0.1)'}`,
              minWidth: 195,
            }}
          >
            <div className="p-3">
              <p
                className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 px-2"
                style={{ color: colors.noteAccent }}
              >
                DEVELOPERS
              </p>
              {[
                { label: isDark ? 'LIGHT MODE' : 'DARK MODE', icon: isDark ? <Sun size={13}/> : <Moon size={13}/>, action: toggleDark },
                { label: 'REPORT BUGS', icon: <AlertCircle size={13}/>, action: () => {} },
                { label: 'PRIVACY POLICY', icon: <User size={13}/>, action: () => {} },
                { label: 'SETTINGS', icon: <Menu size={13}/>, action: () => {} },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-xl mb-0.5 text-[10px] font-bold uppercase tracking-wider hover:opacity-70 transition-opacity"
                  style={{ color: colors.sideMenuText }}
                >
                  <span>{item.label}</span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.sideIconBg, color: colors.sideMenuText }}
                  >
                    {item.icon}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT OVERLAY ── */}
      {/* Content pages float over the hero */}
      <div
        className="fixed inset-0 z-30 pointer-events-none"
        style={{ top: 56 }}
      >
        <div className="h-full overflow-y-auto pointer-events-auto" style={{ scrollbarWidth: 'thin' }}>
          {/* For non-home routes, show semi-transparent overlay with content */}
          {!isHome ? (
            <div
              style={{
                minHeight: '100%',
                backgroundColor: isDark ? 'rgba(11,25,41,0.93)' : 'rgba(225,195,215,0.9)',
                backdropFilter: 'blur(2px)',
              }}
            >
              <div className="max-w-2xl mx-auto w-full px-4 py-8">
                <Outlet />
              </div>
            </div>
          ) : (
            /* Home route: content sits in center-right area over the hero */
            <div className="flex justify-center items-start py-6 px-4" style={{ paddingLeft: '40%' }}>
              <div className="w-full max-w-md">
                <Outlet />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20"
        style={{ pointerEvents: 'none' }}
      >
        <p className="text-[10px] uppercase tracking-widest opacity-30" style={{ color: colors.navText }}>
          {APP_ORGANIZATION} | {APP_NAME} System
        </p>
      </div>
    </div>
  );
}

/* ── HELPERS ── */

function SideIcon({
  children, onClick, title, colors,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  colors: any;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md"
      style={{
        backgroundColor: colors.sideIconBg,
        color: colors.sideIconColor,
        border: `1.5px solid ${colors.sideIconBorder}`,
      }}
    >
      {children}
    </button>
  );
}

function StopwatchSVG({ color }: { color: string }) {
  return (
    <svg width="200" height="210" viewBox="0 0 200 210" fill="none">
      {/* Speed lines */}
      <line x1="0" y1="118" x2="42" y2="118" stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeOpacity="0.85"/>
      <line x1="0" y1="136" x2="32" y2="136" stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeOpacity="0.65"/>
      <line x1="0" y1="154" x2="22" y2="154" stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeOpacity="0.45"/>
      {/* Crown */}
      <rect x="82" y="22" width="36" height="11" rx="5" fill={color} fillOpacity="0.95"/>
      <rect x="96" y="8" width="10" height="20" rx="4" fill={color} fillOpacity="0.95"/>
      {/* Body */}
      <circle cx="108" cy="122" r="70" stroke={color} strokeWidth="7.5" strokeOpacity="0.95"/>
      {/* Hands */}
      <line x1="108" y1="122" x2="108" y2="66" stroke={color} strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="108" y1="122" x2="148" y2="122" stroke={color} strokeWidth="4.5" strokeLinecap="round"/>
      <circle cx="108" cy="122" r="6" fill={color}/>
    </svg>
  );
}

function GlobeSVG({ isDark }: { isDark: boolean }) {
  const line = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.55)';
  const dot = '#F0B429';
  const dots: [number, number][] = [
    [210, 195], [285, 178], [345, 222], [178, 262], [305, 298],
    [242, 325], [362, 278], [198, 352], [312, 240], [262, 188],
    [335, 330], [180, 302], [262, 262], [292, 200], [222, 280],
    [330, 200], [200, 230], [270, 340], [350, 260], [190, 170],
  ];
  return (
    <svg width="540" height="540" viewBox="0 0 540 540" fill="none">
      <circle cx="270" cy="270" r="245" stroke={line} strokeWidth="1.2" strokeDasharray="3 5" fill="none"/>
      {[80,130,180,230,270,310,360,410,460].map((y, i) => {
        const r = Math.sqrt(Math.max(0, 245 * 245 - (y - 270) * (y - 270)));
        return r > 5 ? <ellipse key={i} cx="270" cy={y} rx={r} ry={r * 0.28} stroke={line} strokeWidth="0.9" fill="none"/> : null;
      })}
      {[0, 25, 50, 75, 100, 130, 155].map((a, i) => (
        <ellipse key={i} cx="270" cy="270" rx="245" ry={245 * Math.abs(Math.cos(a * Math.PI / 180))} stroke={line} strokeWidth="0.9" fill="none" transform={`rotate(${a} 270 270)`}/>
      ))}
      {dots.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="3.5" fill={dot} fillOpacity="0.82"/>)}
    </svg>
  );
}

function HexBadge({ isDark, size = 220 }: { isDark: boolean; size?: number }) {
  const id = `hg${isDark ? 'd' : 'l'}${size}`;
  const bg1 = isDark ? '#2A3F70' : '#7B2060';
  const bg2 = isDark ? '#1A2A5E' : '#9B1A3A';
  const acc = isDark ? '#86A8CF' : '#E8526A';
  const txt = '#FFFFFF';
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg1}/>
          <stop offset="100%" stopColor={bg2}/>
        </linearGradient>
      </defs>
      {/* White border */}
      <polygon points="110,8 202,58 202,162 110,212 18,162 18,58" fill="white" fillOpacity="0.95"/>
      {/* Colored fill */}
      <polygon points="110,18 194,66 194,154 110,202 26,154 26,66" fill={`url(#${id})`}/>
      {/* Glow top */}
      <circle cx="110" cy="28" r="28" fill="white" fillOpacity="0.08"/>
      {/* Circuit dots */}
      <circle cx="180" cy="84" r="5" fill={acc} fillOpacity="0.9"/>
      <line x1="180" y1="89" x2="180" y2="102" stroke={acc} strokeWidth="2"/>
      <circle cx="180" cy="105" r="3" fill={acc} fillOpacity="0.6"/>
      {/* BSiT */}
      <text x="110" y="102" textAnchor="middle" fontFamily="Impact,'Arial Black',sans-serif" fontSize="38" fontWeight="900" fill={txt} letterSpacing="1">BSiT</text>
      {/* Arrow */}
      <path d="M94 118 L110 102 L126 118" stroke={acc} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="110" y1="102" x2="110" y2="132" stroke={acc} strokeWidth="4" strokeLinecap="round"/>
      {/* 1B */}
      <text x="110" y="175" textAnchor="middle" fontFamily="Impact,'Arial Black',sans-serif" fontSize="44" fontWeight="900" fill={acc} letterSpacing="2">1B</text>
    </svg>
  );
}
