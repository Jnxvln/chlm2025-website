import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import MaterialsOverview from "~/components/landing/materials-overview/MaterialsOverview";
import EagleCarports from "~/components/landing/eagle-carports/EagleCarports";
import ExploreCalculator from "~/components/landing/explore-calculator/ExploreCalculator";
import NoticeBoard from "~/components/landing/notice-board/NoticeBoard";
import WelcomeMessage from "~/components/landing/welcome-message/WelcomeMessage";
import HelpCenter from "~/components/landing/help-center/HelpCenter";

export default component$(() => {
  return (
    <section>
      {/* Notice Board */}
      <div>
        <NoticeBoard />
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
