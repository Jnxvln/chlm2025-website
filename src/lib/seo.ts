import type { DocumentHeadValue } from "@builder.io/qwik-city";
import { BUSINESS, absoluteUrl } from "./site";

type PageSeo = {
  /** Page-specific title. Omit on the homepage to use the full default title. */
  title?: string;
  description: string;
  /** Route path, e.g. "/materials/". Used for og:url. */
  path: string;
};

const DEFAULT_TITLE = `${BUSINESS.name} | Texarkana, TX`;

/**
 * Per-page head tags. Site-wide tags (og:site_name, og:image, twitter:card,
 * structured data) live in routes/layout.tsx; the canonical link is emitted by
 * RouterHead from the request path.
 *
 * Keys matter: Qwik City merges layout and page heads by `key`.
 */
export const pageHead = ({ title, description, path }: PageSeo): DocumentHeadValue => {
  const fullTitle = title ? `${title} | ${BUSINESS.name}` : DEFAULT_TITLE;
  return {
    title: fullTitle,
    meta: [
      { key: "description", name: "description", content: description },
      { key: "og:title", property: "og:title", content: fullTitle },
      { key: "og:description", property: "og:description", content: description },
      { key: "og:url", property: "og:url", content: absoluteUrl(path) },
      { key: "twitter:title", name: "twitter:title", content: fullTitle },
      { key: "twitter:description", name: "twitter:description", content: description },
    ],
  };
};
