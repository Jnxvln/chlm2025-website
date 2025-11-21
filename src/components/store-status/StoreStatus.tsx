import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useStoreSettings } from "~/routes/layout";

const OPEN_COLOR = "bg-green-500"
const CLOSE_COLOR = "bg-red-500"

const Indicator = component$(({ isOpen }: { isOpen: boolean }) => (
	<div class={`w-3 h-3 rounded-full ${isOpen ? OPEN_COLOR : CLOSE_COLOR}`}></div>
))

function isWithinOperatingHours(
	startTime: string | null | undefined,
	endTime: string | null | undefined
): boolean {
	// If either time is missing or "CLOSED", store is closed
	if (!startTime || !endTime || startTime === "CLOSED" || endTime === "CLOSED") {
		return false;
	}

	const now = new Date();
	const [startHour, startMin] = startTime.split(":").map(Number);
	const [endHour, endMin] = endTime.split(":").map(Number);

	const currentMinutes = now.getHours() * 60 + now.getMinutes();
	const startMinutes = startHour * 60 + startMin;
	const endMinutes = endHour * 60 + endMin;

	// Open at start time, closed at end time (exclusive end)
	return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

function getIsOpenBySchedule(settings: {
	operatingHoursMonFriStart?: string | null;
	operatingHoursMonFriEnd?: string | null;
	operatingHoursSatStart?: string | null;
	operatingHoursSatEnd?: string | null;
	operatingHoursSunStart?: string | null;
	operatingHoursSunEnd?: string | null;
}): boolean {
	const day = new Date().getDay(); // 0 = Sunday, 6 = Saturday

	if (day === 0) {
		// Sunday
		return isWithinOperatingHours(settings.operatingHoursSunStart, settings.operatingHoursSunEnd);
	} else if (day === 6) {
		// Saturday
		return isWithinOperatingHours(settings.operatingHoursSatStart, settings.operatingHoursSatEnd);
	} else {
		// Monday-Friday
		return isWithinOperatingHours(settings.operatingHoursMonFriStart, settings.operatingHoursMonFriEnd);
	}
}

export default component$(() => {
	const settings = useStoreSettings();
	const isOpen = useSignal(true);

	useVisibleTask$(({ track }) => {
		track(() => settings.value);

		const checkStatus = () => {
			// Manual closure always takes priority
			if (settings.value?.storeOpen === false) {
				isOpen.value = false;
				return;
			}
			// Otherwise, check operating hours
			isOpen.value = getIsOpenBySchedule(settings.value ?? {});
		};

		checkStatus();
		// Re-check every minute
		const interval = setInterval(checkStatus, 60000);
		return () => clearInterval(interval);
	});

	return (
		<div class="flex items-center">
			<div class="pr-2 font-bold text-white">Open:</div>
			<Indicator isOpen={isOpen.value} />
		</div>
	)
})