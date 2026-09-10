import React, { useEffect, useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactModal } from './ContactModal';
import { ReportMatchModal } from './ReportMatchModal';
import { ReportProvider } from '../context/ReportContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { INITIAL_REPORTS } from '../mockData';

const reportA = INITIAL_REPORTS[0];
const reportB = INITIAL_REPORTS[1];
const candidateA = INITIAL_REPORTS[1];
const candidateB = INITIAL_REPORTS[3];

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      auth.login('admin123');
    }
  }, [auth]);

  return <>{children}</>;
};

const renderWithProvider = (ui: React.ReactElement) =>
  render(
    <AuthProvider>
      <AuthGate>
        <ReportProvider>{ui}</ReportProvider>
      </AuthGate>
    </AuthProvider>
  );

describe('modal accessibility', () => {
  it('exposes contact modal semantics and closes on Escape', () => {
    const onClose = vi.fn();

    renderWithProvider(
      <ContactModal report={reportA} isOpen={true} onClose={onClose} />
    );

    const dialog = screen.getByRole('dialog', { name: /reporter/i });
    expect(dialog).toBeTruthy();

    const input = screen.getByRole('textbox', { name: /message to reporter/i }) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(document.activeElement).toBe(input);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('exposes report match dialog semantics and keeps current candidate selected', () => {
    const onClose = vi.fn();

    renderWithProvider(
      <ReportMatchModal
        currentReport={reportA}
        candidateReport={reportB}
        isOpen={true}
        onClose={onClose}
      />
    );

    const dialog = screen.getByRole('dialog', { name: /report possible match/i });
    expect(dialog).toBeTruthy();
    expect(screen.getByLabelText(/select opposite report/i)).toBeTruthy();

    const select = screen.getByLabelText(/select opposite report/i) as HTMLSelectElement;
    expect(select.value).toBe(reportB.id);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('resets selection to the currently opened candidate and submits that candidate', () => {
    const onClose = vi.fn();

    const CandidateSequenceHarness: React.FC = () => {
      const [candidate, setCandidate] = useState(candidateA);
      const [isOpen, setIsOpen] = useState(true);

      return (
        <>
          <button type="button" onClick={() => { setCandidate(candidateA); setIsOpen(true); }}>
            Open candidate A
          </button>
          <button type="button" onClick={() => { setCandidate(candidateB); setIsOpen(true); }}>
            Open candidate B
          </button>
          <ReportMatchModal
            currentReport={reportA}
            candidateReport={candidate}
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              onClose();
            }}
          />
        </>
      );
    };

    renderWithProvider(<CandidateSequenceHarness />);

    expect((screen.getByLabelText(/select opposite report/i) as HTMLSelectElement).value).toBe(candidateA.id);

    fireEvent.click(screen.getByRole('button', { name: /open candidate a/i }));
    expect((screen.getByLabelText(/select opposite report/i) as HTMLSelectElement).value).toBe(candidateA.id);

    fireEvent.click(screen.getByRole('button', { name: /close match modal/i }));
    fireEvent.click(screen.getByRole('button', { name: /open candidate b/i }));

    const select = screen.getByLabelText(/select opposite report/i) as HTMLSelectElement;
    expect(select.value).toBe(candidateB.id);

    fireEvent.click(screen.getByRole('button', { name: /confirm possible match/i }));
    expect(screen.getByText(/match flagged successfully/i)).toBeTruthy();
  });
});
