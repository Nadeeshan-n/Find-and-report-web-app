import test from 'node:test';
import assert from 'node:assert/strict';
import { isItemType, normalizeItemType, normalizeItemTypeFilter } from './reportType';

test('accepts valid item types', () => {
  assert.equal(isItemType('lost'), true);
  assert.equal(isItemType('found'), true);
  assert.equal(normalizeItemType('lost', 'found'), 'lost');
  assert.equal(normalizeItemType('found', 'lost'), 'found');
});

test('rejects invalid runtime values', () => {
  assert.equal(isItemType('banana'), false);
  assert.equal(isItemType(''), false);
  assert.equal(normalizeItemType('banana', 'lost'), 'lost');
  assert.equal(normalizeItemType('', 'found'), 'found');
  assert.equal(normalizeItemTypeFilter('banana', 'all'), 'all');
  assert.equal(normalizeItemTypeFilter('', 'all'), 'all');
});

test('keeps valid filter values intact', () => {
  assert.equal(normalizeItemTypeFilter('lost', 'all'), 'lost');
  assert.equal(normalizeItemTypeFilter('found', 'all'), 'found');
  assert.equal(normalizeItemTypeFilter('LOST', 'all'), 'lost');
});
