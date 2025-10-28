import { component$ } from "@builder.io/qwik";

export default component$(() => {
	return (
		<div class="p-4 bg-white">
			<h2 class="font-bold text-2xl mb-3">Notices</h2>
			<div>Site notices will appear here, if any.</div>
			<ul class="list-disc">
				<li class="ml-8">Example notice #1</li>
				<li class="ml-8">Example notice #2</li>
				<li class="ml-8">Example notice #3</li>
				<li class="ml-8">Example notice #4</li>
			</ul>
		</div>
	)
})