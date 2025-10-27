import { component$, useSignal } from "@builder.io/qwik";
import StoreStatus from "../store-status/StoreStatus";

export default component$(() => {

	const storeAddress = useSignal<string>("5725 W 7th St. Texarkana, TX 75501");
	const storePhone = useSignal<string>("903-334-7350")

	return (
		<header class="relative h-60 border-2 border-dashed border-amber-700 bg-amber-100">
			<div class="absolute top-0 left-0 p-2">
				<StoreStatus />
			</div>

			<div class="flex flex-col justify-between border-2 border-solid border-red-300 h-full py-3">
				<div class="flex flex-col">
					<div class="text-5xl">C&H</div>
					<div class="text-3xl">Landscape Materials</div>
				</div>

				<div class="flex items-center justify-between gap-4 mx-auto border-2 border-dashed border-purple-800">
					<address>{storeAddress.value}</address>
					<div>•</div>
					<div>{storePhone.value}</div>
				</div>
			</div>
		</header>
	)
})