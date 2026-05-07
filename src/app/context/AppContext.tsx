import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

export type MessageStatus = 'pending' | 'approved' | 'rejected';

export interface Message {
  id: string;
  content: string;
  status: MessageStatus;
  timestamp: Date;
}

interface AppContextType {
  messages: Message[];
  isDark: boolean;
  toggleDark: () => void;
  submitMessage: (content: string) => void;
  approveMessage: (id: string) => void;
  rejectMessage: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const INITIAL_MESSAGES: Message[] = [];

export function AppProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => setIsDark((d) => !d);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('fetchMessages error:', error);
      return;
    }

    const mapped: Message[] = (data ?? []).map((row: any) => ({
      id: String(row.id),
      content: String(row.content ?? ''),
      status: row.status as MessageStatus,
      timestamp: new Date(row.created_at),
    }));

    setMessages(mapped);
  };

  useEffect(() => {
    void fetchMessages();
  }, []);

  const submitMessage = (content: string) => {
    void (async () => {
      const { error } = await supabase.from('messages').insert({
        content,
        status: 'pending',
        sender_name: 'Anonymous',
      });

      if (error) {
        console.error('submitMessage error:', error);
        return;
      }

      await fetchMessages();
    })();
  };

  const approveMessage = (id: string) => {
    void (async () => {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) {
        console.error('approveMessage error:', error);
        return;
      }

      await fetchMessages();
    })();
  };

  const rejectMessage = (id: string) => {
    void (async () => {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) {
        console.error('rejectMessage error:', error);
        return;
      }

      await fetchMessages();
    })();
  };

  return (
    <AppContext.Provider
      value={{ messages, isDark, toggleDark, submitMessage, approveMessage, rejectMessage }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
