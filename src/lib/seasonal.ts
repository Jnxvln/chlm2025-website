/**
 * Seasonal Saturday closure: C&H closes on Saturdays from the first Saturday
 * in November until the first Saturday in March.
 *
 * Everything here is computed at read time from the Settings row and today's
 * date in store time. Nothing is scheduled or written on a timer, so there is
 * no job that can fail to run, and the stored Saturday hours are never
 * touched (they simply don't apply while the season is active).
 *
 * This module is pure (no Prisma, no Qwik) on purpose: the public website
 * (chlm2025-website) needs the exact same rules, so it carries a verbatim
 * copy of this file. Keep the two copies identical.
 *
 * Dates are "date-only" values: a Date at 00:00 UTC that stands for a
 * calendar day in Central time. They never carry a time of day.
 */

export const SEASONAL_TIME_ZONE = 'America/Chicago';

const MS_PER_DAY = 86_400_000;

/** The four automatic website notices, in the order they happen. */
export type SeasonalNoticeKey =
  | 'upcomingClose'
  | 'closed'
  | 'upcomingReopen'
  | 'reopened';

export const SEASONAL_NOTICE_KEYS: SeasonalNoticeKey[] = [
  'upcomingClose',
  'closed',
  'upcomingReopen',
  'reopened',
];

/** Same values as the NoticeType enum used by StoreNotice. */
export type SeasonalNoticeType = 'info' | 'warning' | 'danger' | 'success';

/** Placeholders a seasonal message may contain. */
export const SEASONAL_PLACEHOLDERS = ['closeDate', 'reopenDate'] as const;
export type SeasonalPlaceholder = (typeof SEASONAL_PLACEHOLDERS)[number];

export const SEASONAL_NOTICE_META: Record<
  SeasonalNoticeKey,
  {
    label: string;
    type: SeasonalNoticeType;
    defaultMessage: string;
    /**
     * Placeholders that make sense while this notice is up. {closeDate} is
     * only allowed before the closure starts; once it has, that date is in
     * the past. {reopenDate} is never in the past while a notice shows.
     */
    placeholders: SeasonalPlaceholder[];
  }
> = {
  upcomingClose: {
    label: 'Upcoming closing',
    type: 'warning',
    defaultMessage:
      'C&H will begin closing on Saturdays starting on {closeDate}.',
    placeholders: ['closeDate', 'reopenDate'],
  },
  closed: {
    label: 'Closed on Saturdays',
    type: 'danger',
    defaultMessage: 'C&H is now closed on Saturdays until {reopenDate}.',
    placeholders: ['reopenDate'],
  },
  upcomingReopen: {
    label: 'Upcoming reopening',
    type: 'info',
    defaultMessage:
      'C&H will begin opening on Saturdays starting on {reopenDate}.',
    placeholders: ['reopenDate'],
  },
  reopened: {
    label: 'Open again',
    type: 'info',
    defaultMessage: 'C&H is now open on Saturdays for spring and summer.',
    placeholders: ['reopenDate'],
  },
};

/** The Settings columns this module reads (a structural subset). */
export type SeasonalSettings = {
  seasonalEnabled: boolean;
  /** Season year (the November's year) the date overrides were set for. */
  seasonalOverrideSeason: number | null;
  seasonalCloseDate: Date | string | null;
  seasonalReopenDate: Date | string | null;
  seasonalLeadDays: number;
  seasonalReopenedDays: number;
  seasonalMsgUpcomingClose: string | null;
  seasonalMsgClosed: string | null;
  seasonalMsgUpcomingReopen: string | null;
  seasonalMsgReopened: string | null;
  /** Entries like "2026:closed": that notice is hidden for that season only. */
  seasonalHiddenNotices: string[];
};

export type SeasonalNotice = {
  key: SeasonalNoticeKey;
  label: string;
  type: SeasonalNoticeType;
  /** Message with placeholders filled in. */
  message: string;
  /** Last calendar day this notice shows (inclusive). */
  lastDay: Date;
};

export type SeasonalWindow = {
  key: SeasonalNoticeKey;
  /** First day shown (inclusive). */
  start: Date;
  /** Day after the last day shown (exclusive). */
  end: Date;
  hidden: boolean;
};

export type SeasonalStatus = {
  enabled: boolean;
  /** Year of the November that starts the season being shown. */
  season: number;
  closeDate: Date;
  reopenDate: Date;
  /** The usual (computed) dates for this season, before any override. */
  usualCloseDate: Date;
  usualReopenDate: Date;
  /** True from the close date up to (not including) the reopen date. */
  saturdaysClosed: boolean;
  /** The one notice the website should show today, if any. */
  notice: SeasonalNotice | null;
  /** All four notice windows for this season, for timelines and previews. */
  windows: SeasonalWindow[];
  today: Date;
};

