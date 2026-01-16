'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AppState } from '@/types/task';
import { getTodayString, isNewDay } from '@/lib/utils';

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

export function useAppState() {
  const [state, setState] = useState<AppState>(loadAppState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setState(loadAppState());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveAppState(state);
    }
  }, [state, isHydrated]);

  const needsPlanning = isNewDay(state.lastPlanningDate) && !state.isPlanningComplete;

  const completePlanning = useCallback(() => {
    const today = getTodayString();
    setState((prev) => ({
      ...prev,
      lastPlanningDate: today,
      isPlanningComplete: true,
    }));
  }, []);

  const skipPlanning = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlanningComplete: true,
    }));
  }, []);

  const resetForNewDay = useCallback(() => {
    const today = getTodayString();
    setState({
      currentDate: today,
      lastPlanningDate: state.lastPlanningDate,
      isPlanningComplete: false,
    });
  }, [state.lastPlanningDate]);

  return {
    ...state,
    isHydrated,
    needsPlanning,
    completePlanning,
    skipPlanning,
    resetForNewDay,
  };
}
