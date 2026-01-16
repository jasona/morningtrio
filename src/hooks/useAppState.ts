'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AppState } from '@/types/task';
import { getTodayString, isNewDay } from '@/lib/utils';
import { useAuth } from './useAuth';

const APP_STATE_KEY_PREFIX = 'morningtrio-app-state';

function getAppStateKey(userId: string | null): string {
  return userId ? `${APP_STATE_KEY_PREFIX}-${userId}` : APP_STATE_KEY_PREFIX;
}

function getInitialState(): AppState {
  return {
    currentDate: getTodayString(),
    lastPlanningDate: null,
    isPlanningComplete: false,
  };
}

function loadAppState(userId: string | null): AppState {
  if (typeof window === 'undefined') {
    return getInitialState();
  }

  try {
    const key = getAppStateKey(userId);
    const stored = localStorage.getItem(key);
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

  return getInitialState();
}

function saveAppState(state: AppState, userId: string | null): void {
  if (typeof window !== 'undefined') {
    const key = getAppStateKey(userId);
    localStorage.setItem(key, JSON.stringify(state));
  }
}

export function useAppState() {
  const { userId, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<AppState>(getInitialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state when userId changes (user logs in/out)
  useEffect(() => {
    if (!authLoading) {
      const loadedState = loadAppState(userId);
      setState(loadedState);
      setIsHydrated(true);
    }
  }, [userId, authLoading]);

  const needsPlanning = isHydrated && isNewDay(state.lastPlanningDate) && !state.isPlanningComplete;

  const completePlanning = useCallback(() => {
    const today = getTodayString();
    setState((prev) => {
      const newState = {
        ...prev,
        lastPlanningDate: today,
        isPlanningComplete: true,
      };
      saveAppState(newState, userId);
      return newState;
    });
  }, [userId]);

  const skipPlanning = useCallback(() => {
    setState((prev) => {
      const newState = {
        ...prev,
        isPlanningComplete: true,
      };
      saveAppState(newState, userId);
      return newState;
    });
  }, [userId]);

  const resetForNewDay = useCallback(() => {
    const today = getTodayString();
    setState((prev) => {
      const newState = {
        currentDate: today,
        lastPlanningDate: prev.lastPlanningDate,
        isPlanningComplete: false,
      };
      saveAppState(newState, userId);
      return newState;
    });
  }, [userId]);

  return {
    ...state,
    isHydrated,
    needsPlanning,
    completePlanning,
    skipPlanning,
    resetForNewDay,
  };
}
