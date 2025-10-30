import { component$, Slot, $ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import SiteHeader from "~/components/site-header/site-header";
import Navbar from "~/components/navbar/Navbar";
import { prisma } from "~/lib/prisma";

export const useStoreSettings = routeLoader$(async () => {
  const settings = await prisma.settings.findFirst({
    select: {
      storeOpen: true,
      storeClosureType: true,
      storeDefaultClosureReason: true,
      storeDefaultClosureReasonWeather: true,
      storeDefaultClosureReasonHoliday: true,
      storeCustomClosureMessage: true,
    },
  });
  return settings;
});

export default component$(() => {
	const scrollToTop = $(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});

	return (
		<div class="max-w-6xl mx-auto px-2 sm:px-4">
			<SiteHeader />
			<Navbar />
			<div>
				<Slot />
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
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
						</svg>
					</button>
					<div>
						&copy; {new Date().getFullYear()} C&H Landscape Materials. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	)
})