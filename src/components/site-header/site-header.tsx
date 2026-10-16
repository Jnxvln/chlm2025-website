import { component$ } from "@builder.io/qwik";
import StoreStatus from "../store-status/StoreStatus";
import { BUSINESS, ADDRESS_ONE_LINE, PHONE_HREF, MAPS_HREF } from "~/lib/site";

export default component$(() => {
	return (
		<header class="relative h-60 overflow-hidden">
			{/* Background Image with Overlay */}
			<div
				class="absolute inset-0 bg-cover bg-center"
				style="background-image: url('/images/chlm2025_background_img.webp');"
			>
				<div class="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-800/60 to-slate-900/80"></div>
			</div>

			{/* Store Status */}
			<div class="absolute bottom-0 left-0 p-2 z-10">
				<StoreStatus />
			</div>

			{/* Content */}
			<div class="relative z-10 flex flex-col justify-center items-center h-full py-6 space-y-8">
				{/* Company Name */}
				<div class="flex flex-col text-center">
					<div class="text-5xl sm:text-7xl font-bold text-white tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
						C&H
					</div>
					<div class="text-2xl sm:text-4xl font-semibold text-amber-400 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1">
						Landscape Materials
					</div>
				</div>

				{/* Contact Info */}
				<div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-slate-900/40 backdrop-blur-sm px-3 py-2 rounded">
					<a
						href={MAPS_HREF}
						target="_blank"
						rel="noopener"
						class="text-white/90 text-xs sm:text-sm text-center hover:text-amber-300"
					>
						{ADDRESS_ONE_LINE}
					</a>
					<div class="text-amber-400 hidden sm:block" aria-hidden="true">•</div>
					<a href={PHONE_HREF} class="text-white/90 text-xs sm:text-sm font-semibold hover:text-amber-300">
						{BUSINESS.phone.display}
					</a>
				</div>
			</div>
		</header>
	)
})