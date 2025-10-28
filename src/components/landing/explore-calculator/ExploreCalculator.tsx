import { component$ } from "@builder.io/qwik";

export default component$(() => {
	return (
		<div class="px-8 py-20 bg-linear-to-b from-[#35250fd5] to-[#7a5a32cc] text-center">
			<h3 class="font-bold text-3xl mb-6 text-white"><span class="text-[#b2ca46]">How Much</span> Do I Need?</h3>
			<a href="/calculator" class="px-8 py-4 text-white bg-[#648226] font-bold rounded-lg hover:bg-[#82A832] transition-colors duration-150 ease-in-out">Try Our Online Calculator</a>
			<div class="font-bold text-white mt-8">
				<div class="mt-3">For bulk materials only (soils, mulches, and gravel)</div>
				<div class="italic">Disclaimer: Calculations are an approximation only</div>
			</div>
		</div>
	)
})