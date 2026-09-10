import React, { useEffect, useRef, useState } from 'react';
import { X, Send, ShieldCheck, UserCheck } from 'lucide-react';
import { Report } from '../types';
import { useReports } from '../context/ReportContext';

interface ContactModalProps {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ report, isOpen, onClose }) => {
  const { messages, sendMessage } = useReports();
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const preferredFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
    );
    const firstFocusable =
      preferredFocusable ??
      dialogRef.current?.querySelector<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentMessages = messages[report.id] || [
    {
      id: 'initial-welcome',
      reportId: report.id,
      sender: 'reporter',
      senderName: report.reporterName,
      text: `Hello! I posted this ${report.type} report for "${report.title}". Send a message below if you have any questions or information.`,
      timestamp: 'Today'
    }
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsSubmitting(true);
    sendMessage(report.id, inputText.trim());
    setInputText('');
    setTimeout(() => {
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div
        ref={dialogRef}
        id="contact-reporter-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
        className="bg-white/80 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/40 bg-white/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-2xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="contact-modal-title" className="font-bold text-indigo-950 text-base flex items-center gap-2">
                <span>{report.reporterName}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/80 text-slate-700 font-semibold border border-white/60">
                  Reporter
                </span>
              </h3>
              <p id="contact-modal-description" className="text-xs text-slate-500 truncate max-w-xs">
                Ref: {report.title} ({report.id})
              </p>
            </div>
          </div>
          <button
            id="close-contact-modal-btn"
            type="button"
            onClick={onClose}
            aria-label="Close contact modal"
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-950 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safe Campus Tip */}
        <div className="px-6 py-2.5 bg-indigo-50/60 border-b border-indigo-100/50 flex items-center gap-2 text-xs text-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Meet in public university locations (e.g. Student Union or Library front desk) to hand over items.</span>
        </div>

        {/* Message Thread History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-white/30 min-h-[220px]">
          {currentMessages.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-400 mb-1 px-1">
                  {msg.senderName} • {msg.timestamp}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-sm shadow-indigo-300/40'
                      : 'bg-white/90 text-slate-800 border border-white/80 rounded-tl-xs shadow-xs backdrop-blur-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleSend} className="p-4 bg-white/60 backdrop-blur-md border-t border-white/40 flex items-center gap-2">
          <label htmlFor="contact-message-input" className="sr-only">
            Message to reporter
          </label>
          <input
            id="contact-message-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message or meeting inquiry..."
            className="flex-1 px-4 py-2.5 text-sm rounded-2xl bg-white/80 border border-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
            disabled={isSubmitting}
            autoFocus
          />
          <button
            id="send-message-btn"
            type="submit"
            aria-label="Send message to reporter"
            disabled={!inputText.trim() || isSubmitting}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-300/40 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
