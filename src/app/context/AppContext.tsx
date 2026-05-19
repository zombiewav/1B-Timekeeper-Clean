import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../../lib/supabase";
import type { AlarmRequest, AlarmRequestStatus } from "../models/alarm";

export type MessageStatus = "pending" | "approved" | "rejected";

export interface Message {
  id: string;
  content: string;
  status: MessageStatus;
  timestamp: Date;
}

function toMessageStatus(row: any): MessageStatus {
  if (row.status === "approved" || row.status === "rejected" || row.status === "pending") {
    return row.status;
  }

  return row.approved ? "approved" : "pending";
}

interface AppContextType {
  messages: Message[];
  alarmRequests: AlarmRequest[];
  isDark: boolean;
  toggleDark: () => void;
  submitMessage: (content: string) => Promise<void>;
  approveMessage: (id: string) => void;
  rejectMessage: (id: string) => void;
  deleteMessage: (id: string) => void;
  submitAlarmRequest: (input: {
    title: string;
    reason: string;
    alarmTime: string;
  }) => Promise<void>;
  approveAlarmRequest: (id: string) => Promise<void>;
  rejectAlarmRequest: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [alarmRequests, setAlarmRequests] = useState<AlarmRequest[]>([]);
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => setIsDark((d) => !d);

  // ── Messages ────────────────────────────────────────────────────────────────
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetchMessages error:", error);
      return;
    }

    setMessages(
      (data ?? []).map((row: any) => ({
        id: String(row.id),
        content: String(row.content ?? ""),
        status: toMessageStatus(row),
        timestamp: new Date(row.created_at),
      })),
    );
  };

  // ── Alarms ───────────────────────────────────────────────────────────────────
  const fetchAlarmRequests = async () => {
    const { data, error } = await supabase
      .from("alarms")
      .select("id, hour, minute, label, approved, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetchAlarmRequests error:", error);
      return;
    }

    setAlarmRequests(
      (data ?? []).map((row: any) => {
        // label is stored as "title || reason" — split on separator
        const raw = String(row.label ?? "");
        const sepIdx = raw.indexOf(" || ");
        const title = sepIdx >= 0 ? raw.slice(0, sepIdx) : raw;
        const reason = sepIdx >= 0 ? raw.slice(sepIdx + 4) : "";

        const hh = String(row.hour ?? 0).padStart(2, "0");
        const mm = String(row.minute ?? 0).padStart(2, "0");

        return {
          id: String(row.id),
          title,
          reason,
          alarmTime: `${hh}:${mm}`,
          status: (row.approved ? "approved" : "pending") as AlarmRequestStatus,
          timestamp: new Date(row.created_at),
        };
      }),
    );
  };

  useEffect(() => {
    void fetchMessages();
    void fetchAlarmRequests();
  }, []);

  const submitMessage = async (content: string): Promise<void> => {
    const { error } = await supabase.from("messages").insert({
      content,
      approved: false,
      status: "pending",
      sender_name: "Anonymous",
    });

    if (error) throw new Error(error.message);
    await fetchMessages();
  };

  const approveMessage = (id: string) => {
    void (async () => {
      const { error } = await supabase
        .from("messages")
        .update({ status: "approved", approved: true })
        .eq("id", id);

      if (error) {
        console.error("approveMessage error:", error);
        return;
      }

      await fetchMessages();
    })();
  };

  const rejectMessage = (id: string) => {
    void (async () => {
      const { error } = await supabase
        .from("messages")
        .update({ status: "rejected", approved: false })
        .eq("id", id);

      if (error) {
        console.error("rejectMessage error:", error);
        return;
      }

      await fetchMessages();
    })();
  };

  const deleteMessage = (id: string) => {
    void (async () => {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("deleteMessage error:", error);
        return;
      }

      await fetchMessages();
    })();
  };

  const submitAlarmRequest = async (input: {
    title: string;
    reason: string;
    alarmTime: string;
  }): Promise<void> => {
    const [hourStr, minuteStr] = input.alarmTime.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Combine title + reason into label (device only reads hour/minute, not label)
    const label = input.reason.trim()
      ? `${input.title.trim()} || ${input.reason.trim()}`
      : input.title.trim();

    const { error } = await supabase
      .from("alarms")
      .insert({ hour, minute, label, approved: false });

    if (error) throw new Error(error.message);
    await fetchAlarmRequests();
  };

  const approveAlarmRequest = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("alarms")
      .update({ approved: true })
      .eq("id", id);

    if (error) {
      console.error("approveAlarmRequest error:", error);
      return;
    }

    await fetchAlarmRequests();
  };

  const rejectAlarmRequest = async (id: string): Promise<void> => {
    // Delete rejected alarms — they should never reach the device
    const { error } = await supabase.from("alarms").delete().eq("id", id);

    if (error) {
      console.error("rejectAlarmRequest error:", error);
      // Optimistic local fallback
      setAlarmRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "rejected" as AlarmRequestStatus } : r,
        ),
      );
      return;
    }

    await fetchAlarmRequests();
  };

  return (
    <AppContext.Provider
      value={{
        messages,
        alarmRequests,
        isDark,
        toggleDark,
        submitMessage,
        approveMessage,
        rejectMessage,
        deleteMessage,
        submitAlarmRequest,
        approveAlarmRequest,
        rejectAlarmRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

