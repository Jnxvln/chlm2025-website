import { component$, Slot, $ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import SiteHeader from "~/components/site-header/site-header";
import Navbar from "~/components/navbar/Navbar";
import { prisma } from "~/lib/prisma";
import { applySeasonalClosure, isStoreOpen, parseTime, type StoreHours } from "~/lib/hours";
import { getSeasonalStatus } from "~/lib/seasonal";
import {
  BUSINESS,
  ADDRESS_ONE_LINE,
  PHONE_HREF,
  MAPS_HREF,
  OG_IMAGE,
  SITE_ORIGIN,
  absoluteUrl,
} from "~/lib/site";

export const useStoreSettings = routeLoader$(async () => {
  const stored = await prisma.settings.findFirst({
    select: {
      storeOpen: true,
      storeClosedAt: true,
      storeClosureType: true,
      storeDefaultClosureReason: true,
      storeDefaultClosureReasonWeather: true,
      storeDefaultClosureReasonHoliday: true,
      storeCustomClosureMessage: true,
      operatingHoursMonFriStart: true,
      operatingHoursMonFriEnd: true,
      operatingHoursSatStart: true,
      operatingHoursSatEnd: true,
      operatingHoursSunStart: true,
      operatingHoursSunEnd: true,
      seasonalEnabled: true,
      seasonalOverrideSeason: true,
      seasonalCloseDate: true,
      seasonalReopenDate: true,
      seasonalLeadDays: true,
      seasonalReopenedDays: true,
      seasonalMsgUpcomingClose: true,
      seasonalMsgClosed: true,
      seasonalMsgUpcomingReopen: true,
      seasonalMsgReopened: true,
      seasonalHiddenNotices: true,
    },
  });

  // Seasonal Saturday closure, computed from the dashboard's settings
  const seasonal = stored ? getSeasonalStatus(stored) : null;
  const settings = stored && seasonal ? applySeasonalClosure(stored, seasonal) : stored;

  return {
    settings,
    seasonalNotice: seasonal?.notice ?? null,
    // Computed on the server in store time so the first paint (and crawlers,
    // and visitors in other time zones) see the correct status.
    isOpenNow: isStoreOpen(settings),
  };
});

const DAY_URLS = {
  monFri: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  sat: ["Saturday"],
  sun: ["Sunday"],
} as const;

/** schema.org openingHoursSpecification from the Settings hours. Closed days are omitted. */
function openingHoursSpec(hours: StoreHours | null) {
  if (!hours) return undefined;
  const rows: [readonly string[], string | null | undefined, string | null | undefined][] = [
    [DAY_URLS.monFri, hours.operatingHoursMonFriStart, hours.operatingHoursMonFriEnd],
    [DAY_URLS.sat, hours.operatingHoursSatStart, hours.operatingHoursSatEnd],
    [DAY_URLS.sun, hours.operatingHoursSunStart, hours.operatingHoursSunEnd],
  ];
  return rows
    .filter(([, open, close]) => parseTime(open) !== null && parseTime(close) !== null)
    .map(([days, opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days.map((d) => `https://schema.org/${d}`),
      opens,
      closes,
    }));
}

export const head: DocumentHead = ({ resolveValue }) => {
  const { settings } = resolveValue(useStoreSettings);

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_ORIGIN}/#business`,
    name: BUSINESS.name,
    url: `${SITE_ORIGIN}/`,
    image: absoluteUrl(OG_IMAGE.path),
    telephone: BUSINESS.phone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    openingHoursSpecification: openingHoursSpec(settings),
    ...(BUSINESS.sameAs.length ? { sameAs: BUSINESS.sameAs } : {}),
  };

  return {
    // No title here: Qwik City resolves the page head first, then layouts,
    // so a layout title would overwrite every page's title.
    meta: [
      { key: "robots", name: "robots", content: "index, follow" },
      { key: "theme-color", name: "theme-color", content: "#15304D" },
      { key: "og:type", property: "og:type", content: "website" },
      { key: "og:site_name", property: "og:site_name", content: BUSINESS.name },
      { key: "og:locale", property: "og:locale", content: "en_US" },
      { key: "og:image", property: "og:image", content: absoluteUrl(OG_IMAGE.path) },
      { key: "og:image:width", property: "og:image:width", content: String(OG_IMAGE.width) },
      { key: "og:image:height", property: "og:image:height", content: String(OG_IMAGE.height) },
      { key: "twitter:card", name: "twitter:card", content: "summary_large_image" },
      { key: "twitter:image", name: "twitter:image", content: absoluteUrl(OG_IMAGE.path) },
    ],
    scripts: [
      {
        key: "ld-local-business",
        props: { type: "application/ld+json" },
        // Escape "<" so content can never close the script tag early
        script: JSON.stringify(localBusiness).replace(/</g, "\\u003c"),
      },
    ],
  };
};

export default component$(() => {
  const scrollToTop = $(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  return (
    <div>
      <div class="sm:max-w-full md:max-w-6xl mx-auto">
        <SiteHeader />
        <Navbar />
        <main>
          <Slot />
        </main>
      </div>
      <footer class="bg-[#1a1f24] text-white text-center p-4">
        <div class="flex flex-col items-center gap-3">
          <button
            onClick$={scrollToTop}
            class="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
            aria-label="Scroll to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
          <address class="not-italic text-sm text-white/80 flex flex-col sm:flex-row gap-1 sm:gap-3 items-center">
            <a href={MAPS_HREF} target="_blank" rel="noopener" class="hover:text-amber-300">
              {ADDRESS_ONE_LINE}
            </a>
            <span class="hidden sm:inline text-amber-400" aria-hidden="true">•</span>
            <a href={PHONE_HREF} class="hover:text-amber-300">
              {BUSINESS.phone.display}
            </a>
          </address>
          <div>
            &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
});
