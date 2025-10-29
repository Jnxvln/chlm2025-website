import { component$, useSignal } from "@builder.io/qwik";
import type { TNotice } from "./Notice";
import Notice from "./Notice";


const testNotices: TNotice[] = [
	{
		id: 0,
		title: "Scheduled Maintenance",
		content: "The site will be down for maintenance on July 15th from 1 AM to 3 AM UTC.",
		type: "warning",
		createdAt: new Date("2024-07-10T10:00:00Z"),
		displayUntil: new Date("2024-07-16T00:00:00Z"),
		showCreatedAt: true,
	},
	{
		id: 1,
		title: "New Category Added!",
		content: "We added the new 'Advanced Materials' category to our materials section. Check it out now!",
		type: "success",
		createdAt: new Date("2024-07-10T10:00:00Z"),
		displayUntil: new Date("2024-07-16T00:00:00Z"),
		showCreatedAt: false,
	},
	{
		id: 3,
		title: "C&H Closed Due To Weather",
		content: "We are currently closed due to inclement weather conditions.",
		type: "alert",
		createdAt: new Date("2024-07-10T10:00:00Z"),
		displayUntil: new Date("2024-07-16T00:00:00Z"),
		showCreatedAt: false,
	},
	{
		id: 4,
		title: "Our Website is Back Online",
		content: "We are happy to announce that our website is back online after the recent outage.",
		type: "info",
		createdAt: new Date("2024-07-10T10:00:00Z"),
		displayUntil: new Date("2024-07-16T00:00:00Z"),
		showCreatedAt: true,
	}
]

export default component$(() => {
	const notices = useSignal<TNotice[]>(testNotices);

	// Don't render section if there are no notices
	if (!notices || notices.value.length === 0) {
		return null;
	}

	return (
		<div class="p-4 bg-white">
			<h2 class="font-bold text-2xl mb-3">Notices</h2>
			
			{notices?.value?.length > 0 && notices.value.map((notice: TNotice) => (
				<Notice
					key={notice.id}
					id={notice.id}
					title={notice.title}
					content={notice.content}
					type={notice.type}
					createdAt={notice.createdAt}
					displayUntil={notice.displayUntil}
					showCreatedAt={notice.showCreatedAt}
				/>
			))}
		</div>
	)
})