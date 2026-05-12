import { useState } from 'react';
import { CheckCircle, XCircle, Inbox, Clock, CheckCheck, Ban, Filter, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, type MessageStatus } from '../context/AppContext';
import { APP_ADMIN_NAME, APP_NAME, APP_ORGANIZATION, appTheme, palette } from '../theme';
import { AppLogo } from './AppLogo';

type FilterTab = 'pending' | 'approved' | 'rejected' | 'all';

const toAscii = (value: string) => value.replace(/[^\x00-\x7F]/g, '');

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

const STATUS_STYLES: Record<
  MessageStatus,
  { bg: string; text: string; darkBg: string; darkText: string; label: string }
> = {
  pending: {
    bg: 'rgba(195,142,180,0.18)',
    text: palette.darkBlueGrey,
    darkBg: palette.darkTab,
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

export function AdminPage() {
  const { messages, approveMessage, rejectMessage, deleteMessage, isDark } = useApp();
  const colors = isDark ? appTheme.dark : appTheme.light;
  const [activeTab, setActiveTab] = useState<FilterTab>('pending');
  const [actionedIds, setActionedIds] = useState<Set<string>>(new Set());

  const tabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
    { key: 'pending', label: 'Pending', icon: <Clock size={13} /> },
    { key: 'approved', label: 'Approved', icon: <CheckCheck size={13} /> },
    { key: 'rejected', label: 'Rejected', icon: <Ban size={13} /> },
    { key: 'all', label: 'All', icon: <Filter size={13} /> },
  ];

  const counts = {
    pending: messages.filter((m) => m.status === 'pending').length,
    approved: messages.filter((m) => m.status === 'approved').length,
    rejected: messages.filter((m) => m.status === 'rejected').length,
    all: messages.length,
  };

  const filtered = activeTab === 'all' ? messages : messages.filter((m) => m.status === activeTab);

  const handleApprove = (id: string) => {
    setActionedIds((prev) => new Set(prev).add(id));
    setTimeout(() => approveMessage(id), 350);
  };

  const handleReject = (id: string) => {
    setActionedIds((prev) => new Set(prev).add(id));
    setTimeout(() => rejectMessage(id), 350);
  };

  const handleDelete = (id: string) => {
    setActionedIds((prev) => new Set(prev).add(id));
    setTimeout(() => deleteMessage(id), 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className="rounded-3xl overflow-hidden shadow-xl mb-5"
        style={{
          border: `2px solid ${colors.brandAccent}`,
          boxShadow: colors.cardShadow,
        }}
      >
        <div className="relative px-6 pt-5 pb-10" style={{ backgroundColor: colors.actionAccent }}>
          <div className="flex items-center gap-3">
            <AppLogo
              size={48}
              className="rounded-full shadow-lg flex-shrink-0 border-[2.5px] border-white/30"
            />
            <div>
              <p
                className="text-[10px] uppercase tracking-widest leading-none mb-0.5 opacity-80"
                style={{ color: isDark ? colors.text : 'rgba(255,255,255,0.9)' }}
              >
                {APP_ORGANIZATION}
              </p>
              <h1
                className="font-bold text-lg leading-tight"
                style={{ color: isDark ? colors.text : '#FFFFFF' }}
              >
                {APP_ADMIN_NAME}
              </h1>
              <p
                className="text-[11px] opacity-80"
                style={{ color: isDark ? colors.text : 'rgba(255,255,255,0.88)' }}
              >
                Review and approve messages
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: 40 }}>
            <svg
              viewBox="0 0 400 40"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
              <polygon
                points="0,40 0,0 200,40 400,0 400,40"
                fill={colors.pageBackground}
              />
            </svg>
          </div>
        </div>

        <div
          className="grid grid-cols-3 divide-x text-center py-3"
          style={{
            backgroundColor: colors.surfaceBackground,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          {(['pending', 'approved', 'rejected'] as const).map((key) => (
            <div key={key} className="py-1" style={{ borderRight: `1px solid ${colors.border}` }}>
              <p
                className="font-bold text-xl"
                style={{
                  color:
                    key === 'pending'
                      ? colors.pendingAccent
                      : key === 'approved'
                      ? palette.approved
                      : palette.rejected,
                }}
              >
                {counts[key]}
              </p>
              <p className="text-[10px] uppercase tracking-wide capitalize" style={{ color: colors.faintText }}>
                {key}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1 rounded-2xl p-1 mb-4" style={{ backgroundColor: colors.tabStripBackground }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              backgroundColor: activeTab === tab.key ? colors.pendingAccent : 'transparent',
              color:
                activeTab === tab.key
                  ? isDark
                    ? colors.text
                    : palette.darkBlueGrey
                  : colors.faintText,
              boxShadow: activeTab === tab.key ? colors.cardShadow : 'none',
            }}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span
              className="text-[10px] font-bold px-1 rounded-full"
              style={{
                backgroundColor:
                  activeTab === tab.key
                    ? isDark
                      ? 'rgba(255,255,255,0.24)'
                      : 'rgba(38,66,90,0.14)'
                    : isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(38,66,90,0.1)',
                color:
                  activeTab === tab.key
                    ? isDark
                      ? colors.text
                      : palette.darkBlueGrey
                    : colors.faintText,
              }}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {activeTab !== 'pending' && (
        <div
          className="rounded-2xl px-4 py-3 mb-4"
          style={{
            backgroundColor: colors.surfaceBackground,
            border: `1px solid ${colors.border}`,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: colors.text }}>
            History
          </p>
          <p className="text-xs mt-1" style={{ color: colors.faintText }}>
            Approved and rejected records stay here until you delete them.
          </p>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 rounded-3xl"
            style={{
              backgroundColor: colors.surfaceBackground,
              border: `2px dashed ${colors.border}`,
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: colors.bubbleBackground }}
            >
              <Inbox size={28} style={{ color: colors.faintText }} />
            </div>
            <p className="font-semibold text-base" style={{ color: colors.mutedText }}>
              No messages here
            </p>
            <p className="text-xs mt-1" style={{ color: colors.faintText }}>
              {activeTab === 'pending'
                ? 'All caught up! No pending messages.'
                : `No ${activeTab} messages yet.`}
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((msg, index) => {
              const statusStyle = STATUS_STYLES[msg.status];
              const isActioned = actionedIds.has(msg.id);

              return (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: isActioned ? 0.5 : 1, y: 0, scale: isActioned ? 0.97 : 1 }}
                  exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className="rounded-2xl overflow-hidden shadow-md"
                  style={{ border: `1.5px solid ${colors.border}` }}
                >
                  <div className="px-4 pt-3.5 pb-3" style={{ backgroundColor: colors.surfaceBackground }}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} style={{ color: colors.faintText }} />
                        <span className="text-[11px]" style={{ color: colors.faintText }}>
                          {timeAgo(msg.timestamp)}
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
                          msg.status === 'pending'
                            ? colors.pendingAccent
                            : msg.status === 'approved'
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
                      <p
                        className="relative text-sm font-medium"
                        style={{
                          color: colors.text,
                          fontFamily: 'Georgia, serif',
                        }}
                      >
                        "{toAscii(msg.content)}"
                      </p>
                    </div>

                    {msg.status === 'pending' && (
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleApprove(msg.id)}
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
                          onClick={() => handleReject(msg.id)}
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

                    {msg.status !== 'pending' && (
                      <div className="flex gap-2">
                        <div
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold"
                          style={{
                            backgroundColor: isDark ? statusStyle.darkBg : statusStyle.bg,
                            color: isDark ? statusStyle.darkText : statusStyle.text,
                          }}
                        >
                          {msg.status === 'approved' ? (
                            <>
                              <CheckCheck size={14} />
                              Approved - Sent to {APP_NAME}
                            </>
                          ) : (
                            <>
                              <Ban size={14} />
                              Rejected
                            </>
                          )}
                        </div>
                        <motion.button
                          onClick={() => handleDelete(msg.id)}
                          disabled={isActioned}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-3 rounded-xl font-semibold text-sm text-white transition-all flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: isActioned ? colors.disabledAction : colors.actionAccent,
                            boxShadow: isActioned ? 'none' : colors.cardShadow,
                          }}
                          title={`Delete ${msg.status} history`}
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Delete</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
