import { component$ } from "@builder.io/qwik";

export type TNotice = {
	id: number;
	title: string;
	content: string;
	type: "success" | "info" | "warning" | "danger";
	createdAt: Date;
	updatedAt: Date;
	displayUntil: Date;
	showCreatedAt: boolean;
	storeClosedAt?: Date | null;
	isActive: boolean;
}

const figureColor = (type: string | undefined) => {
		switch (type) {
			case "success":
				return "bg-green-100";
			case "info":
				return "bg-blue-100";
			case "warning":
				return "bg-yellow-100";
			case "danger":
				return "bg-red-100";
			default:
				return "bg-gray-100";
		}
	}

export default component$(({ id, title, content, type, createdAt, showCreatedAt, storeClosedAt }: TNotice) => {
	// Format date as MM/DD/YY
	const formatDate = (date: Date) => {
		const d = new Date(date);
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		const year = String(d.getFullYear()).slice(-2);
		return `${month}/${day}/${year}`;
	};

	// Format date and time as MM/DD/YY hh:mma
	const formatDateTime = (date: Date) => {
		const d = new Date(date);
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		const year = String(d.getFullYear()).slice(-2);

		let hours = d.getHours();
		const minutes = String(d.getMinutes()).padStart(2, '0');
		const ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		const hoursStr = String(hours).padStart(2, '0');

		return `${month}/${day}/${year} ${hoursStr}:${minutes}${ampm}`;
	};

	return (
		<div key={id} class={`border border-gray-300 rounded p-4 mb-4 ${figureColor(type)}`}>
			<h3 class="font-semibold text-xl mb-2">{title}</h3>
			<p class="mb-2">{content}</p>
			{showCreatedAt && <p class="text-sm text-gray-600">Posted on: {formatDate(createdAt)}</p>}
			{/* {storeClosedAt && <p class="text-sm text-gray-600">Posted at: {formatDateTime(storeClosedAt)}</p>} */}
		</div>
	)
})