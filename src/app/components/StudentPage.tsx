import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, Clock, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

const MAX_CHARS = 32;

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

export function StudentPage() {
  const { submitMessage, isDark } = useApp();
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const charsUsed = message.length;
  const charsLeft = MAX_CHARS - charsUsed;
  const isOverLimit = charsLeft < 0;
  const isNearLimit = charsLeft <= 5 && charsLeft >= 0;
  const canSubmit = message.trim().length > 0 && !isOverLimit && submitState === 'idle';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitState('sending');
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Simulate ~95% success
    if (Math.random() > 0.05) {
      submitMessage(message);
      setSubmitState('success');
      setTimeout(() => {
        setSubmitState('idle');
        setMessage('');
      }, 2600);
    } else {
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 2600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Envelope Card */}
      <div
        className="rounded-3xl overflow-hidden shadow-2xl"
        style={{
          border: `2px solid ${isDark ? '#1E3F8A' : '#003087'}`,
          boxShadow: isDark
            ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,63,138,0.4)'
            : '0 20px 60px rgba(0,48,135,0.2), 0 0 0 1px rgba(0,48,135,0.1)',
        }}
      >
        {/* ── Envelope Header (Blue with V-fold) ── */}
        <div className="relative" style={{ backgroundColor: isDark ? '#001855' : '#003087' }}>
          {/* Header content */}
          <div className="pt-6 pb-14 px-6 flex items-center gap-3">
            <div
              className="w-13 h-13 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #FF8C00, #FF6B00)',
                border: '2.5px solid rgba(255,140,0,0.6)',
                width: 52,
                height: 52,
              }}
            >
              <span className="text-white font-black text-sm">BU</span>
            </div>
            <div>
              <p className="text-orange-300 text-[10px] uppercase tracking-[0.18em] leading-none mb-0.5">
                College of Science
              </p>
              <h1 className="text-white font-bold text-lg leading-tight">Clock Display</h1>
              <div className="flex items-center gap-1 mt-0.5">
                <Monitor size={10} className="text-blue-300" />
                <p className="text-blue-200 text-[11px]">To: ESP32 Clock Display</p>
              </div>
              <p className="text-blue-300 text-[9px] italic mt-1">
                Made by BSIT 1B
              </p>
            </div>
          </div>

          {/* V-fold: white/dark chevron at bottom of header */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
            style={{ height: 48 }}
          >
            <svg
              viewBox="0 0 400 48"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
              <polygon
                points="0,48 0,0 200,48 400,0 400,48"
                fill={isDark ? '#162A5C' : '#FFFFFF'}
              />
            </svg>
          </div>
        </div>

        {/* ── Letter Paper Body ── */}
        <div
          style={{
            backgroundColor: isDark ? '#162A5C' : '#FFFFFF',
          }}
        >
          {/* Textarea */}
          <div className="px-6 py-5">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              disabled={submitState === 'sending' || submitState === 'success'}
              className="w-full bg-transparent resize-none outline-none placeholder-opacity-40"
              style={{
                minHeight: 120,
                lineHeight: '1.6',
                color: isDark ? 'rgba(255,255,255,0.88)' : '#1a1a2e',
                caretColor: '#FF6B00',
                fontSize: '15px',
                fontFamily: 'Georgia, serif',
                placeholderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              }}
              maxLength={MAX_CHARS + 5}
              rows={4}
            />

            {/* Character counter */}
            <div className="flex items-center justify-end gap-1 mt-2">
              <span
                className="text-xs font-mono transition-colors"
                style={{
                  color: isOverLimit
                    ? '#ef4444'
                    : isNearLimit
                    ? '#FF6B00'
                    : isDark
                    ? 'rgba(255,255,255,0.3)'
                    : 'rgba(0,0,0,0.3)',
                }}
              >
                {charsUsed}/{MAX_CHARS}
              </span>
              {isOverLimit && (
                <span className="text-red-500 text-xs">–{Math.abs(charsLeft)}</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer / Submit Area ── */}
        <div
          className="px-6 py-4"
          style={{
            backgroundColor: isDark ? '#0F2050' : '#F7F4EC',
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,48,135,0.1)'}`,
          }}
        >
          <AnimatePresence mode="wait">
            {submitState === 'idle' && (
              <motion.button
                key="idle"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg"
                style={{
                  backgroundColor: canSubmit ? '#FF6B00' : isDark ? '#2A3F6A' : '#D1C9B8',
                  color: canSubmit ? '#fff' : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  boxShadow: canSubmit ? '0 4px 20px rgba(255,107,0,0.4)' : 'none',
                  transform: canSubmit ? undefined : undefined,
                }}
                whileHover={canSubmit ? { scale: 1.02 } : undefined}
                whileTap={canSubmit ? { scale: 0.98 } : undefined}
              >
                <Send size={16} />
                Send Message
              </motion.button>
            )}

            {submitState === 'sending' && (
              <motion.div
                key="sending"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-white"
                style={{ backgroundColor: '#003087' }}
              >
                <Loader2 size={16} className="animate-spin" />
                Sending…
              </motion.div>
            )}

            {submitState === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-white"
                style={{ backgroundColor: '#16a34a' }}
              >
                <CheckCircle size={16} />
                Message Sent!
              </motion.div>
            )}

            {submitState === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-white"
                  style={{ backgroundColor: '#dc2626' }}
                >
                  <AlertCircle size={16} />
                  Failed to send. Try again.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helper hint */}
          <p
            className="text-center text-[11px] mt-2.5"
            style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)' }}
          >
            Messages are reviewed before display
          </p>
        </div>
      </div>

      {/* Decorative envelope shadow flap */}
      <div
        className="mx-4 h-2 rounded-b-2xl"
        style={{
          backgroundColor: isDark ? '#001040' : '#C8C0B0',
          opacity: 0.6,
        }}
      />
      <div
        className="mx-8 h-1.5 rounded-b-2xl"
        style={{
          backgroundColor: isDark ? '#00092A' : '#B0A898',
          opacity: 0.4,
        }}
      />
    </motion.div>
  );
}