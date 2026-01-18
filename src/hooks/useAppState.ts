'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AppState, TaskListType } from '@/types/task';
import { getTodayString, isNewDay } from '@/lib/utils';
import { useAuth } from './useAuth';

const APP_STATE_KEY_PREFIX = 'morningtrio-app-state';

function getAppStateKey(userId: string | null): string {
  return userId ? `${APP_STATE_KEY_PREFIX}-${userId}` : APP_STATE_KEY_PREFIX;
}

function getInitialState(): AppState {
  return {
    currentDate: getTodayString(),
    activeTaskList: 'personal',
    planningState: {
      work: { lastPlanningDate: null, isPlanningComplete: false },
      personal: { lastPlanningDate: null, isPlanningComplete: false },
    },
  };
}

interface OldAppState {
  currentDate: string;
  lastPlanningDate: string | null;
  isPlanningComplete: boolean;
}

function isOldFormat(parsed: unknown): parsed is OldAppState {
  return (
    typeof parsed === 'object' &&
    parsed !== null &&
    'isPlanningComplete' in parsed &&
    !('planningState' in parsed)
  );
}

function loadAppState(userId: string | null): AppState {
  if (typeof window === 'undefined') {
    return getInitialState();
  }

  try {
    const key = getAppStateKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      const today = getTodayString();

      // Migration: Convert old format to new format
      if (isOldFormat(parsed)) {
        return {
          currentDate: today,
          activeTaskList: 'personal',
          planningState: {
            work: { lastPlanningDate: null, isPlanningComplete: false },
            personal: {
              lastPlanningDate: parsed.lastPlanningDate,
              isPlanningComplete: parsed.currentDate === today ? parsed.isPlanningComplete : false,
            },
          },
        };
      }

      // New format - reset planning completion if it's a new day
      const appState = parsed as AppState;
      if (appState.currentDate !== today) {
        return {
          currentDate: today,
          activeTaskList: appState.activeTaskList,
          planningState: {
            work: {
              lastPlanningDate: appState.planningState.work.lastPlanningDate,
              isPlanningComplete: false,
            },
            personal: {
              lastPlanningDate: appState.planningState.personal.lastPlanningDate,
              isPlanningComplete: false,
            },
          },
        };
      }
      return appState;
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

  const activeTaskList = state.activeTaskList;
  const activePlanningState = state.planningState[activeTaskList];

  const needsPlanning = isHydrated &&
    isNewDay(activePlanningState.lastPlanningDate) &&
    !activePlanningState.isPlanningComplete;

  // Check if each list needs planning (for indicator dots)
  const workNeedsPlanning = isHydrated &&
    isNewDay(state.planningState.work.lastPlanningDate) &&
    !state.planningState.work.isPlanningComplete;

  const personalNeedsPlanning = isHydrated &&
    isNewDay(state.planningState.personal.lastPlanningDate) &&
    !state.planningState.personal.isPlanningComplete;

  const setActiveTaskList = useCallback((list: TaskListType) => {
    setState((prev) => {
      const newState = { ...prev, activeTaskList: list };
      saveAppState(newState, userId);
      return newState;
    });
  }, [userId]);

  const completePlanning = useCallback(() => {
    const today = getTodayString();
    setState((prev) => {
      const newState = {
        ...prev,
        planningState: {
          ...prev.planningState,
          [prev.activeTaskList]: {
            lastPlanningDate: today,
            isPlanningComplete: true,
          },
        },
      };
      saveAppState(newState, userId);
      return newState;
    });
  }, [userId]);

  const skipPlanning = useCallback(() => {
    setState((prev) => {
      const newState = {
        ...prev,
        planningState: {
          ...prev.planningState,
          [prev.activeTaskList]: {
            ...prev.planningState[prev.activeTaskList],
            isPlanningComplete: true,
          },
        },
      };
      saveAppState(newState, userId);
      return newState;
    });
  }, [userId]);

  const resetForNewDay = useCallback(() => {
    const today = getTodayString();
    setState((prev) => {
      const newState = {
        ...prev,
        currentDate: today,
        planningState: {
          work: { ...prev.planningState.work, isPlanningComplete: false },
          personal: { ...prev.planningState.personal, isPlanningComplete: false },
        },
      };
      saveAppState(newState, userId);
      return newState;
    });
  }, [userId]);

  return {
    ...state,
    isHydrated,
    needsPlanning,
    workNeedsPlanning,
    personalNeedsPlanning,
    setActiveTaskList,
    completePlanning,
    skipPlanning,
    resetForNewDay,
  };
}
