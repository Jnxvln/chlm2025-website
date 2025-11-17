import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { toTitleCase } from "~/utils/utils";
export type TMaterial = {
	id: string;
	category: string;
	name: string;
	imageUrl: string;
	isActive: boolean;
	description?: string;
	size?: string;
	bin?: string;
	keywords?: string[];
	onKeywordClick?: PropFunction<(keyword: string) => void>;
}


export default component$(({ category, name, imageUrl, description, size, bin, keywords, onKeywordClick }: TMaterial) => {
	const isModalOpen = useSignal(false);

	// Prevent body scroll when modal is open
	useVisibleTask$(({ track }) => {
		const modalOpen = track(() => isModalOpen.value);
		
		if (modalOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	});

	return (
		<>
			<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row h-full box-border w-full">
				{/* Image Section */}
				<div class="w-full sm:w-2/5 h-48 sm:h-auto bg-gray-200 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity" onClick$={() => isModalOpen.value = true}>
					<img
						src={imageUrl}
						alt={name}
						class="w-full h-full object-cover max-w-full"
					/>
				</div>

			{/* Content Section */}
			<div class="flex flex-col p-4 sm:p-6 flex-1 min-w-0">
				{/* Header */}
				<div class="mb-3">
					<h3 class="text-xl font-bold text-gray-900 mb-1">{name}</h3>
					{(category || size || bin) && (
						<div class="flex flex-wrap gap-3 text-sm text-gray-600">
							{category && (
								<span class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
									</svg>
									{toTitleCase(category)}
								</span>
							)}
							{size && (
								<span class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6M9 11h6M9 15h6" />
									</svg>
									Size: {size}
								</span>
							)}
							{bin && (
								<span class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<span class="font-bold bg-yellow-200 p-1 rounded-lg">Bin: {bin}</span>
								</span>
							)}
						</div>
					)}
				</div>

				{/* Description */}
				{description && (
					<p class="text-gray-700 text-sm mb-3 flex-1 line-clamp-3">
						{description}
					</p>
				)}

				{/* Keywords */}
				{keywords && keywords.length > 0 && (
					<div class="flex flex-wrap gap-2 mt-auto">
						{keywords.map((keyword) => (
							<button
								key={keyword}
								class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium hover:bg-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer"
								onClick$={() => {
									window.scrollTo(0, 0);
									onKeywordClick?.(keyword);
								}}
								title={`Filter by ${keyword}`}
							>
								{keyword}
							</button>
						))}
					</div>
				)}
			</div>
		</div>

		{/* Image Modal */}
		{isModalOpen.value && (
			<div
				class="fixed inset-0 z-[1001] bg-black bg-opacity-90 flex items-center justify-center p-4"
				onClick$={() => isModalOpen.value = false}
			>
				{/* Close button */}
				<button
					class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
					onClick$={() => isModalOpen.value = false}
					aria-label="Close modal"
				>
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				{/* Image */}
				<img
					src={imageUrl}
					alt={name}
					class="max-w-full max-h-full object-contain"
					onClick$={(e) => e.stopPropagation()}
				/>

				{/* Image title */}
				<div class="absolute bottom-4 left-4 right-4 text-white text-center">
					<p class="text-lg font-semibold bg-black bg-opacity-50 px-4 py-2 rounded inline-block">
						{name}
					</p>
				</div>
			</div>
		)}
		</>
	)
})