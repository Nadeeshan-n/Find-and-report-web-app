import { ItemType } from '../types';

export const VALID_ITEM_TYPES: ItemType[] = ['lost', 'found'];

export const isItemType = (value: unknown): value is ItemType => {
  return typeof value === 'string' && VALID_ITEM_TYPES.includes(value as ItemType);
};

export const normalizeItemType = (
  value: string | null | undefined,
  fallback: ItemType = 'lost'
): ItemType => {
  const normalizedValue = value?.trim().toLowerCase();
  return isItemType(normalizedValue) ? normalizedValue : fallback;
};

export const normalizeItemTypeFilter = (
  value: string | null | undefined,
  fallback: ItemType | 'all' = 'all'
): ItemType | 'all' => {
  const normalizedValue = value?.trim().toLowerCase();
  return normalizedValue === 'lost' || normalizedValue === 'found' ? normalizedValue : fallback;
};
