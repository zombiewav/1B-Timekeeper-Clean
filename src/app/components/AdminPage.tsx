import { useState } from 'react';
import { CheckCircle, XCircle, Inbox, Clock, CheckCheck, Ban, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, type MessageStatus } from '../context/AppContext';

type FilterTab = 'pending' | 'approved' | 'rejected' | 'all';

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

const STATUS_STYLES: Record<MessageStatus, { bg: string; text: string; darkBg: string; label: string }> = {
  pending: { bg: '#FFF3E0', text: '#E65100', darkBg: '#2A1A00', label: 'Pending' },
  approved: { bg: '#E8F5E9', text: '#2E7D32', darkBg: '#0A1F0A', label: 'Approved' },
  rejected: { bg: '#FFEBEE', text: '#C62828', darkBg: '#1F0A0A', label: 'Rejected' },
};

export function AdminPage() {
  const { messages, approveMessage, rejectMessage, isDark } = useApp();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Admin Header Card */}
      <div
        className="rounded-3xl overflow-hidden shadow-xl mb-5"
        style={{
          border: `2px solid ${isDark ? '#1E3F8A' : '#003087'}`,
        }}
      >
        {/* Orange admin header */}
        <div
          className="relative px-6 pt-5 pb-10"
          style={{ backgroundColor: isDark ? '#7A3000' : '#FF6B00' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #003087, #001A5C)',
                border: '2.5px solid rgba(255,255,255,0.3)',
              }}
            >
              <span className="text-white font-black text-xs">BU</span>
            </div>
            <div>
              <p className="text-orange-100 text-[10px] uppercase tracking-widest leading-none mb-0.5 opacity-80">
                College of Science
              </p>
              <h1 className="text-white font-bold text-lg leading-tight">Clock Display Admin</h1>
              <p className="text-orange-100 text-[11px] opacity-70">Review & approve messages</p>
            </div>
          </div>

          {/* V-fold at bottom */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: 40 }}>
            <svg
              viewBox="0 0 400 40"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
              <polygon
                points="0,40 0,0 200,40 400,0 400,40"
                fill={isDark ? '#0B1F4A' : '#F4F0E6'}
              />
            </svg>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-3 divide-x text-center py-3"
          style={{
            backgroundColor: isDark ? '#162A5C' : '#FFFFFF',
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,48,135,0.1)'}`,
            divideColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,48,135,0.1)',
          }}
        >
          {(['pending', 'approved', 'rejected'] as const).map((key) => (
            <div
              key={key}
              className="py-1"
              style={{ borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,48,135,0.1)'}` }}
            >
              <p
                className="font-bold text-xl"
                style={{
                  color:
                    key === 'pending' ? '#FF6B00' : key === 'approved' ? '#16a34a' : '#dc2626',
                }}
              >
                {counts[key]}
              </p>
              <p
                className="text-[10px] uppercase tracking-wide capitalize"
                style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
              >
                {key}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex gap-1 rounded-2xl p-1 mb-4"
        style={{ backgroundColor: isDark ? '#162A5C' : '#E8E4D8' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              backgroundColor:
                activeTab === tab.key
                  ? isDark
                    ? '#003087'
                    : '#003087'
                  : 'transparent',
              color:
                activeTab === tab.key
                  ? '#FFFFFF'
                  : isDark
                  ? 'rgba(255,255,255,0.45)'
                  : 'rgba(0,0,0,0.45)',
              boxShadow: activeTab === tab.key ? '0 2px 8px rgba(0,48,135,0.3)' : 'none',
            }}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span
              className="text-[10px] font-bold px-1 rounded-full"
              style={{
                backgroundColor:
                  activeTab === tab.key ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                color: activeTab === tab.key ? '#fff' : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
              }}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Message List */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 rounded-3xl"
            style={{
              backgroundColor: isDark ? '#162A5C' : '#FFFFFF',
              border: `2px dashed ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,48,135,0.15)'}`,
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: isDark ? '#0F1F4A' : '#F4F0E6' }}
            >
              <Inbox size={28} style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,48,135,0.25)' }} />
            </div>
            <p
              className="font-semibold text-base"
              style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,48,135,0.4)' }}
            >
              No messages here
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}
            >
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
                  style={{
                    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,48,135,0.12)'}`,
                  }}
                >
                  {/* Message card header */}
                  <div
                    className="px-4 pt-3.5 pb-3"
                    style={{ backgroundColor: isDark ? '#162A5C' : '#FFFFFF' }}
                  >
                    {/* Top row: timestamp + status badge */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
                        <span
                          className="text-[11px]"
                          style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}
                        >
                          {timeAgo(msg.timestamp)}
                        </span>
                      </div>

                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: isDark ? statusStyle.darkBg : statusStyle.bg,
                          color: statusStyle.text,
                        }}
                      >
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* Message content */}
                    <div
                      className="rounded-xl px-3.5 py-3 mb-3 relative overflow-hidden"
                      style={{
                        backgroundColor: isDark ? '#0F1F4A' : '#F7F4EC',
                        borderLeft: `3px solid ${isDark ? '#FF6B00' : '#003087'}`,
                      }}
                    >
                      {/* Decorative lines */}
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
                          color: isDark ? 'rgba(255,255,255,0.88)' : '#1A1A2E',
                          fontFamily: 'Georgia, serif',
                        }}
                      >
                        "{msg.content}"
                      </p>
                    </div>

                    {/* Action buttons — only for pending */}
                    {msg.status === 'pending' && (
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleApprove(msg.id)}
                          disabled={isActioned}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
                          style={{
                            backgroundColor: isActioned ? '#6b7280' : '#16a34a',
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
                            backgroundColor: isActioned ? '#6b7280' : '#dc2626',
                            boxShadow: isActioned ? 'none' : '0 3px 12px rgba(220,38,38,0.3)',
                          }}
                        >
                          <XCircle size={15} />
                          Reject
                        </motion.button>
                      </div>
                    )}

                    {/* Approved/Rejected indicator */}
                    {msg.status !== 'pending' && (
                      <div
                        className="flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold"
                        style={{
                          backgroundColor: isDark ? statusStyle.darkBg : statusStyle.bg,
                          color: statusStyle.text,
                        }}
                      >
                        {msg.status === 'approved' ? (
                          <>
                            <CheckCheck size={14} />
                            Approved – Sent to Display
                          </>
                        ) : (
                          <>
                            <Ban size={14} />
                            Rejected
                          </>
                        )}
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