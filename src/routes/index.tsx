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
import { useStoreSettings } from "./layout";
import { pageHead } from "~/lib/seo";

export const useNotices = routeLoader$(async ({ resolveValue }) => {
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

  // Reuse the layout's Settings query instead of hitting the DB twice
  const { settings } = await resolveValue(useStoreSettings);

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

export const head: DocumentHead = pageHead({
  description:
    "C&H Landscape Materials in Texarkana, TX offers rock, stone, sand, gravel, topsoil, compost, hardwood mulch, and cedar mulch in a wide variety of colors and sizes.",
  path: "/",
});
