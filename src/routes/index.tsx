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
      content: "C&H offers a wide selection of rock, stone, sand and gravel, topsoil and compost, plus a beautiful collection of colored mulches as well as natural hardwood and cedar mulch.",
    },
  ],
};
