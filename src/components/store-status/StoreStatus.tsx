import { component$ } from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";

const OPEN_COLOR = "bg-green-500"
const CLOSE_COLOR = "bg-red-500"

const Indicator = component$(({ isOpen }: { isOpen: boolean }) => (
	<div class={`w-3 h-3 rounded-full ${isOpen ? OPEN_COLOR : CLOSE_COLOR}`}></div>
))

export default component$(() => {
	const storeOpen = useSignal(true)
	return (
		<div class="flex items-center">
			<div class="pr-2 font-bold text-white">Open:</div>
			<Indicator isOpen={storeOpen.value} />
		</div>
	)
})