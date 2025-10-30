import { component$, type Signal } from "@builder.io/qwik";
import { toTitleCase } from "~/utils/utils";

export type CategoryDropdownProps = {
	categories: string[];
	selectedCategory: Signal<string>;
}

export default component$<CategoryDropdownProps>(({ categories, selectedCategory }) => {
	return (
		<div class="mb-6">
			<label for="category-select" class="block text-sm font-medium text-gray-700 mb-2">
				Browse by Category
			</label>
			<select
				id="category-select"
				class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
				value={selectedCategory.value}
				onChange$={(e) => {
					selectedCategory.value = (e.target as HTMLSelectElement).value;
				}}
			>
				<option value="all" selected={selectedCategory.value === "all"}>All Materials</option>
				{categories.map((category) => (
					<option key={category} value={category} selected={selectedCategory.value === category}>
						{toTitleCase(category)}
					</option>
				))}
			</select>
		</div>
	);
});
