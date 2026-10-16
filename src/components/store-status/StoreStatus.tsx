import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useStoreSettings } from "~/routes/layout";
import { isStoreOpen } from "~/lib/hours";

export default component$(() => {
	const store = useStoreSettings();
	// Server already computed this in store time, so the first paint is correct.
	const isOpen = useSignal(store.value.isOpenNow);

	// Keep it current if the page stays open across opening/closing time.
	// "document-idle" defers this until the browser is idle instead of on load.
	useVisibleTask$(
		() => {
			const id = setInterval(() => {
				isOpen.value = isStoreOpen(store.value.settings);
			}, 60_000);
			return () => clearInterval(id);
		},
		{ strategy: "document-idle" },
	);

	return (
		<div class="flex items-center" role="status">
			<div class="pr-2 font-bold text-white">{isOpen.value ? "Open" : "Closed"}:</div>
			<div
				class={`w-3 h-3 rounded-full ${isOpen.value ? "bg-green-500" : "bg-red-500"}`}
				aria-hidden="true"
			></div>
		</div>
	);
});
