'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import type { AppState } from '@/types/task';
import { getTodayString, isNewDay } from '@/lib/utils';

const emptySubscribe = () => () => {};
let storageListeners: Array<() => void> = [];

function subscribeToStorage(callback: () => void) {
  storageListeners.push(callback);
  return () => {
    storageListeners = storageListeners.filter((l) => l !== callback);
  };
}

const APP_STATE_KEY = 'morningtrio-app-state';

function loadAppState(): AppState {
  if (typeof window === 'undefined') {
    return {
      currentDate: getTodayString(),
      lastPlanningDate: null,
      isPlanningComplete: false,
    };
  }

  try {
    const stored = localStorage.getItem(APP_STATE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AppState;
      const today = getTodayString();
      
      if (parsed.currentDate !== today) {
        return {
          currentDate: today,
          lastPlanningDate: parsed.lastPlanningDate,
          isPlanningComplete: false,
        };
      }
      return parsed;
    }
  } catch {
    // Ignore parse errors
  }

  return {
    currentDate: getTodayString(),
    lastPlanningDate: null,
    isPlanningComplete: false,
  };
}

function saveAppState(state: AppState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
  }
}

function getServerSnapshot(): AppState {
  return {
    currentDate: getTodayString(),
    lastPlanningDate: null,
    isPlanningComplete: false,
  };
}

export function useAppState() {
  const initialState = useSyncExternalStore(
    emptySubscribe,
    loadAppState,
    getServerSnapshot
  );
  
  const [state, setState] = useState<AppState>(initialState);
  
  const isHydrated = useSyncExternalStore(
    subscribeToStorage,
    () => typeof window !== 'undefined',
    () => false
  );

  const updateState = useCallback((newState: AppState) => {
    setState(newState);
    saveAppState(newState);
  }, []);

  const needsPlanning = isNewDay(state.lastPlanningDate) && !state.isPlanningComplete;

  const completePlanning = useCallback(() => {
    const today = getTodayString();
    const newState = {
      ...state,
      lastPlanningDate: today,
      isPlanningComplete: true,
    };
    updateState(newState);
  }, [state, updateState]);

  const skipPlanning = useCallback(() => {
    const newState = {
      ...state,
      isPlanningComplete: true,
    };
    updateState(newState);
  }, [state, updateState]);

  const resetForNewDay = useCallback(() => {
    const today = getTodayString();
    const newState = {
      currentDate: today,
      lastPlanningDate: state.lastPlanningDate,
      isPlanningComplete: false,
    };
    updateState(newState);
  }, [state.lastPlanningDate, updateState]);

  return {
    ...state,
    isHydrated,
    needsPlanning,
    completePlanning,
    skipPlanning,
    resetForNewDay,
  };
}
