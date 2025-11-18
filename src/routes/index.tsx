import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import MaterialsOverview from "~/components/landing/materials-overview/MaterialsOverview";
import EagleCarports from "~/components/landing/eagle-carports/EagleCarports";
import ExploreCalculator from "~/components/landing/explore-calculator/ExploreCalculator";
import NoticeBoard from "~/components/landing/notice-board/NoticeBoard";
import WelcomeMessage from "~/components/landing/welcome-message/WelcomeMessage";
import HelpCenter from "~/components/landing/help-center/HelpCenter";
import { prisma } from "~/lib/prisma";
import type { TNotice } from "~/components/landing/notice-board/Notice";

export const useNotices = routeLoader$(async () => {
  const notices = await prisma.storeNotice.findMany({
    where: {
      isActive: true,
      displayUntil: {
        gte: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch store settings to check if store is closed
  const settings = await prisma.settings.findFirst({
    select: {
      storeOpen: true,
      storeClosedAt: true,
      storeClosureType: true,
      storeDefaultClosureReason: true,
      storeDefaultClosureReasonWeather: true,
      storeDefaultClosureReasonHoliday: true,
      storeCustomClosureMessage: true,
    },
  });

  // If store is closed, create a closure notice
  const allNotices: TNotice[] = [...notices];

  if (settings && !settings.storeOpen) {
    let closureMessage = settings.storeDefaultClosureReason;

    switch (settings.storeClosureType) {
      case 'weather':
        closureMessage = settings.storeDefaultClosureReasonWeather;
        break;
      case 'holiday':
        closureMessage = settings.storeDefaultClosureReasonHoliday;
        break;
      case 'custom':
        closureMessage = settings.storeCustomClosureMessage || settings.storeDefaultClosureReason;
        break;
      default:
        closureMessage = settings.storeDefaultClosureReason;
    }

    // Create closure notice and prepend it to the notices array
    const closureNotice: TNotice = {
      id: -1, // Unique ID for closure notice
      title: "Store Closure",
      content: closureMessage,
      type: "danger",
      createdAt: new Date(),
      updatedAt: new Date(),
      displayUntil: new Date(), // Not really used for closure notices
      showCreatedAt: false,
      storeClosedAt: settings.storeClosedAt,
      isActive: true,
    };

    allNotices.unshift(closureNotice);
  }

  return allNotices;
});

export default component$(() => {
  const noticesSignal = useNotices();

  return (
    <section>
      {/* Notice Board */}
      <div>
        <NoticeBoard notices={noticesSignal.value} />
      </div>

      {/* Welcome Message */}
      <div>
        <WelcomeMessage />
      </div>

      {/* Featured Materials */}
      <div>
        <MaterialsOverview />
      </div>

      {/* Explore Calculator */}
      <div>
        <ExploreCalculator />
      </div>

      {/* Eagle Carports */}
      <div>
        <EagleCarports />
      </div>

      {/* Help Center */}
      <div>
        <HelpCenter />
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "C&H Landscape Materials | Texarkana, TX",
  meta: [
    {
      name: "description",
      content:
        "C&H Landscape Materials in Texarkana, TX offers rock, stone, sand, gravel, topsoil, compost, hardwood mulch, and cedar mulch in a wide variety of colors and sizes.",
    },
    { name: "charset", content: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "robots", content: "index, follow" },
    {
      name: "keywords",
      content:
        "landscape materials, mulch, gravel, rock, stone, sand, topsoil, compost, Texarkana, C&H Landscape Materials",
    },
    { name: "theme-color", content: "#15304D" },

    // Open Graph
    { property: "og:title", content: "C&H Landscape Materials | Texarkana, TX" },
    {
      property: "og:description",
      content:
        "Bulk landscape materials for home and commercial projects: rock, stone, sand, gravel, mulch, compost, and more.",
    },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://chlm2025-website-production.up.railway.app/",
    },
    {
      property: "og:image",
      content:
        "https://chlm2025-website-production.up.railway.app/images/CHLM_OG_Image.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: "C&H Landscape Materials" },
    { property: "og:locale", content: "en_US" },

    // Twitter / X
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "C&H Landscape Materials | Texarkana, TX",
    },
    {
      name: "twitter:description",
      content:
        "Bulk landscape materials for home and commercial projects: rock, stone, sand, gravel, mulch, compost, and more.",
    },
    {
      name: "twitter:image",
      content:
        "https://chlm2025-website-production.up.railway.app/images/CHLM_OG_Image.jpg",
    },
  ],
  links: [
    {
      rel: "canonical",
      href: "https://chlm2025-website-production.up.railway.app/",
    },
  ],
};
