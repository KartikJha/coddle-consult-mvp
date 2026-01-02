interface ConsultState {
  concern: string;
  supportType: 'chat' | 'video';
}


import React, { createContext, useContext, useState } from 'react';

export interface ChatSession {
  id: string;
  date: string;
  messages: Array<{
    id: string;
    text: string;
    sender: 'user' | 'system' | 'clinician';
  }>;
}

interface ConsultContextType {
  concern: string;
  supportType: 'chat' | 'video';
  history: ChatSession[];
  setConcern: (c: string) => void;
  setSupportType: (t: 'chat' | 'video') => void;
  addToHistory: (session: ChatSession) => void;
  reset: () => void;
}

const ConsultContext = createContext<ConsultContextType | null>(null);

export const ConsultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [concern, setConcern] = useState('');
  const [supportType, setSupportType] = useState<'chat' | 'video'>('chat');
  const [history, setHistory] = useState<ChatSession[]>([]);

  const addToHistory = (session: ChatSession) => {
    setHistory((prev) => {
      const newHistory = [session, ...prev];
      return newHistory.slice(0, 5); // Keep only last 5
    });
  };

  const reset = () => {
    setConcern('');
    setSupportType('chat');
  };

  return (
    <ConsultContext.Provider
      value={{ concern, supportType, history, setConcern, setSupportType, addToHistory, reset }}
    >
      {children}
    </ConsultContext.Provider>
  );
};

export const useConsult = () => {
  const ctx = useContext(ConsultContext);
  if (!ctx) throw new Error('useConsult must be used within ConsultProvider');
  return ctx;
};
