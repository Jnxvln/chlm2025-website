import { component$ } from "@builder.io/qwik";
import type { TMaterial } from "~/components/materials/Material";
import Material from "~/components/materials/Material";

const testMaterials: TMaterial[] = [
	{
		id: "mat-001",
		category: "mulch",
		name: "Cedar Mulch",
		imageUrl: "https://django-chlmweb-files.s3.us-east-2.amazonaws.com/TEST/mulch-cedar2.jpg",
		description: "Natural cedar mulch with a rich reddish-brown color. Excellent for moisture retention and weed suppression. Pleasant cedar aroma helps repel insects.",
		size: "Bulk or bags",
		bin: "A-12",
		keywords: ["mulch", "cedar", "organic", "aromatic"],
		isActive: true,
	},
	{
		id: "mat-002",
		category: "mulch",
		name: "Hardwood Mulch",
		imageUrl: "https://django-chlmweb-files.s3.us-east-2.amazonaws.com/TEST/mulch_hardwood.jpg",
		description: "Double-shredded hardwood mulch in a dark brown color. Long-lasting and ideal for garden beds, pathways, and around trees.",
		size: "Bulk or bags",
		bin: "A-13",
		keywords: ["mulch", "hardwood", "organic", "dark"],
		isActive: true,
	},
	{
		id: "mat-003",
		category: "gravel",
		name: "Pea Gravel",
		imageUrl: "https://django-chlmweb-files.s3.us-east-2.amazonaws.com/TEST/gravel-peagravel.jpg",
		description: "Small, smooth, rounded stones perfect for walkways, driveways, and drainage. Naturally tumbled for a polished appearance.",
		size: "3/8 inch",
		bin: "B-5",
		keywords: ["gravel", "small", "smooth", "drainage"],
		isActive: true,
	},
	{
		id: "mat-004",
		category: "gravel",
		name: "Crushed Stone #57",
		imageUrl: "https://django-chlmweb-files.s3.us-east-2.amazonaws.com/TEST/gravel-1insmooth.jpg",
		description: "Angular crushed stone ideal for driveways and as a base material. Excellent compaction and drainage properties.",
		size: "3/4 inch",
		bin: "B-7",
		keywords: ["gravel", "crushed", "driveway", "base"],
		isActive: true,
	},
	{
		id: "mat-005",
		category: "stone",
		name: "Pennsylvania Bluestone Flagstone",
		imageUrl: "https://django-chlmweb-files.s3.us-east-2.amazonaws.com/TEST/flagstone-silvermist.jpg",
		description: "Natural cleft flagstone with blue-gray tones. Perfect for patios, walkways, and stepping stones. Each piece is unique.",
		size: "1-2 inch thick",
		bin: "C-2",
		keywords: ["flagstone", "patio", "natural", "bluestone"],
		isActive: true,
	},
	{
		id: "mat-006",
		category: "stone",
		name: "River Rock",
		imageUrl: "https://django-chlmweb-files.s3.us-east-2.amazonaws.com/TEST/creekrock_smallround.jpg",
		description: "Smooth, water-tumbled stones in mixed earth tones. Ideal for landscaping accents, dry creek beds, and around water features.",
		size: "2-4 inch",
		bin: "C-8",
		keywords: ["stone", "river rock", "decorative", "smooth"],
		isActive: true,
	},
	{
		id: "mat-007",
		category: "soil",
		name: "Unfiltered Topsoil",
		imageUrl: "https://django-chlmweb-files.s3.us-east-2.amazonaws.com/TEST/soil-topsoil.jpg",
		description: "Screened, nutrient-rich topsoil perfect for lawns, gardens, and raised beds. Free of debris and ready to use.",
		size: "Bulk",
		bin: "D-1",
		keywords: ["soil", "topsoil", "garden", "lawn"],
		isActive: true,
	},
	{
		id: "mat-008",
		category: "soil",
		name: "Organic Compost",
		imageUrl: "https://django-chlmweb-files.s3.us-east-2.amazonaws.com/TEST/premium-compost_480.jpg",
		description: "Fully composted organic matter that enriches soil with nutrients. Improves soil structure and water retention.",
		size: "Bulk or bags",
		bin: "D-3",
		keywords: ["compost", "organic", "soil amendment", "fertilizer"],
		isActive: true,
	},
	{
		id: "mat-009",
		category: "sand",
		name: "Mason Sand",
		imageUrl: "https://django-chlmweb-files.s3.us-east-2.amazonaws.com/TEST/sand_mason_480.jpg",
		description: "Fine, clean sand ideal for mixing concrete, laying pavers, and filling joints. Screened for consistency.",
		size: "Bulk",
		bin: "E-2",
		keywords: ["sand", "mason", "concrete", "pavers"],
		isActive: true,
	},
	{
		id: "mat-011",
		category: "stone",
		name: "Chopped Stone",
		imageUrl: "https://django-chlmweb-files.s3.us-east-2.amazonaws.com/TEST/chopped_chestnut.jpg",
		description: "Fractured natural stone pieces with irregular shapes. Great for retaining walls, borders, and rustic landscaping features.",
		size: "4-8 inch",
		bin: "C-5",
		keywords: ["stone", "chopped", "retaining wall", "natural"],
		isActive: true,
	},
]

export default component$(() => {
	return (
		<div class="px-4 sm:px-8 py-12 bg-gray-50 min-h-screen">
			<div class="max-w-7xl mx-auto">
				<h1 class="text-3xl font-bold mb-8 text-gray-900">Materials</h1>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{testMaterials.map((material) => (
						<Material key={material.id} {...material} />
					))}
				</div>
			</div>
		</div>
	)
})