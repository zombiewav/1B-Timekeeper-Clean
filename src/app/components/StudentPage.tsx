import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { APP_NAME, APP_ORGANIZATION, APP_RECIPIENT_LABEL, appTheme, palette } from '../theme';
import { AlarmRequestForm } from './AlarmRequestForm';
import { AppLogo } from './AppLogo';

const MAX_CHARS = 32;
const toAscii = (value: string) => value.replace(/[^\x00-\x7F]/g, '');

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

export function StudentPage() {
  const { submitMessage, isDark } = useApp();
  const colors = isDark ? appTheme.dark : appTheme.light;
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const charsUsed = message.length;
  const charsLeft = MAX_CHARS - charsUsed;
  const isOverLimit = charsLeft < 0;
  const isNearLimit = charsLeft <= 5 && charsLeft >= 0;
  const canSubmit = message.trim().length > 0 && !isOverLimit && submitState === 'idle';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setErrorMsg(null);
    setSubmitState('sending');
    try {
      await submitMessage(message);
      setSubmitState('success');
      setTimeout(() => {
        setSubmitState('idle');
        setMessage('');
      }, 2600);
    } catch (err: any) {
      console.error("submitMessage failed:", err);
      setErrorMsg(err?.message ?? 'Failed to send message.');
      setSubmitState('error');
      setTimeout(() => {
        setSubmitState('idle');
        setErrorMsg(null);
      }, 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      <div
        className="rounded-3xl overflow-hidden shadow-2xl"
        style={{
          border: `2px solid ${colors.brandAccent}`,
          boxShadow: colors.cardShadow,
        }}
      >
        <div className="relative" style={{ backgroundColor: colors.brandAccent }}>
          <div className="pt-6 pb-14 px-6 flex items-center gap-3">
            <AppLogo
              size={52}
              className="rounded-full shadow-lg flex-shrink-0 border-[2.5px] border-white/25"
            />
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.18em] leading-none mb-0.5"
                style={{ color: 'rgba(255,255,255,0.72)' }}
              >
                {APP_ORGANIZATION}
              </p>
              <h1 className="text-white font-bold text-lg leading-tight">{APP_NAME}</h1>
              <div className="flex items-center gap-1 mt-0.5">
                <Monitor size={10} style={{ color: 'rgba(255,255,255,0.82)' }} />
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  {APP_RECIPIENT_LABEL}
                </p>
              </div>
              <p className="text-[9px] italic mt-1" style={{ color: 'rgba(255,255,255,0.66)' }}>
                Made by BSIT 1B
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: 48 }}>
            <svg
              viewBox="0 0 400 48"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
              <polygon
                points="0,48 0,0 200,48 400,0 400,48"
                fill={colors.surfaceBackground}
              />
            </svg>
          </div>
        </div>

        <div style={{ backgroundColor: colors.surfaceBackground }}>
          <div className="px-6 py-5">
            <textarea
              value={message}
              onChange={(e) => setMessage(toAscii(e.target.value))}
              placeholder="Write your message..."
              disabled={submitState === 'sending' || submitState === 'success'}
              className="w-full bg-transparent resize-none outline-none placeholder-opacity-40"
              style={{
                minHeight: 120,
                lineHeight: '1.6',
                color: colors.text,
                caretColor: colors.actionAccent,
                fontSize: '15px',
                fontFamily: 'Georgia, serif',
              }}
              maxLength={MAX_CHARS + 5}
              rows={4}
            />

            <div className="flex items-center justify-end gap-1 mt-2">
              <span
                className="text-xs font-mono transition-colors"
                style={{
                  color: isOverLimit
                    ? palette.rejected
                    : isNearLimit
                    ? colors.actionAccent
                    : colors.faintText,
                }}
              >
                {charsUsed}/{MAX_CHARS}
              </span>
              {isOverLimit && (
                <span className="text-xs" style={{ color: palette.rejected }}>
                  -{Math.abs(charsLeft)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          className="px-6 py-4"
          style={{
            backgroundColor: colors.bubbleBackground,
            borderTop: `1px solid ${colors.border}`,
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
                  backgroundColor: canSubmit ? colors.actionAccent : colors.disabledAction,
                  color: canSubmit ? '#FFFFFF' : isDark ? 'rgba(255,255,255,0.72)' : colors.text,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  boxShadow: canSubmit
                    ? isDark
                      ? '0 6px 20px rgba(195,142,180,0.28)'
                      : '0 6px 20px rgba(134,168,207,0.35)'
                    : 'none',
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
                style={{ backgroundColor: colors.brandAccent }}
              >
                <Loader2 size={16} className="animate-spin" />
                Sending...
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
                style={{ backgroundColor: palette.approved }}
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
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-white text-xs px-4"
                  style={{ backgroundColor: palette.rejected }}
                >
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span className="text-center font-semibold leading-tight">
                    {errorMsg || 'Failed to send. Try again.'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-[11px] mt-2.5" style={{ color: colors.faintText }}>
            Messages are reviewed before display
          </p>
        </div>
      </div>

      <div
        className="mx-4 h-2 rounded-b-2xl"
        style={{
          backgroundColor: isDark ? 'rgba(0,0,0,0.32)' : 'rgba(38,66,90,0.18)',
          opacity: 0.6,
        }}
      />
      <div
        className="mx-8 h-1.5 rounded-b-2xl"
        style={{
          backgroundColor: isDark ? 'rgba(0,0,0,0.22)' : 'rgba(38,66,90,0.12)',
          opacity: 0.4,
        }}
      />

      <div className="mt-4">
        <AlarmRequestForm />
      </div>
    </motion.div>
  );
}
