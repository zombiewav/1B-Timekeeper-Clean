import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Ban, CheckCheck, Filter, Clock, Inbox } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { appTheme, palette } from '../theme';
import { AlarmRequestCard } from './AlarmRequestCard';
import type { AlarmRequestStatus } from '../models/alarm';

type FilterTab = 'pending' | 'approved' | 'rejected' | 'all';

export function AdminAlarmPanel() {
  const { alarmRequests, approveAlarmRequest, rejectAlarmRequest, isDark } = useApp();
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
    pending: alarmRequests.filter((r) => r.status === 'pending').length,
    approved: alarmRequests.filter((r) => r.status === 'approved').length,
    rejected: alarmRequests.filter((r) => r.status === 'rejected').length,
    all: alarmRequests.length,
  };

  const filtered = activeTab === 'all' ? alarmRequests : alarmRequests.filter((r) => r.status === activeTab);

  const handleApprove = (id: string) => {
    setActionedIds((prev) => new Set(prev).add(id));
    setTimeout(() => approveAlarmRequest(id), 350);
  };

  const handleReject = (id: string) => {
    setActionedIds((prev) => new Set(prev).add(id));
    setTimeout(() => rejectAlarmRequest(id), 350);
  };

  return (
    <div className="w-full" style={{ marginTop: 18 }}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.surfaceBackground }}
      >
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <p className="text-sm font-semibold" style={{ color: colors.text }}>
            Alarm Requests
          </p>
          <p className="text-xs mt-1" style={{ color: colors.faintText }}>
            Approve or reject pending alarm requests
          </p>
        </div>

        <div className="flex gap-1 rounded-none p-1" style={{ backgroundColor: colors.tabStripBackground }}>
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

        <div className="px-4 py-4">
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
                  No alarm requests here
                </p>
                <p className="text-xs mt-1" style={{ color: colors.faintText }}>
                  {activeTab === 'pending' ? 'All caught up! No pending requests.' : `No ${activeTab} requests yet.`}
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((req, index) => {
                  const isActioned = actionedIds.has(req.id);
                  return (
                    <div key={req.id} style={{ animationDelay: `${index * 0.04}s` }}>
                      <AlarmRequestCard
                        req={req}
                        isActioned={isActioned}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

