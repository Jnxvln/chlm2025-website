import { component$ } from "@builder.io/qwik";

export type TNotice = {
	id: number;
	title: string;
	content: string;
	type?: "success" | "info" | "warning" | "alert";
	createdAt: Date;
	displayUntil?: Date;
	showCreatedAt?: boolean
}

const figureColor = (type: string | undefined) => {
		switch (type) {
			case "success":
				return "bg-green-100";
			case "info":
				return "bg-blue-100";
			case "warning":
				return "bg-yellow-100";
			case "alert":
				return "bg-red-100";
			default:
				return "bg-gray-100";
		}
	}

export default component$(({ id, title, content, type, createdAt, displayUntil, showCreatedAt }: TNotice) => {
	return (
		<div key={id} class={`border border-gray-300 rounded p-4 mb-4 ${figureColor(type)}`}>
			<h3 class="font-semibold text-xl mb-2">{title}</h3>
			<p class="mb-2">{content}</p>
			{showCreatedAt && <p class="text-sm text-gray-600">Posted on: {createdAt.toLocaleDateString()}</p>}
		</div>
	)
})