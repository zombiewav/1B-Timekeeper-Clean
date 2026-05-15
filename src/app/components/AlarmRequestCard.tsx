import { Clock, CheckCircle, XCircle, Ban } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp, type MessageStatus } from '../context/AppContext';
import { appTheme, palette, APP_NAME } from '../theme';
import type { AlarmRequest, AlarmRequestStatus } from '../models/alarm';

const toAscii = (value: string) => value.replace(/[^\x00-\x7F]/g, '');

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

type StatusStyle = { bg: string; text: string; darkBg: string; darkText: string; label: string };

const STATUS_STYLES: Record<AlarmRequestStatus, StatusStyle> = {
  pending: {
    bg: 'rgba(195,142,180,0.18)',
    text: palette.darkBlueGrey,
    darkBg: appTheme.dark.tabStripBackground,
    darkText: palette.lightBlue,
    label: 'Pending',
  },
  approved: {
    bg: 'rgba(22,163,74,0.14)',
    text: palette.approved,
    darkBg: 'rgba(22,163,74,0.18)',
    darkText: palette.approved,
    label: 'Approved',
  },
  rejected: {
    bg: 'rgba(220,38,38,0.14)',
    text: palette.rejected,
    darkBg: 'rgba(220,38,38,0.18)',
    darkText: palette.rejected,
    label: 'Rejected',
  },
};

type Props = {
  req: AlarmRequest;
  isActioned: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export function AlarmRequestCard({ req, isActioned, onApprove, onReject }: Props) {
  const { isDark } = useApp();
  const colors = isDark ? appTheme.dark : appTheme.light;
  const statusStyle = STATUS_STYLES[req.status];

  return (
    <motion.div
      key={req.id}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: isActioned ? 0.5 : 1, y: 0, scale: isActioned ? 0.97 : 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl overflow-hidden shadow-md"
      style={{ border: `1.5px solid ${colors.border}` }}
    >
      <div className="px-4 pt-3.5 pb-3" style={{ backgroundColor: colors.surfaceBackground }}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Clock size={11} style={{ color: colors.faintText }} />
            <span className="text-[11px]" style={{ color: colors.faintText }}>
              {timeAgo(req.timestamp)}
            </span>
          </div>

          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isDark ? statusStyle.darkBg : statusStyle.bg,
              color: isDark ? statusStyle.darkText : statusStyle.text,
            }}
          >
            {statusStyle.label}
          </span>
        </div>

        <div
          className="rounded-xl px-3.5 py-3 mb-3 relative overflow-hidden"
          style={{
            backgroundColor: colors.bubbleBackground,
            borderLeft: `3px solid ${
              req.status === 'pending'
                ? colors.pendingAccent
                : req.status === 'approved'
                ? palette.approved
                : palette.rejected
            }`,
          }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 19px,
                ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 19px,
                ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 20px
              )`,
            }}
          />

          <p className="relative text-sm font-semibold" style={{ color: colors.text }}>
            {toAscii(req.title)}
          </p>

          <p className="relative text-xs mt-1" style={{ color: colors.faintText }}>
            <span className="font-bold">Time:</span> {toAscii(req.alarmTime)}
          </p>


          <p
            className="relative text-sm font-medium mt-2"
            style={{
              color: colors.text,
              fontFamily: 'Georgia, serif',
              whiteSpace: 'pre-wrap',
            }}
          >
            "{toAscii(req.reason)}"
          </p>
        </div>

        {req.status === 'pending' && (
          <div className="flex gap-2">
            <motion.button
              onClick={() => onApprove(req.id)}
              disabled={isActioned}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
              style={{
                backgroundColor: isActioned ? colors.disabledAction : palette.approved,
                boxShadow: isActioned ? 'none' : '0 3px 12px rgba(22,163,74,0.35)',
              }}
            >
              <CheckCircle size={15} />
              Approve
            </motion.button>
            <motion.button
              onClick={() => onReject(req.id)}
              disabled={isActioned}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
              style={{
                backgroundColor: isActioned ? colors.disabledAction : palette.rejected,
                boxShadow: isActioned ? 'none' : '0 3px 12px rgba(220,38,38,0.3)',
              }}
            >
              <XCircle size={15} />
              Reject
            </motion.button>
          </div>
        )}

        {req.status !== 'pending' && (
          <div className="flex gap-2">
            <div
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold"
              style={{
                backgroundColor: isDark ? statusStyle.darkBg : statusStyle.bg,
                color: isDark ? statusStyle.darkText : statusStyle.text,
              }}
            >
              {req.status === 'approved' ? (
                <>
                  <CheckCircle size={14} />
                  Approved - Sent to {APP_NAME}
                </>
              ) : (
                <>
                  <Ban size={14} />
                  Rejected
                </>
              )}
            </div>

            <div className="hidden" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

