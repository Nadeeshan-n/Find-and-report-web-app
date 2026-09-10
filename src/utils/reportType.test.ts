import { describe, expect, it } from 'vitest';
import { isItemType, normalizeItemType, normalizeItemTypeFilter } from './reportType';

describe('report type normalization', () => {
  it('accepts valid item types', () => {
    expect(isItemType('lost')).toBe(true);
    expect(isItemType('found')).toBe(true);
    expect(normalizeItemType('lost', 'found')).toBe('lost');
    expect(normalizeItemType('found', 'lost')).toBe('found');
  });

  it('rejects invalid runtime values', () => {
    expect(isItemType('banana')).toBe(false);
    expect(isItemType('')).toBe(false);
    expect(normalizeItemType('banana', 'lost')).toBe('lost');
    expect(normalizeItemType('', 'found')).toBe('found');
    expect(normalizeItemTypeFilter('banana', 'all')).toBe('all');
    expect(normalizeItemTypeFilter('', 'all')).toBe('all');
  });

  it('keeps valid filter values intact', () => {
    expect(normalizeItemTypeFilter('lost', 'all')).toBe('lost');
    expect(normalizeItemTypeFilter('found', 'all')).toBe('found');
    expect(normalizeItemTypeFilter('LOST', 'all')).toBe('lost');
  });
});
