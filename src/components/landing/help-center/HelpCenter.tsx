import { component$ } from "@builder.io/qwik";

export default component$(() => {
	return (
		<section class="px-4 py-18 text-center bg-linear-to-b from-[#3d3429b9] to-[#193c4d]">
			<h2 class="text-4xl font-bold text-white mb-4">Need Some Help?</h2>
			<div class="font-bold text-white text-xl mb-4">Check out our Help Center to find out more information.</div>
			<a href="/help" class="font-bold text-yellow-200">Visit Help Center</a>
		</section>
	)
})