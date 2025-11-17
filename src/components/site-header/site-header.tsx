import { component$, useSignal } from "@builder.io/qwik";
import StoreStatus from "../store-status/StoreStatus";

export default component$(() => {

	const storeAddress = useSignal<string>("5725 W 7th St. Texarkana, TX 75501");
	const storePhone = useSignal<string>("903-334-7350")

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
					<address class="not-italic text-white/90 text-xs sm:text-sm text-center">{storeAddress.value}</address>
					<div class="text-amber-400 hidden sm:block">•</div>
					<div class="text-white/90 text-xs sm:text-sm">{storePhone.value}</div>
				</div>
			</div>
		</header>
	)
})