import { component$ } from "@builder.io/qwik";

export default component$(() => {
	return (
		<div class="p-4 bg-purple-200">
			<h3 class="font-bold text-2xl mb-4">How Much Do I Need?</h3>
			<a href="/calculator" class="p-2 bg-amber-200 font-bold rounded-lg hover:bg-amber-300 transition-colors duration-150 ease-in-out">Try Our Online Calculator</a>
			<div class="mt-3">For bulk materials only (soils, mulches, and gravel)</div>
			<div class="italic">Disclaimer: Calculations are an approximation only</div>
		</div>
	)
})