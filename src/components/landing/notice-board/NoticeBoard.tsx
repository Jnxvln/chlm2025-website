import { component$ } from "@builder.io/qwik";
import type { TNotice } from "./Notice";
import Notice from "./Notice";

type NoticeBoardProps = {
	notices: TNotice[];
};

export default component$<NoticeBoardProps>(({ notices }) => {
	// Don't render section if there are no notices
	if (!notices || notices.length === 0) {
		return null;
	}

	return (
		<div class="p-4 bg-white">
			<h2 class="font-bold text-2xl mb-3">Notices</h2>

			{notices.map((notice: TNotice) => (
				<Notice
					key={notice.id}
					id={notice.id}
					title={notice.title}
					content={notice.content}
					type={notice.type}
					createdAt={notice.createdAt}
					displayUntil={notice.displayUntil}
					showCreatedAt={notice.showCreatedAt}
					storeClosedAt={notice.storeClosedAt}
					isActive={notice.isActive}
					updatedAt={notice.updatedAt}
				/>
			))}
		</div>
	)
})