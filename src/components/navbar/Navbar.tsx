import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import './navbar.css'

export default component$(() => {
	const location = useLocation();
	const isSticky = useSignal(false);
	const isMobileMenuOpen = useSignal(false);

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

	// Add scroll tracking
	useVisibleTask$(({ cleanup }) => {
	const handleScroll = () => {
		const shouldBeSticky = window.scrollY > 100; // Adjust threshold as needed
		isSticky.value = shouldBeSticky;
		
		// Add/remove body padding when navbar becomes sticky
		if (shouldBeSticky) {
			document.body.style.paddingTop = '80px';
		} else {
			document.body.style.paddingTop = '0';
		}
	};
	
	window.addEventListener('scroll', handleScroll);
	cleanup(() => {
		window.removeEventListener('scroll', handleScroll);
		document.body.style.paddingTop = '0'; // Reset on cleanup
	});
	});

	return (
		<nav class={`navbar ${isSticky.value ? 'fixed top-0 left-0 w-full shadow-lg' : 'relative'} bg-gradient-to-r from-[#291c0d] via-[#554128] to-[#352512] z-[1000]`}>
			<div class="md:max-w-6xl mx-auto px-2 sm:px-4">
				{/* Desktop and Mobile Header */}
				<div class="flex justify-between items-center py-3">
					{/* Mobile: Hamburger Menu Button (Left Side) */}
					<div class="md:hidden flex-1">
						<button
							class="text-white p-2 rounded hover:bg-[#352717] transition-colors duration-200"
							onClick$={() => isMobileMenuOpen.value = !isMobileMenuOpen.value}
							aria-label="Toggle mobile menu"
						>
							{/* Hamburger Icon */}
							<svg class="w-6 h-6 hamburger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								{!isMobileMenuOpen.value ? (
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
								) : (
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								)}
							</svg>
						</button>
					</div>

					{/* Desktop: Navigation Links (Center) */}
					<div class="hidden md:flex gap-2 flex-1 justify-center">
						{navLinks.map((link) => {
							const active = isActive(link.href);
							const linkClass = [
								"inline-block px-4 lg:px-6 py-3 font-semibold text-sm lg:text-base",
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

					{/* Top Button (Always Visible - Right Side) */}
					<div class="flex justify-end flex-1 md:flex-initial">
						<button
							class={`navbar-top-button ${isSticky.value ? 'navbar-top-visible' : ''}`}
							onClick$={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
							aria-label="Scroll to top"
						>
							↑ Top
						</button>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				<div class={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen.value ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
					<div class="pb-4 space-y-2">
						{navLinks.map((link) => {
							const active = isActive(link.href);
							const linkClass = [
								"block px-4 py-3 font-semibold text-base rounded mx-2",
								"transition-all duration-200",
								active
									? "bg-[#6d5230] text-white shadow-md"
									: "text-white hover:bg-[#352717]"
							].join(" ");

							return (
								<Link 
									key={link.href} 
									href={link.href} 
									class={linkClass}
									onClick$={() => isMobileMenuOpen.value = false}
								>
									{link.label}
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</nav>
	);
});
