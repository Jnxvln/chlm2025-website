import { component$ } from "@builder.io/qwik";

export default component$(() => {
	return (
		<section class="p-4 bg-blue-100">
			<div class="flex items-center gap-2">
				<img 
					src="https://chlm2023.herokuapp.com/static/media/eagle_logo.5788e3b09babba668f42.png" 
					alt="Eagle Carports" 
					width={50}
					height={50}
				/>
				<h3 class="text-2xl font-bold mb-3 mt-2 text-blue-900">Eagle Carports</h3>
			</div>
		</section>
	)
})