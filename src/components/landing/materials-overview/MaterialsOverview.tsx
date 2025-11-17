import { component$, useStylesScoped$ } from "@builder.io/qwik";

export default component$(() => {
	useStylesScoped$(`
		.grid-container {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, 1fr);
			gap: 1rem;
		}

		.grid-container > a {
			display: block;
			text-decoration: none;
			height: 200px;
		}

		.grid-container > div {
			background: #4b6cb7;
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100px;
		}

		.slot {
			border: 1px solid brown;
			border-radius: 8px;
			height: 200px;
			color: white;
			font-weight: bold;
			font-size: 1.1rem;
			display: flex;
			justify-content: center;
			align-items: center;
			filter: saturate(0%);
		}

		.slot:hover {
			font-size: 1.3rem;
			transition: all 0.3s ease;
			filter: saturate(100%);
			cursor: pointer;
			transition: all 0.3s ease-in-out;
		}

		/* SOIL */
		.grid-container > a > .soil {
			background-image: url("/images/img_soil.webp");
			background-size: cover;
			background-repeat: no-repeat;
			width: 100%;
			height: 100%;
		}

		/* GRAVEL */
		.grid-container > a > .gravel {
			background-image: url("/images/img_gravel.webp");
			background-size: cover;
			background-repeat: no-repeat;
			width: 100%;
			height: 100%;
		}

		/* STONE */
		.grid-container > a > .stone {
			background-image: url("/images/img_stone.webp");
			background-size: cover;
			background-repeat: no-repeat;
			width: 100%;
			height: 100%;
		}

		/* MULCH */
		.grid-container > a > .mulch {
			background-image: url("/images/img_mulch.webp");
			background-size: cover;
			background-repeat: no-repeat;
			width: 100%;
			height: 100%;
		}
	`);

	return (
		<div class="px-8 py-12 bg-orange-100">
			<h3 class="font-bold text-2xl mb-3">Materials Overview</h3>
			<div class="my-4">To help you find what you're looking for, we've grouped our materials into categories:</div>
			{/* Categories: Soil, Gravel, Stone, and Mulch */}
			<div class="grid-container">
				<a href="/materials?category=soil">
					<div class="slot soil">Soil</div>
				</a>
				<a href="/materials?category=gravel">
					<div class="slot gravel">Gravel</div>
				</a>
				<a href="/materials?category=stone">
					<div class="slot stone">Stone</div>
				</a>
				<a href="/materials?category=mulch">
					<div class="slot mulch">Mulch</div>
				</a>
			</div>

			<a href="/materials">			
				<div class="flex justify-center items-center font-bold my-6 bg-[#5f4834] hover:bg-[#7e6046] transition-colors duration-100 text-white text-2xl p-2 rounded-lg">
					View More Materials
				</div>
			</a>
		</div>
	)
})