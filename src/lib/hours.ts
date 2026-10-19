/**
 * Store-hours logic shared by the server (loaders, structured data) and the
 * client (StoreStatus refresh). Always evaluated in the store's time zone, not
 * the visitor's or the server's (Railway runs in UTC).
 */

import { addDays, formatShortDate, storeToday, type SeasonalStatus } from "./seasonal";

export const STORE_TIME_ZONE = "America/Chicago";

export type StoreHours = {
  storeOpen?: boolean | null;
  operatingHoursMonFriStart?: string | null;
  operatingHoursMonFriEnd?: string | null;
  operatingHoursSatStart?: string | null;
  operatingHoursSatEnd?: string | null;
  operatingHoursSunStart?: string | null;
  operatingHoursSunEnd?: string | null;
  /** Set by applySeasonalClosure, e.g. "Mar 6", while Saturdays are closed. */
  saturdayClosedUntil?: string | null;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Day of week (0 = Sunday) and minutes since midnight, in store time. */
export function storeLocalTime(now: Date = new Date()): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: WEEKDAYS.indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/** "08:00" -> 480. Returns null for "CLOSED", blanks, or malformed values. */
export function parseTime(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Start/end strings for a given day of week (0 = Sunday). */
export function hoursForDay(hours: StoreHours, day: number): [string | null | undefined, string | null | undefined] {
  if (day === 0) return [hours.operatingHoursSunStart, hours.operatingHoursSunEnd];
  if (day === 6) return [hours.operatingHoursSatStart, hours.operatingHoursSatEnd];
  return [hours.operatingHoursMonFriStart, hours.operatingHoursMonFriEnd];
}

/** Open right now? A manual closure (storeOpen === false) always wins. */
export function isStoreOpen(hours: StoreHours | null | undefined, now: Date = new Date()): boolean {
  if (!hours || hours.storeOpen === false) return false;
  const { day, minutes } = storeLocalTime(now);
  const [startStr, endStr] = hoursForDay(hours, day);
  const start = parseTime(startStr);
  const end = parseTime(endStr);
  if (start === null || end === null) return false;
  return minutes >= start && minutes < end;
}

/** "08:00" -> "8:00 AM" */
export function formatTime(value: string): string {
  const mins = parseTime(value);
  if (mins === null) return value;
  const h24 = Math.floor(mins / 60);
  const m = String(mins % 60).padStart(2, "0");
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return `${h12}:${m} ${suffix}`;
}

/** "8:00 AM - 5:00 PM", or "Closed" */
export function formatRange(start: string | null | undefined, end: string | null | undefined): string {
  if (parseTime(start) === null || parseTime(end) === null) return "Closed";
  return `${formatTime(start!)} - ${formatTime(end!)}`;
}

/** The coming Saturday (today, if it is Saturday), in store time. */
function upcomingSaturday(now: Date): Date {
  const today = storeToday(now);
  return addDays(today, (6 - today.getUTCDay() + 7) % 7);
}

/**
 * Store hours with the seasonal Saturday closure applied. While the coming
 * Saturday falls inside the closure, Saturday hours become CLOSED, so the
 * Open/Closed status, the Contact page and the structured data all agree.
 * Looking at the coming Saturday (not just today) means the Contact page is
 * already right on the Friday before the closure starts or ends.
 *
 * @example
 * const effective = applySeasonalClosure(settings, getSeasonalStatus(settings));
 * isStoreOpen(effective);
 */
export function applySeasonalClosure<T extends StoreHours>(
  hours: T,
  seasonal: SeasonalStatus,
  now: Date = new Date(),
): T {
  if (!seasonal.enabled) return hours;
  const saturday = upcomingSaturday(now);
  if (saturday < seasonal.closeDate || saturday >= seasonal.reopenDate) return hours;
  return {
    ...hours,
    operatingHoursSatStart: "CLOSED",
    operatingHoursSatEnd: "CLOSED",
    saturdayClosedUntil: formatShortDate(seasonal.reopenDate),
  };
}

/** Display rows for the Contact page. */
export function weeklyHours(hours: StoreHours): { label: string; value: string }[] {
  return [
    { label: "Mon-Fri", value: formatRange(hours.operatingHoursMonFriStart, hours.operatingHoursMonFriEnd) },
    {
      label: "Saturday",
      value: hours.saturdayClosedUntil
        ? `Closed until ${hours.saturdayClosedUntil}`
        : formatRange(hours.operatingHoursSatStart, hours.operatingHoursSatEnd),
    },
    { label: "Sunday", value: formatRange(hours.operatingHoursSunStart, hours.operatingHoursSunEnd) },
  ];
}
