import { component$, useSignal } from "@builder.io/qwik";

export default component$(() => {

	const store = useSignal({
		phone: "903-334-7350",
		address: "5725 W 7th St. Texarkana, TX 75501",
		currentHours: {
			spring: `\nMon-Fri: 8:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM\nSunday: Closed`,
			winter: `\nMon-Fri: 8:00 AM - 5:00 PM\nSaturday: Closed\nSunday: Closed`,
		},
	});

	const map = useSignal({
		src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8022.258904553067!2d-94.12374742379477!3d33.414860651116065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x863440e2a84ed4a1%3A0xbc62af402ff3d75a!2s5725%20W%207th%20St%2C%20Texarkana%2C%20TX%2075501!5e1!3m2!1sen!2sus!4v1761762193044!5m2!1sen!2sus",
		width: 600,
		height: 450,
		style: "border:0;",
		allowFullscreen: true,
		loading: "lazy" as "lazy" | "eager" | undefined,
		referrerPolicy: "no-referrer-when-downgrade" as ReferrerPolicy | undefined,		
	})

	const InfoCard = component$((props: { icon: any; label: string; value: string }) => (
		<div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
			<div class="flex items-start gap-3">
				<div class="shrink-0 text-blue-600 mt-1">
					{props.icon}
				</div>
				<div class="flex-1">
					<h3 class="font-semibold text-gray-900 mb-1">{props.label}</h3>
					<p class="text-gray-700 whitespace-pre-line">{props.value}</p>
				</div>
			</div>
		</div>
	));

	return (
		<div class="min-h-screen bg-gray-50">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				{/* Header Section */}
				<div class="mb-8">
					<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
					<div class="space-y-4 text-gray-600">
						<p>Feel free to reach out to us for questions or inquiries.</p>
						<p>We operate with a single phone line and may be assisting other customers in-store or on the phone. <br/>If your call goes unanswered, please try again in a few minutes.</p>
						<p class="text-sm text-[#d10000]">NOTE: All office hours depend on weather conditions. We post any closure notices on the homepage.</p>
					</div>
				</div>

				{/* Two Column Layout - Info and Map */}
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Contact Info Column */}
					<div class="space-y-4">
						<InfoCard
							label="Phone"
							value={store.value.phone}
							icon={
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
								</svg>
							}
						/>
						<InfoCard
							label="Address"
							value={store.value.address}
							icon={
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							}
						/>
						<InfoCard
							label="Current Hours"
							value={store.value.currentHours.winter}
							icon={
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							}
						/>
					</div>

					{/* Map Column */}
					<div class="w-full h-96 lg:h-full min-h-[400px]">
						<iframe
							src={map.value.src}
							class="w-full h-full rounded-lg shadow-md"
							style={map.value.style}
							allowFullscreen={map.value.allowFullscreen}
							loading={map.value.loading}
							referrerPolicy={map.value.referrerPolicy}
							title="Location Map"
						></iframe>
					</div>
				</div>
			</div>
		</div>
	)
})