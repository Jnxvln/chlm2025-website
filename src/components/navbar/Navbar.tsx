import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

export default component$(() => {
	const location = useLocation();

	const navLinks = [
		{ href: "/", label: "Home" },
		{ href: "/materials/", label: "Materials" },
		{ href: "/calculator/", label: "Calculator" },
		{ href: "/help/", label: "Help" },
		{ href: "/contact/", label: "Contact" },
	];

	const isActive = (href: string) => {
		if (href === "/") {
			return location.url.pathname === "/";
		}
		return location.url.pathname.startsWith(href);
	};

	return (
		<nav class="bg-gradient-to-r from-[#291c0d] via-[#554128] to-[#352512] shadow-lg sticky top-0 z-50 mb-4">
			<div class="max-w-6xl mx-auto px-2 sm:px-4">
				<div class="flex flex-wrap justify-center gap-1 sm:gap-2 p-2">
					{navLinks.map((link) => {
						const active = isActive(link.href);
						const linkClass = [
							"inline-block px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base",
							"transition-all duration-200 rounded",
							active
								? "bg-[#6d5230] text-white shadow-md"
								: "text-white hover:bg-[#352717]"
						].join(" ");

						return (
							<Link key={link.href} href={link.href} class={linkClass}>
								{link.label}
							</Link>
						);
					})}
				</div>
			</div>
		</nav>
	);
});
