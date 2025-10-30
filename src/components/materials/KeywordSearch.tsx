import { component$, useSignal, type Signal } from "@builder.io/qwik";

export type KeywordSearchProps = {
	allKeywords: string[];
	searchTerm: Signal<string>;
}

export default component$<KeywordSearchProps>(({ allKeywords, searchTerm }) => {
	const showDropdown = useSignal(false);
	const inputRef = useSignal<HTMLInputElement>();

	// Get matching keywords based on current search term
	const matchingKeywords = allKeywords
		.filter(keyword =>
			keyword.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
			keyword.toLowerCase() !== searchTerm.value.toLowerCase()
		)
		.slice(0, 8); // Limit to 8 suggestions

	return (
		<div class="mb-6 relative">
			<label for="keyword-search" class="block text-sm font-medium text-gray-700 mb-2">
				Search by Keyword or Name
			</label>
			<div class="relative">
				<input
					ref={inputRef}
					id="keyword-search"
					type="text"
					class="w-full sm:w-96 px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
					placeholder="Type a keyword or material name..."
					value={searchTerm.value}
					onInput$={(e) => {
						searchTerm.value = (e.target as HTMLInputElement).value;
						showDropdown.value = true;
					}}
					onFocus$={() => {
						showDropdown.value = true;
					}}
					onBlur$={() => {
						// Delay to allow click on dropdown item
						setTimeout(() => {
							showDropdown.value = false;
						}, 200);
					}}
				/>
				{/* Search Icon */}
				<svg
					class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>

				{/* Clear button */}
				{searchTerm.value && (
					<button
						class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
						onClick$={() => {
							searchTerm.value = "";
							inputRef.value?.focus();
						}}
						aria-label="Clear search"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				)}

				{/* Autocomplete Dropdown */}
				{showDropdown.value && matchingKeywords.length > 0 && searchTerm.value && (
					<div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
						{matchingKeywords.map((keyword) => (
							<button
								key={keyword}
								class="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-gray-900 flex items-center gap-2"
								onClick$={() => {
									searchTerm.value = keyword;
									showDropdown.value = false;
								}}
							>
								<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
								</svg>
								{keyword}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
});
