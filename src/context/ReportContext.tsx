import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Report, ReportStatus, Message } from '../types';
import { INITIAL_REPORTS } from '../mockData';

interface ReportContextType {
  reports: Report[];
  myReportIds: string[];
  addReport: (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => Report;
  updateReportStatus: (id: string, status: ReportStatus) => void;
  deleteReport: (id: string) => void;
  getReportById: (id: string) => Report | undefined;
  messages: Record<string, Message[]>;
  sendMessage: (reportId: string, text: string) => void;
  stats: {
    total: number;
    lost: number;
    found: number;
    returned: number;
    active: number;
  };
  resetToDefault: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const STORAGE_KEY = 'campusfind_reports_v1';
const MY_REPORTS_KEY = 'campusfind_my_reports_v1';
const MESSAGES_KEY = 'campusfind_messages_v1';

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REPORTS;
  });

  // Seed with 2 of the reports as initially "mine" so My Reports page is immediately active
  const [myReportIds, setMyReportIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(MY_REPORTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ["LF-2026-00101", "LF-2026-00105"];
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial mock messages
    return {
      "LF-2026-00101": [
        {
          id: "m1",
          reportId: "LF-2026-00101",
          sender: "reporter",
          senderName: "Marcus Vance",
          text: "Hi! Thanks for reaching out. Were the earbuds found inside or outside the case?",
          timestamp: "Yesterday, 3:45 PM"
        }
      ],
      "LF-2026-00102": [
        {
          id: "m2",
          reportId: "LF-2026-00102",
          sender: "reporter",
          senderName: "Campus Safety Desk (Officer Chen)",
          text: "Hello! This ID card was brought in from the Student Union food court. Bring another photo ID to claim it at the desk.",
          timestamp: "Today, 1:15 PM"
        }
      ]
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch {
      // ignore
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(MY_REPORTS_KEY, JSON.stringify(myReportIds));
    } catch {
      // ignore
    }
  }, [myReportIds]);

  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const addReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>): Report => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `LF-2026-${randomNum}`;
    const newReport: Report = {
      ...reportData,
      id: newId,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setReports(prev => [newReport, ...prev]);
    setMyReportIds(prev => [newId, ...prev]);
    return newReport;
  };

  const updateReportStatus = (id: string, status: ReportStatus) => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    setMyReportIds(prev => prev.filter(item => item !== id));
  };

  const getReportById = (id: string): Report | undefined => {
    return reports.find(r => r.id === id);
  };

  const sendMessage = (reportId: string, text: string) => {
    const report = reports.find(r => r.id === reportId);
    const reporterName = report ? report.reporterName : "Reporter";

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      reportId,
      sender: "user",
      senderName: "You",
      text,
      timestamp: "Just now"
    };

    setMessages(prev => {
      const existing = prev[reportId] || [];
      return { ...prev, [reportId]: [...existing, userMsg] };
    });

    // Simulated reporter auto-reply after 1 second for engaging UX
    setTimeout(() => {
      const replies = [
        `Thanks for the message! I've received your note regarding "${report?.title || 'this item'}". I will verify the details right away!`,
        `Got your message! Could you confirm if there are any distinguishing marks or serial numbers?`,
        `Thanks for contacting me. I can meet near the campus center desk or security office tomorrow afternoon.`
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];

      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        reportId,
        sender: "reporter",
        senderName: reporterName,
        text: replyText,
        timestamp: "Just now"
      };

      setMessages(prev => {
        const current = prev[reportId] || [];
        return { ...prev, [reportId]: [...current, botMsg] };
      });
    }, 1200);
  };

  const stats = useMemo(() => {
    const total = reports.length;
    const lost = reports.filter(r => r.type === 'lost').length;
    const found = reports.filter(r => r.type === 'found').length;
    const returned = reports.filter(r => r.status === 'returned').length;
    const active = reports.filter(r => r.status === 'active' || r.status === 'possible_match' || r.status === 'contacted').length;

    return { total, lost, found, returned, active };
  }, [reports]);

  const resetToDefault = () => {
    setReports(INITIAL_REPORTS);
    setMyReportIds(["LF-2026-00101", "LF-2026-00105"]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MY_REPORTS_KEY);
    localStorage.removeItem(MESSAGES_KEY);
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        myReportIds,
        addReport,
        updateReportStatus,
        deleteReport,
        getReportById,
        messages,
        sendMessage,
        stats,
        resetToDefault
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
