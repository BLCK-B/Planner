import {expect, test, beforeEach, vi, afterAll} from 'vitest'
import {
    dateToReadableDDMM,
    daysFromToday, getNextDate,
    getTodaysDate,
    isDatePast,
    readableTimeToDate
} from '@/functions/Dates.tsx'

beforeEach(() => {
    vi.useFakeTimers();
    // 2025-05-20
    vi.setSystemTime(new Date(2025, 4, 20));
});

afterAll(() => {
    vi.useRealTimers();
});

test('daysFromToday past, present and future', () => {
    expect(daysFromToday("2025-04-20")).toBe(-30)
    expect(daysFromToday("2025-05-20")).toBe(0);
    expect(daysFromToday("2025-05-22")).toBe(2)
    vi.setSystemTime(new Date(2025, 4, 20, 10));
    expect(daysFromToday("2025-05-22")).toBe(2)
})

test('readableTimeToDate', () => {
    expect(readableTimeToDate("2025-04-20")).toBe("30 days ago");
    expect(readableTimeToDate("2025-05-18")).toBe("2 days ago");
    expect(readableTimeToDate("2025-05-19")).toBe("yesterday");

    expect(readableTimeToDate("2025-05-20")).toBe("today");

    expect(readableTimeToDate("2025-05-21")).toBe("tomorrow");
    expect(readableTimeToDate("2025-05-22")).toBe("in 2 days");
    expect(readableTimeToDate("2025-06-15")).toBe("in 26 days");
    expect(readableTimeToDate("2025-07-22")).toBe("in 2mo");
    expect(readableTimeToDate("2025-08-18")).toBe("in 3mo");
    expect(readableTimeToDate("2025-12-15")).toBe("in 6mo");
    expect(readableTimeToDate("2025-12-16")).toBe("in 7mo");
    expect(readableTimeToDate("2026-05-20")).toBe("in 1y");
    expect(readableTimeToDate("2026-06-20")).toBe("in 1y 1m");
    expect(readableTimeToDate("2027-05-15")).toBe("in 2y");
    expect(readableTimeToDate("2028-06-20")).toBe("in 3y");
});

test('isDatePast', () => {
    expect(isDatePast("2025-05-10")).toBeTruthy();

    expect(isDatePast("2025-05-20")).toBeFalsy();
    vi.setSystemTime(new Date(2025, 4, 20, 10));
    expect(isDatePast("2025-05-20")).toBeFalsy();

    expect(isDatePast("2025-06-20")).toBeFalsy();
});

test('getTodaysDate', () => {
    vi.setSystemTime(new Date(2025, 4, 20, 12));

    expect(getTodaysDate()).toBe("2025-05-20");
});

test('dateToReadableDDMM', () => {
    expect(dateToReadableDDMM(String(new Date(2025, 4, 20, 12)))).toBe("20. 5.");
});

test('getNextDate', () => {
    expect(getNextDate("2025-05-20", "week", 1)).toBe("2025-05-27");
    expect(getNextDate("2025-05-20", "two-weeks", 1)).toBe("2025-06-03");
    expect(getNextDate("2025-05-20", "month", 20)).toBe("2025-06-20");

    expect(getNextDate("2025-01-30", "month", 30)).toBe("2025-02-28");
    expect(getNextDate("2025-02-28", "month", 30)).toBe("2025-03-30");

    expect(getNextDate("2025-12-30", "week", 30)).toBe("2026-01-06");
    expect(getNextDate("2025-12-30", "month", 30)).toBe("2026-01-30");
});