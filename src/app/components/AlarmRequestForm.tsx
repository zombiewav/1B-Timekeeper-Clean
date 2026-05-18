import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { appTheme, palette, APP_NAME } from '../theme';

const toAscii = (value: string) => value.replace(/[^\x00-\x7F]/g, '');

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

const MAX_TITLE = 48;
const MAX_REASON = 180;

export function AlarmRequestForm() {
  const { submitAlarmRequest, isDark } = useApp();
  const colors = isDark ? appTheme.dark : appTheme.light;

  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [alarmTime, setAlarmTime] = useState('');

  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [error, setError] = useState<string | null>(null);

  const isValidAlarmTime = /^\d{2}:\d{2}$/.test(alarmTime);

  const canSubmit =
    title.trim().length > 0 &&
    reason.trim().length > 0 &&
    isValidAlarmTime &&
    submitState === 'idle' &&
    title.length <= MAX_TITLE &&
    reason.length <= MAX_REASON;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setSubmitState('sending');

    await new Promise((resolve) => setTimeout(resolve, 1100));

    try {
      // local mock flow: always create pending request
      submitAlarmRequest({
        title: title.trim(),
        reason: reason.trim(),
        alarmTime,
      });

      setSubmitState('success');
      setTimeout(() => {
        setSubmitState('idle');
        setTitle('');
        setReason('');
        setAlarmTime('');

      }, 2400);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to submit alarm request.');
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 2400);
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
          <div className="pt-6 pb-10 px-6 flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.16)' }}
            >
              <Clock size={20} style={{ color: 'rgba(255,255,255,0.9)' }} />
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.18em] leading-none mb-0.5"
                style={{ color: 'rgba(255,255,255,0.72)' }}
              >
                Alarm Request Approval
              </p>
              <h1 className="text-white font-bold text-lg leading-tight">{APP_NAME}</h1>
              <p className="text-[9px] italic mt-1" style={{ color: 'rgba(255,255,255,0.66)' }}>
                Submit your request — admin reviews it
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

        <form
          onSubmit={submit}
          style={{ backgroundColor: colors.surfaceBackground }}
        >
          <div className="px-6 py-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                Alarm Time
              </span>
              <div className="mt-1 flex gap-2 items-center">
                <input
                  value={alarmTime}
                  onChange={(e) => setAlarmTime(e.target.value)}
                  type="time"
                  step={60}
                  required
                  className="w-full rounded-lg px-3 py-2 outline-none transition-colors"
                  style={{
                    backgroundColor: colors.pageBackground,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                Alarm Title
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(toAscii(e.target.value))}
                placeholder="e.g. Morning Reminder"
                type="text"
                required
                maxLength={MAX_TITLE + 5}
                className="mt-1 w-full rounded-lg px-3 py-2 outline-none transition-colors"
                style={{
                  backgroundColor: colors.pageBackground,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
              />
              <div className="text-[11px] mt-1" style={{ color: colors.faintText }}>
                {title.length}/{MAX_TITLE}
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                Reason / Purpose
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(toAscii(e.target.value))}
                placeholder="Why do you need this alarm?"
                required
                rows={4}
                maxLength={MAX_REASON + 10}
                className="mt-1 w-full rounded-lg px-3 py-2 outline-none transition-colors resize-none"
                style={{
                  backgroundColor: colors.pageBackground,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
              />
              <div className="text-[11px] mt-1" style={{ color: colors.faintText }}>
                {reason.length}/{MAX_REASON}
              </div>
            </label>

          </div>

          <div
            className="px-6 py-4"
            style={{
              backgroundColor: colors.bubbleBackground,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            {error && (
              <div
                className="text-sm px-3 py-2 rounded-lg mb-3"
                style={{
                  backgroundColor: isDark ? 'rgba(220,38,38,0.18)' : 'rgba(220,38,38,0.12)',
                  color: palette.rejected,
                }}
                role="alert"
              >
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {submitState === 'idle' && (
                <motion.button
                  key="idle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  type="submit"
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
                >
                  <Send size={16} />
                  Request Alarm Approval
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
                  Submitting...
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
                  Request Sent!
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
                    style={{ backgroundColor: palette.rejected }}
                  >
                    <AlertCircle size={16} />
                    Failed to submit.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-[11px] mt-2.5" style={{ color: colors.faintText }}>
              Alarm requests require admin approval.
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

