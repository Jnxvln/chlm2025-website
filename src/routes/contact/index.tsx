import { component$, Fragment, Slot } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useStoreSettings } from "~/routes/layout";
import { weeklyHours } from "~/lib/hours";
import { pageHead } from "~/lib/seo";
import { BUSINESS, ADDRESS_ONE_LINE, PHONE_HREF, MAPS_HREF } from "~/lib/site";

const MAP_EMBED_SRC =
	"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8022.258904553067!2d-94.12374742379477!3d33.414860651116065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x863440e2a84ed4a1%3A0xbc62af402ff3d75a!2s5725%20W%207th%20St%2C%20Texarkana%2C%20TX%2075501!5e1!3m2!1sen!2sus!4v1761762193044!5m2!1sen!2sus";

const InfoCard = component$((props: { label: string }) => (
	<div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
		<div class="flex items-start gap-3">
			<div class="shrink-0 text-blue-600 mt-1" aria-hidden="true">
				<Slot name="icon" />
			</div>
			<div class="flex-1">
				<h2 class="font-semibold text-gray-900 mb-1">{props.label}</h2>
				<div class="text-gray-700">
					<Slot />
				</div>
			</div>
		</div>
	</div>
));

export default component$(() => {
	const store = useStoreSettings();
	const hours = store.value.settings ? weeklyHours(store.value.settings) : null;

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
						<InfoCard label="Phone">
							<svg q:slot="icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
							</svg>
							<a href={PHONE_HREF} class="text-blue-700 font-semibold hover:underline">
								{BUSINESS.phone.display}
							</a>
						</InfoCard>

						<InfoCard label="Address">
							<svg q:slot="icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<address class="not-italic">
								<a href={MAPS_HREF} target="_blank" rel="noopener" class="text-blue-700 hover:underline">
									{ADDRESS_ONE_LINE}
								</a>
							</address>
						</InfoCard>

						<InfoCard label="Current Hours">
							<svg q:slot="icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							{hours ? (
								<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
									{hours.map((row) => (
										<Fragment key={row.label}>
											<dt class="font-medium">{row.label}:</dt>
											<dd>{row.value}</dd>
										</Fragment>
									))}
								</dl>
							) : (
								<p>Please call for current hours.</p>
							)}
						</InfoCard>
					</div>

					{/* Map Column */}
					<div class="w-full h-96 lg:h-full min-h-[400px]">
						<iframe
							src={MAP_EMBED_SRC}
							class="w-full h-full rounded-lg shadow-md"
							style="border:0;"
							allowFullscreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							title={`Map to ${BUSINESS.name}`}
						></iframe>
					</div>
				</div>
			</div>
		</div>
	);
});

export const head: DocumentHead = pageHead({
	title: "Contact & Hours",
	description:
		"Hours, phone number, and directions for C&H Landscape Materials at 5725 W 7th St. in Texarkana, TX. Call 903-334-7350 for pricing and availability.",
	path: "/contact/",
});
