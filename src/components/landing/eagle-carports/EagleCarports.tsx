import { component$, useSignal, useTask$ } from "@builder.io/qwik";

type Carport = {
	id: string,
    name: string,
    size: string | "",
	description: string,
	imagePath: string
}

export default component$(() => {

	const carports = useSignal<Carport[]>([
		{
			id: "standard",
			name: "Standard",
			size: "12'w to 24'w",
			description: "Eagle's flagship carport, the standard carport ranges from 12' wide to 24' wide, with a default of 6' legs and include the following: 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center. Includes both peak and leg braces for additional strength and stability. Concrete anchors or rebar anchors are included in the base price. For ground installation, add Earth Auger Anchor Package (sold separately). Eagle Carports, Inc. is not responsible for stopping, or repairing leaks under base rails, nor provides any site work.",
			imagePath: "/images/carports/cp_standard.jpg"
		},
		{
			id: "triple",
			name: "Triple Wide",
			size: "26'w to 30'w",
			description: "For extra-wide capacity protection, Eagle's triple-wide carports come default with 6' leg height and include the following: 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center. Includes both peak and leg braces for additional strength and stability. Concrete anchors or rebar anchors are included in the base price. Earth auger anchor package included. Eagle Carports, Inc. is not responsible for stopping, or repairing leaks under base rails, nor provides any site work.",
			imagePath: "/images/carports/cp_triple.jpg"
		},
		{
			id: "commerical",
			name: "Commerical",
			size: "32'w to 40'w",
			description: "Need extra-wide buildings? Commercial grade features come default with 8' legs and include the following: 14-gauge galvanized steel truss system with industry leading tubular knee bracing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center, concrete anchors or earth auger anchors are included in the base price. Eagle Carports, Inc. is not responsible for stopping, or repairing leaks under base rails, nor provides any site work.",
			imagePath: "/images/carports/cp_commercial.jpg"
		},
		{
			id: "garage",
			name: "Garage",
			size: "",
			description: "Enclosed garage-style metal buildings come standard with 9' legs and include the following: 36\"x80\" walk-in door, two 24\"x36\" windows, listed garage doors, 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center and includes both roof and leg bracing for additional strength and stability. Concrete anchors and rebar anchors are included in base prices for units. For ground installations on units 12'-24' wide: add ground anchor package. Please note, Eagle Carports, Inc. does not provide site work.",
			imagePath: "/images/carports/cp_garage.jpg"
		},
		{
			id: "rvcover",
			name: "RV Cover",
			size: "",
			description: "Protecting tall assets such as RV's can be a real challange, but Eagle has metal structures designed specifically for this case. The RV covers come standard with 15' legs and include the following: 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center, double base rail, double legs, includes both peak and leg brancing for additional strength and stability. Concrete anchors or rebar anchors, and earth auger anchors are included in the base price. Please note, Eagle Carports, inc. does not provide site work.",
			imagePath: "/images/carports/cp_rvcover.jpg"
		},
		{
			id: "combo",
			name: "Combo Unit",
			size: "",
			description: "Combo units feature both an open carport concept and a well-designed storage space solution that offers 10' of storage space. The 10' storage size can be increased in size, but will decrease the length of the carport area. Combo units come standard with 9' legs and include the following: two 24\"x36\" windows, one 36\"x80\" walk-in door, one 8'x8' garage door, 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center and includes both roof and leg bracing for additional strength and stability. Concrete anchors and rebar anchors are included in the base price. Ground installations on units 12'-24' wide add earth auger anchor package. Please note, Eagle Carports, inc. does not provide site work.",
			imagePath: "/images/carports/cp_combo.jpg"
		},
		{
			id: "hosebarn",
			name: "Horse Barn",
			size: "",
			description: "Standard horse barn structures include the following: 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center. Horse barn packages include both peak and leg bracing for additional strength and stability. Packages also include gable ends on both front and back of the barn, on both center section and lean-to's. Concrete anchors or rebar anchors, and earth auger anchors are included in the base price. Eagle Carports, Inc. is not responsible for stopping, or repairing leaks under base rails, nor provides any site work.",
			imagePath: "/images/carports/cp_horsebarn.jpg"
		},
		{
			id: "singlesloperoof",
			name: "Single Slope Roof",
			size: "",
			description: "Standard single-slope roof structures' standard leg height varies by size and include the following: 14-gauge galvanized steel framing, 29-gauge metal roofing with 20 year Beckers paint system, framing spaced 5' on center. Single-slope packages include both peak and leg bracing for additional strength and stability. Concrete anchors and rebar anchors are included in the base price. For ground installations on units 12'-24' wide add earth auger anchor package. Note: frame build varies by width and leg height. Dual-tube rafter used for 18'-24' wide units. Eagle Carports, Inc. is not responsible for stopping, or repairing leaks under base rails, nor provides any site work.",
			imagePath: "/images/carports/cp_singlesloperoof.jpg"
		},
		{
			id: "loafingshed",
			name: "Loafing Shed",
			size: "",
			description: "Eagle's standard loafing sheds' standard leg height varies by size and include the following: 14-gauge galvanized steel framing, 29-gauage metal roofing with 20 year Beckers paint system, framing spaced 5' on center. Loafing shed packages include leg bracing for additional strength and stability. Packages also include concrete anchors or rebar anchors, and earth auger anchors in the base price. Please note, Eagle Carports, inc. does not provide site work.",
			imagePath: "/images/carports/cp_loafingshed.jpg"
		},
	])
	const selectedCarport = useSignal(carports.value?.[0])

	// useTask$(({ track }) => {
	// 	const currentCarport: Carport = track(() => selectedCarport.value)
	// 	if (currentCarport) {
	// 		console.log("Selected Carport:", currentCarport.name)
	// 	}
	// })

	return (
		<section class="p-2 sm:p-4 bg-white">
			<div class="flex items-center gap-2 my-4">
				<img
					src="https://chlm2023.herokuapp.com/static/media/eagle_logo.5788e3b09babba668f42.png"
					alt="Eagle Carports"
					width={50}
					height={50}
					class="flex-shrink-0"
				/>
				<h3 class="text-xl sm:text-3xl font-bold text-blue-900">Eagle Carports</h3>
			</div>

			<div class="flex flex-col lg:flex-row gap-4">
				{/* Structure Styles List */}
				<div class="w-full lg:w-64 flex-shrink-0">
					<header class="p-3 sm:p-4 bg-blue-900 font-bold text-white text-sm sm:text-base">Structure Styles</header>
					<div class="border border-t-0 border-slate-300">
						{carports?.value?.map((carport: Carport) => (
							<div
								key={carport.id}
								class={`font-bold p-2 sm:p-3 text-sm sm:text-base hover:cursor-pointer hover:bg-slate-400 transition-colors border-b border-slate-200 last:border-b-0 ${selectedCarport.value == carport ? 'bg-slate-600 text-white' : ''}`}
								onClick$={() => (selectedCarport.value = carport)}
							>
								{carport.name} {carport.size && `(${carport.size})`}
							</div>
						))}
					</div>
				</div>

				{/* Image & Info */}
				<div class="flex flex-col gap-3 flex-1 min-w-0">
					{/* Image */}
					<div class="w-full">
						<img
                            src={selectedCarport.value?.imagePath || "/images/carports/cp_standard.jpg"}
                            alt={selectedCarport.value?.name || "Carport"}
                            class="w-full h-auto max-w-full object-cover rounded shadow-md"
                        />
					</div>

					{/* Info */}
					<div class="min-w-0">
						<div class="font-bold text-lg sm:text-xl mb-2">
							{selectedCarport.value.name} {selectedCarport.value.size && `(${selectedCarport.value.size})`}
						</div>
						<div class="max-h-[200px] overflow-y-auto mt-3 text-sm sm:text-base leading-relaxed pr-2">
							{selectedCarport.value.description}
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-center items-center font-bold text-white bg-blue-900 p-3 mt-4 text-sm sm:text-base">
				Visit our office to receive a quote!
			</div>
		</section>
	)
})