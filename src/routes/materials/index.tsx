import { component$, useSignal, useComputed$, useVisibleTask$, $ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { TMaterial } from "~/components/materials/Material";
import Material from "~/components/materials/Material";
import CategoryDropdown from "~/components/materials/CategoryDropdown";
import KeywordSearch from "~/components/materials/KeywordSearch";
import materialsData from "~/data/materials.json";
import { toTitleCase } from "~/utils/utils";

const CATEGORY_ALL = "all";
const DEFAULT_CATEGORY = CATEGORY_ALL;

export default component$(() => {
	const location = useLocation();
	const allMaterials: TMaterial[] = materialsData.filter(m => m.isActive) as TMaterial[];

	// Extract unique categories from materials
	const categories = Array.from(new Set(allMaterials.map(m => m.category))).sort();

	// Extract all unique keywords from materials
	const allKeywords = Array.from(
		new Set(allMaterials.flatMap(m => m.keywords || []))
	).sort();

	// Signals for filtering
	const selectedCategory = useSignal<string>(DEFAULT_CATEGORY);
	const searchTerm = useSignal<string>("");

	// Handler for keyword clicks
	const handleKeywordClick$ = $((keyword: string) => {
		searchTerm.value = keyword;
	});

	// Set initial category from URL and handle URL changes
	useVisibleTask$(({ track }) => {
		// Get category from URL query parameter
		const urlCategory = location.url.searchParams.get('category');

		// Validate and set category
		if (urlCategory && categories.includes(urlCategory)) {
			selectedCategory.value = urlCategory;
		} else if (!urlCategory) {
			// Only default to gravel if no URL parameter is present
			selectedCategory.value = DEFAULT_CATEGORY;
		}

		// Track URL changes
		track(() => location.url.href);
	});

	// Computed filtered materials
	const filteredMaterials = useComputed$(() => {
		let filtered = allMaterials;

		// If search term is active, automatically switch to "All Material" view
		if (searchTerm.value.trim() && selectedCategory.value !== CATEGORY_ALL) {
			selectedCategory.value = CATEGORY_ALL;
		}

		// Filter by category (skip if CATEGORY_ALL is selected)
		if (selectedCategory.value !== CATEGORY_ALL) {
			filtered = filtered.filter(m => m.category === selectedCategory.value);
		}

		// Filter by search term (keywords or name)
		if (searchTerm.value.trim()) {
			const search = searchTerm.value.toLowerCase().trim();
			filtered = filtered.filter(m => {
				// Check if any keyword matches (exact match)
				const keywordMatch = m.keywords?.some(k =>
					k.toLowerCase() === search
				);
				// Check if name matches (partial match still allowed for names)
				const nameMatch = m.name.toLowerCase().includes(search);
				return keywordMatch || nameMatch;
			});
		}

		return filtered;
	});

	// Group materials by category for "All Materials" view
	const groupedMaterials = useComputed$(() => {
		if (selectedCategory.value !== CATEGORY_ALL) {
			return null; // Not needed for single category view
		}

		// Group by category in the same order as the dropdown (alphabetical)
		const grouped: { category: string; materials: TMaterial[] }[] = [];

		categories.forEach(category => {
			const materialsInCategory = filteredMaterials.value.filter(
				m => m.category === category
			);
			if (materialsInCategory.length > 0) {
				grouped.push({ category, materials: materialsInCategory });
			}
		});

		return grouped;
	});

	return (
		<div class="px-4 sm:px-8 py-12 bg-gray-50 min-h-screen">
			<div class="max-w-7xl mx-auto">
				<h1 class="text-3xl font-bold mb-8 text-gray-900">Materials</h1>

				{/* Filter Controls */}
				<div class="bg-white rounded-lg shadow-md p-6 mb-8">
					<div class="flex flex-col md:flex-row md:gap-6">
						<div class="flex-1 mb-4 md:mb-0">
							<CategoryDropdown
								categories={categories}
								selectedCategory={selectedCategory}
							/>
						</div>
						<div class="flex-1">
							<KeywordSearch
								allKeywords={allKeywords}
								searchTerm={searchTerm}
							/>
						</div>
					</div>
				</div>

				{/* Results */}
				<div class="mb-4 text-gray-600">
					{filteredMaterials.value.length} {filteredMaterials.value.length === 1 ? 'material' : 'materials'} found
				</div>

				{/* Grouped view for "All Materials" */}
				{selectedCategory.value === CATEGORY_ALL && groupedMaterials.value && (
					<>
						{groupedMaterials.value.map((group) => (
							<div key={group.category} class="mb-10">
								{/* Category Header */}
								<h2 class="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-500">
									{toTitleCase(group.category)}
								</h2>
								{/* Materials Grid */}
								<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
									{group.materials.map((material) => (
										<Material key={material.id} {...material} onKeywordClick={handleKeywordClick$} />
									))}
								</div>
							</div>
						))}
					</>
				)}

				{/* Single category view */}
				{selectedCategory.value !== CATEGORY_ALL && (
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{filteredMaterials.value.map((material) => (
							<Material key={material.id} {...material} onKeywordClick={handleKeywordClick$} />
						))}
					</div>
				)}

				{/* No results message */}
				{filteredMaterials.value.length === 0 && (
					<div class="text-center py-12">
						<p class="text-gray-500 text-lg">No materials found matching your search.</p>
						<button
							class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							onClick$={() => {
								searchTerm.value = "";
							}}
						>
							Clear search
						</button>
					</div>
				)}
			</div>
		</div>
	);
})