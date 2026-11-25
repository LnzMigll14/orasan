// Orasan shows every time and calendar day in Manila time. Timestamps are stored in UTC.
// Manila has no daylight saving, so a fixed +08:00 offset converts form input back to UTC.
export const TIME_ZONE = "Asia/Manila";
const MANILA_OFFSET = "+08:00";

const partsFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function manilaParts(instant: string | number | Date) {
  const parts = partsFormat.formatToParts(new Date(instant));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "00";
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute") };
}

/** The Manila calendar day (YYYY-MM-DD) for an instant. */
export function dateKey(instant: string | number | Date) {
  const { year, month, day } = manilaParts(instant);
  return `${year}-${month}-${day}`;
}

/** The Manila wall-clock time (HH:MM) for an instant. */
export function timeKey(instant: string | number | Date) {
  const { hour, minute } = manilaParts(instant);
  return `${hour}:${minute}`;
}

export function todayKey(now: number = Date.now()) {
  return dateKey(now);
}

/** Converts a Manila calendar day and time from form inputs into a UTC ISO timestamp. */
export function manilaToIso(day: string, time: string) {
  const date = new Date(`${day}T${time}:00${MANILA_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function addDays(day: string, days: number) {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

export function mondayOf(day: string) {
  const date = new Date(`${day}T00:00:00Z`);
  return addDays(day, -((date.getUTCDay() + 6) % 7));
}

const dayLabelFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  weekday: "short",
  day: "numeric",
  month: "short",
});
const shortDayFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short" });
const weekdayFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short" });
const clockTimeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatDayLabel(day: string, today: string) {
  const date = new Date(`${day}T00:00:00Z`);
  if (day === today) return `Today, ${shortDayFormat.format(date)}`;
  if (day === addDays(today, -1)) return `Yesterday, ${shortDayFormat.format(date)}`;
  return dayLabelFormat.format(date);
}

export function formatShortDay(day: string) {
  return shortDayFormat.format(new Date(`${day}T00:00:00Z`));
}

export function formatWeekday(day: string) {
  return weekdayFormat.format(new Date(`${day}T00:00:00Z`));
}

/** A range such as "5–17 Nov" or "28 Oct–3 Nov". */
export function formatDayRange(first: string, last: string) {
  if (first === last) return formatShortDay(first);
  const [, firstMonth] = first.split("-");
  const [, lastMonth] = last.split("-");
  const start = new Date(`${first}T00:00:00Z`);
  return firstMonth === lastMonth
    ? `${start.getUTCDate()}–${formatShortDay(last)}`
    : `${formatShortDay(first)}–${formatShortDay(last)}`;
}

export function formatClockTime(instant: string) {
  return clockTimeFormat.format(new Date(instant));
}

export function secondsBetween(startedAt: number, endedAt: number) {
  // A backward clock adjustment should never show a negative elapsed time.
  return Math.max(0, Math.floor((endedAt - startedAt) / 1000));
}

export function entrySeconds({ startedAt, endedAt }: { startedAt: string; endedAt: string }) {
  return secondsBetween(Date.parse(startedAt), Date.parse(endedAt));
}

/** 01:02:03 */
export function formatClock(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return [hours, minutes, remainder].map((part) => String(part).padStart(2, "0")).join(":");
}

/** 1:05 (hours:minutes) */
export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
}

/** 1.5 h */
export function formatHours(seconds: number) {
  return `${(seconds / 3600).toFixed(1)} h`;
}

/** Billable minutes for one entry after rounding (0 = round to the nearest minute). */
export function billableMinutes(seconds: number, roundingMinutes: number) {
  if (roundingMinutes > 0) return Math.ceil(seconds / 60 / roundingMinutes) * roundingMinutes;
  return Math.round(seconds / 60);
}
