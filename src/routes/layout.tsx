import { component$, Slot } from "@builder.io/qwik";
import SiteHeader from "~/components/site-header/site-header";

export default component$(() => {
	return (
		<>
			<div class="max-w-6xl mx-auto text-center">
				<SiteHeader />
			</div>
			<Slot />
		</>
	)
})