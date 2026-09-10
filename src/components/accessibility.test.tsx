import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactModal } from './ContactModal';
import { ReportMatchModal } from './ReportMatchModal';
import { ReportProvider } from '../context/ReportContext';
import { AuthProvider } from '../context/AuthContext';
import { INITIAL_REPORTS } from '../mockData';

const reportA = INITIAL_REPORTS[0];
const reportB = INITIAL_REPORTS[1];

const renderWithProvider = (ui: React.ReactElement) =>
  render(
    <AuthProvider>
      <ReportProvider>{ui}</ReportProvider>
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
});
