import { LostItem, ClaimStatus } from '../types/item';

const KEY = 'LOST_AND_FOUND_DATA_v2';

export function getItems(): LostItem[] {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function addItem(item: Omit<LostItem, 'id'>): void {
  const items = getItems();
  items.push({ ...item, id: Date.now().toString() });
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function updateItemStatus(id: string, status: ClaimStatus): void {
  const items = getItems();
  const target = items.find(i => i.id === id);
  if (target) {
    target.status = status;
    localStorage.setItem(KEY, JSON.stringify(items));
  }
}

export function deleteItem(id: string): void {
  const items = getItems();
  const filtered = items.filter(i => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(filtered));
}