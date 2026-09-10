import { describe, expect, it } from 'vitest';
import { INITIAL_REPORTS, calculateMatchScore, findMatchesForReport, MATCH_SCORE_THRESHOLD } from './mockData';

const target = INITIAL_REPORTS.find(r => r.id === 'LF-2026-00101')!;
const calculator = INITIAL_REPORTS.find(r => r.id === 'LF-2026-00106')!;
const usbDrive = INITIAL_REPORTS.find(r => r.id === 'LF-2026-00107')!;
const validEarbuds = INITIAL_REPORTS.find(r => r.id === 'LF-2026-00111')!;

function getMatchFor(targetReport: typeof target, candidateId: string) {
  return findMatchesForReport(targetReport, INITIAL_REPORTS).find(match => match.matchedReport?.id === candidateId);
}

describe('match scoring', () => {
  it('keeps the valid Samsung earbuds match available', () => {
    const result = calculateMatchScore(target, validEarbuds);
    expect(result.score).toBeGreaterThanOrEqual(MATCH_SCORE_THRESHOLD);
  });

  it('rejects the calculator candidate as a weak unrelated match', () => {
    const result = calculateMatchScore(target, calculator);
    expect(result.score).toBeLessThan(MATCH_SCORE_THRESHOLD);
  });

  it('rejects the USB drive candidate as a weak unrelated match', () => {
    const result = calculateMatchScore(target, usbDrive);
    expect(result.score).toBeLessThan(MATCH_SCORE_THRESHOLD);
  });

  it('excludes returned reports from active match suggestions', () => {
    const returned = { ...calculator, status: 'returned' as const };
    const result = getMatchFor(target, returned.id);
    expect(result).toBeUndefined();
  });

  it('excludes closed reports from active match suggestions', () => {
    const closed = { ...calculator, status: 'closed' as const };
    const result = getMatchFor(target, closed.id);
    expect(result).toBeUndefined();
  });

  it('keeps a strong legitimate match above threshold', () => {
    const match = getMatchFor(target, validEarbuds.id);
    expect(match).toBeDefined();
    expect(match?.score).toBeGreaterThanOrEqual(MATCH_SCORE_THRESHOLD);
  });

  it('drops a weak unrelated match even if category and date overlap', () => {
    const weakMatch = calculateMatchScore(target, calculator);
    expect(weakMatch.score).toBeLessThan(MATCH_SCORE_THRESHOLD);
    expect(weakMatch.score).toBeLessThanOrEqual(20);
  });
});