// ---------------------------------------------------------------------------
// Date-only helpers
// ---------------------------------------------------------------------------

/**
 * Today's calendar date in store time, as a date-only value.
 *
 * @example
 * storeToday(new Date('2026-10-20T03:00:00Z')); // 2026-10-19 (still the 19th in Texas)
 */
export function storeToday(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SEASONAL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  return new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
}

/** Add whole days to a date-only value. */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/** Whole days from `a` to `b` (b - a). */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/**
 * Parse a stored or submitted date (Date or "YYYY-MM-DD") into a date-only
 * value. Returns null for empty or invalid input.
 */
export function toDateOnly(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const d =
    typeof value === 'string'
      ? new Date(`${value.slice(0, 10)}T00:00:00Z`)
      : new Date(value);
  if (isNaN(d.getTime())) return null;
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

/** "YYYY-MM-DD" for a date-only value (the format of `<input type="date">`). */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Short display date, e.g. "Nov 7".
 *
 * @example
 * formatShortDate(new Date('2026-11-07T00:00:00Z')); // "Nov 7"
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * First Saturday of a month, as a date-only value.
 *
 * @param month 0-based (10 = November, 2 = March)
 * @example
 * firstSaturday(2026, 10); // 2026-11-07
 */
export function firstSaturday(year: number, month: number): Date {
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (6 - first.getUTCDay() + 7) % 7;
  return addDays(first, offset);
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

/** Fill {closeDate} and {reopenDate} in a seasonal message. */
export function fillSeasonalMessage(
  message: string,
  closeDate: Date,
  reopenDate: Date,
): string {
  return message
    .replace(/\{closeDate\}/g, formatShortDate(closeDate))
    .replace(/\{reopenDate\}/g, formatShortDate(reopenDate));
}

/**
 * Placeholder names in a message that aren't recognized, e.g. a typo like
 * {closedate}. These would show on the website as typed.
 *
 * @example
 * unknownPlaceholders('Closed until {reopen}.'); // ['reopen']
 */
export function unknownPlaceholders(message: string): string[] {
  const names = (message.match(/\{[^{}]*\}/g) ?? []).map((t) =>
    t.slice(1, -1),
  );
  return names.filter(
    (n) => !(SEASONAL_PLACEHOLDERS as readonly string[]).includes(n),
  );
}

/** "{closeDate} or {reopenDate}" style list of a notice's placeholders. */
export function allowedPlaceholderList(key: SeasonalNoticeKey): string {
  return SEASONAL_NOTICE_META[key].placeholders
    .map((p) => `{${p}}`)
    .join(' or ');
}

/**
 * The problem with a notice's message, as a sentence for the person editing
 * it, or null when it's fine. Catches typos ({closedate}) and placeholders
 * that don't fit the notice ({closeDate} in "Closed on Saturdays", where that
 * date has already passed). Used by both the form and the server check.
 *
 * @example
 * seasonalMessageError('closed', 'Closed until {closeDate}.');
 * // "{closeDate} will already have passed while this notice is up. Use {reopenDate}."
 */
export function seasonalMessageError(
  key: SeasonalNoticeKey,
  message: string,
): string | null {
  const allowed = allowedPlaceholderList(key);
  const unknown = unknownPlaceholders(message);
  if (unknown.length) {
    return `{${unknown[0]}} isn’t a placeholder, so it would show on the website as typed. Use ${allowed}.`;
  }
  const names = (message.match(/\{[^{}]*\}/g) ?? []).map((t) =>
    t.slice(1, -1),
  ) as SeasonalPlaceholder[];
  const misplaced = names.find(
    (n) => !SEASONAL_NOTICE_META[key].placeholders.includes(n),
  );
  if (misplaced === 'closeDate') {
    return `{closeDate} will already have passed while this notice is up. Use ${allowed}.`;
  }
  if (misplaced) {
    return `{${misplaced}} doesn’t fit this notice. Use ${allowed}.`;
  }
  return null;
}

/** True when a message uses at least one known placeholder. */
export function usesDatePlaceholder(message: string): boolean {
  return /\{(closeDate|reopenDate)\}/.test(message);
}

const MESSAGE_COLUMN: Record<SeasonalNoticeKey, keyof SeasonalSettings> = {
  upcomingClose: 'seasonalMsgUpcomingClose',
  closed: 'seasonalMsgClosed',
  upcomingReopen: 'seasonalMsgUpcomingReopen',
  reopened: 'seasonalMsgReopened',
};

/** The stored message for a notice, or its default when none is stored. */
export function seasonalMessage(
  settings: SeasonalSettings,
  key: SeasonalNoticeKey,
): string {
  const stored = settings[MESSAGE_COLUMN[key]];
  return typeof stored === 'string' && stored.trim()
    ? stored
    : SEASONAL_NOTICE_META[key].defaultMessage;
}

/** Hidden-notice entry for a season, e.g. "2026:closed". */
export function hiddenEntry(season: number, key: SeasonalNoticeKey): string {
  return `${season}:${key}`;
}

// ---------------------------------------------------------------------------
// Season resolution
// ---------------------------------------------------------------------------

/** Close and reopen dates for a season, honoring this season's overrides. */
export function seasonDates(
  settings: SeasonalSettings,
  season: number,
): { closeDate: Date; reopenDate: Date; usualClose: Date; usualReopen: Date } {
  const usualClose = firstSaturday(season, 10);
  const usualReopen = firstSaturday(season + 1, 2);
  const overridesApply = settings.seasonalOverrideSeason === season;
  const closeDate =
    (overridesApply && toDateOnly(settings.seasonalCloseDate)) || usualClose;
  const reopenDate =
    (overridesApply && toDateOnly(settings.seasonalReopenDate)) ||
    usualReopen;
  return { closeDate, reopenDate, usualClose, usualReopen };
}

function clampDays(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
}

/**
 * Which season "today" belongs to. A season runs until its "Open again"
 * notice has come down; after that, the next November's season is current
 * (and its upcoming-closing notice is just scheduled).
 */
export function currentSeason(settings: SeasonalSettings, today: Date): number {
  const year = today.getUTCFullYear();
  const reopenedDays = clampDays(settings.seasonalReopenedDays, 30);
  const previous = seasonDates(settings, year - 1);
  return today < addDays(previous.reopenDate, reopenedDays) ? year - 1 : year;
}

/**
 * Everything the dashboard and website need to know about the seasonal
 * closure today.
 *
 * Notice windows (C = close date, R = reopen date, L = lead days,
 * D = "Open again" days):
 *   upcomingClose   [C - L, C)
 *   closed          [C, R - L)   ...or [C, R) if upcomingReopen is hidden
 *   upcomingReopen  [R - L, R)
 *   reopened        [R, R + D)
 * At most one notice shows on any day.
 *
 * @example
 * const status = getSeasonalStatus(settings);
 * if (status.saturdaysClosed) { ... }
 * if (status.notice) { ... show status.notice.message ... }
 */
export function getSeasonalStatus(
  settings: SeasonalSettings,
  now: Date = new Date(),
): SeasonalStatus {
  const today = storeToday(now);
  const season = currentSeason(settings, today);
  const { closeDate, reopenDate, usualClose, usualReopen } = seasonDates(
    settings,
    season,
  );
  const lead = clampDays(settings.seasonalLeadDays, 30);
  const reopenedDays = clampDays(settings.seasonalReopenedDays, 30);
  const hidden = new Set(settings.seasonalHiddenNotices ?? []);
  const isHidden = (key: SeasonalNoticeKey) =>
    hidden.has(hiddenEntry(season, key));

  // The reopening notice can't start before the closure does.
  const reopenNoticeStart = new Date(
    Math.max(addDays(reopenDate, -lead).getTime(), closeDate.getTime()),
  );
  const closedEnd = isHidden('upcomingReopen') ? reopenDate : reopenNoticeStart;

  const windows: SeasonalWindow[] = [
    {
      key: 'upcomingClose',
      start: addDays(closeDate, -lead),
      end: closeDate,
      hidden: isHidden('upcomingClose'),
    },
    {
      key: 'closed',
      start: closeDate,
      end: closedEnd,
      hidden: isHidden('closed'),
    },
    {
      key: 'upcomingReopen',
      start: reopenNoticeStart,
      end: reopenDate,
      hidden: isHidden('upcomingReopen'),
    },
    {
      key: 'reopened',
      start: reopenDate,
      end: addDays(reopenDate, reopenedDays),
      hidden: isHidden('reopened'),
    },
  ];

  const enabled = settings.seasonalEnabled;
  const active = enabled
    ? windows.find((w) => !w.hidden && today >= w.start && today < w.end)
    : undefined;

  const notice: SeasonalNotice | null = active
    ? {
        key: active.key,
        label: SEASONAL_NOTICE_META[active.key].label,
        type: SEASONAL_NOTICE_META[active.key].type,
        message: fillSeasonalMessage(
          seasonalMessage(settings, active.key),
          closeDate,
          reopenDate,
        ),
        lastDay: addDays(active.end, -1),
      }
    : null;

  return {
    enabled,
    season,
    closeDate,
    reopenDate,
    usualCloseDate: usualClose,
    usualReopenDate: usualReopen,
    saturdaysClosed: enabled && today >= closeDate && today < reopenDate,
    notice,
    windows,
    today,
  };
}
