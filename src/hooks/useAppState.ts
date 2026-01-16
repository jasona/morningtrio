'use client';

import { useState, useCallback } from 'react';
import type { AppState } from '@/types/task';
import { getTodayString, isNewDay } from '@/lib/utils';

const APP_STATE_KEY = 'morningtrio-app-state';

function getInitialState(): AppState {
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
  const [state, setState] = useState<AppState>(getInitialState);
  const [isHydrated] = useState(() => typeof window !== 'undefined');

  const needsPlanning = isHydrated && isNewDay(state.lastPlanningDate) && !state.isPlanningComplete;

  const completePlanning = useCallback(() => {
    const today = getTodayString();
    setState((prev) => {
      const newState = {
        ...prev,
        lastPlanningDate: today,
        isPlanningComplete: true,
      };
      saveAppState(newState);
      return newState;
    });
  }, []);

  const skipPlanning = useCallback(() => {
    setState((prev) => {
      const newState = {
        ...prev,
        isPlanningComplete: true,
      };
      saveAppState(newState);
      return newState;
    });
  }, []);

  const resetForNewDay = useCallback(() => {
    const today = getTodayString();
    setState((prev) => {
      const newState = {
        currentDate: today,
        lastPlanningDate: prev.lastPlanningDate,
        isPlanningComplete: false,
      };
      saveAppState(newState);
      return newState;
    });
  }, []);

  return {
    ...state,
    isHydrated,
    needsPlanning,
    completePlanning,
    skipPlanning,
    resetForNewDay,
  };
}
