import { generateId, formatDate, getTodayString, isNewDay } from './utils';

describe('generateId', () => {
  it('returns a valid UUID string', () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('returns unique IDs on each call', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });
});

describe('formatDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    const date = new Date('2026-01-15T10:30:00Z');
    expect(formatDate(date)).toBe('2026-01-15');
  });

  it('handles single-digit months and days with zero padding', () => {
    const date = new Date('2026-03-05T00:00:00Z');
    expect(formatDate(date)).toBe('2026-03-05');
  });
});

describe('getTodayString', () => {
  it('returns today\'s date in YYYY-MM-DD format', () => {
    const today = getTodayString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('isNewDay', () => {
  it('returns true when lastDate is null', () => {
    expect(isNewDay(null)).toBe(true);
  });

  it('returns false when lastDate matches today', () => {
    const today = getTodayString();
    expect(isNewDay(today)).toBe(false);
  });

  it('returns true when lastDate is different from today', () => {
    expect(isNewDay('2020-01-01')).toBe(true);
  });
});
