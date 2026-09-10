import React, { useEffect } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { ReportProvider, useReports } from './ReportContext';
import { INITIAL_REPORTS } from '../mockData';

function TestHarness({
  onReady
}: {
  onReady: (value: {
    auth: ReturnType<typeof useAuth>;
    reports: ReturnType<typeof useReports>;
  }) => void;
}) {
  const auth = useAuth();
  const reports = useReports();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      auth.login('admin123');
    }

    onReady({ auth, reports });
  }, [auth, reports, onReady]);

  return null;
}

const renderAdminReportContext = () => {
  let latest: {
    auth: ReturnType<typeof useAuth>;
    reports: ReturnType<typeof useReports>;
  } | null = null;

  const view = render(
    <AuthProvider>
      <ReportProvider>
        <TestHarness onReady={(value) => {
          latest = value;
        }} />
      </ReportProvider>
    </AuthProvider>
  );

  return {
    view,
    getLatest: () => {
      if (!latest) {
        throw new Error('Report context has not been initialized yet');
      }
      return latest;
    }
  };
};

describe('report creation and reset behaviour', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a new active report and adds it to the user report list', async () => {
    const { getLatest } = renderAdminReportContext();

    await waitFor(() => {
      expect(getLatest().auth.isAuthenticated).toBe(true);
    });

    const created = (() => {
      let result: ReturnType<ReturnType<typeof useReports>['addReport']> | undefined;
      act(() => {
        result = getLatest().reports.addReport({
          type: 'lost',
          title: 'Blue Water Bottle',
          category: 'Other',
          description: 'Insulated bottle with a blue stripe and a sticker of a mountain.',
          color: 'Blue',
          brand: 'YETI',
          location: 'Central Quad Lawn & Benches',
          date: '2026-09-10',
          time: '09:30',
          imageUrl: 'https://example.com/bottle.jpg',
          reporterName: 'Alicia Moore'
        });
      });
      return result!;
    })();

    expect(created.id).toMatch(/^LF-2026-\d+$/);
    expect(created.status).toBe('active');

    await waitFor(() => {
      expect(getLatest().reports.reports[0].id).toBe(created.id);
      expect(getLatest().reports.myReportIds[0]).toBe(created.id);
    });
  });

  it('resets the app back to the seed dataset for admin users', async () => {
    const { getLatest } = renderAdminReportContext();

    await waitFor(() => {
      expect(getLatest().auth.isAuthenticated).toBe(true);
    });

    act(() => {
      getLatest().reports.addReport({
        type: 'found',
        title: 'Silver Key Ring',
        category: 'Keys',
        description: 'Silver key ring with three campus keys attached.',
        color: 'Silver',
        location: 'Dining Commons East',
        date: '2026-09-10',
        time: '12:00',
        reporterName: 'Sam Patel'
      });
    });

    await waitFor(() => {
      expect(getLatest().reports.reports.length).toBeGreaterThan(INITIAL_REPORTS.length);
    });

    act(() => {
      getLatest().reports.resetToDefault();
    });

    await waitFor(() => {
      expect(getLatest().reports.reports).toHaveLength(INITIAL_REPORTS.length);
      expect(getLatest().reports.myReportIds).toEqual(['LF-2026-00101', 'LF-2026-00105']);
      expect(JSON.parse(localStorage.getItem('campusfind_reports_v1') || '[]')).toHaveLength(INITIAL_REPORTS.length);
    });

    expect(JSON.parse(localStorage.getItem('campusfind_reports_v1') || '[]').map((report: { id: string }) => report.id)).toEqual(INITIAL_REPORTS.map((report) => report.id));
    expect(JSON.parse(localStorage.getItem('campusfind_my_reports_v1') || '[]')).toEqual(['LF-2026-00101', 'LF-2026-00105']);
  });
});
