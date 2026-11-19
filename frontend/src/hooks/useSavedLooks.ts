import { useState, useCallback } from 'react';
import { SavedLook } from '../types';

const STORAGE_KEY = 'vastraai_saved_looks';

function loadFromStorage(): SavedLook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedLook[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(looks: SavedLook[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(looks));
  } catch {
    // ignore storage quota errors
  }
}

export function useSavedLooks() {
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(loadFromStorage);

  const saveLook = useCallback((look: Omit<SavedLook, 'id' | 'savedAt'>) => {
    const newLook: SavedLook = {
      ...look,
      id: `look-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      savedAt: new Date().toISOString(),
    };
    setSavedLooks(prev => {
      const updated = [newLook, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeLook = useCallback((id: string) => {
    setSavedLooks(prev => {
      const updated = prev.filter(l => l.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSavedLooks([]);
    saveToStorage([]);
  }, []);

  return { savedLooks, saveLook, removeLook, clearAll };
}
