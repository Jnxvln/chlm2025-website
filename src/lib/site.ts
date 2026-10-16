/**
 * Business details and site-wide constants. Everything that shows the phone
 * number, address, or site URL should read from here.
 */

/**
 * Public origin used for canonical URLs, Open Graph tags, and the sitemap.
 * Set PUBLIC_SITE_ORIGIN at build time (Railway service variable) when the
 * site moves to its own domain. No trailing slash.
 */
export const SITE_ORIGIN: string = (
  import.meta.env.PUBLIC_SITE_ORIGIN ||
  "https://chlm2025-website-production.up.railway.app"
).replace(/\/+$/, "");

export const BUSINESS = {
  name: "C&H Landscape Materials",
  phone: {
    display: "903-334-7350",
    /** E.164 for tel: links and structured data */
    e164: "+19033347350",
  },
  address: {
    street: "5725 W 7th St.",
    city: "Texarkana",
    region: "TX",
    postalCode: "75501",
    country: "US",
  },
  /** Profiles that represent the business (e.g. the Facebook page). Used as schema.org sameAs. */
  sameAs: ["https://www.facebook.com/ChLandscapeMaterials"] as string[],
} as const;

export const ADDRESS_ONE_LINE = `${BUSINESS.address.street} ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}`;

export const PHONE_HREF = `tel:${BUSINESS.phone.e164}`;

export const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.name}, ${ADDRESS_ONE_LINE}`,
)}`;

export const OG_IMAGE = {
  path: "/images/CHLM_OG_Image.jpg",
  width: 1200,
  height: 630,
};

/** Absolute URL for a site path. */
export const absoluteUrl = (path: string): string =>
  `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
