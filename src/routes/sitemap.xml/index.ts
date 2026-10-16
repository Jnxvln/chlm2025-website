import type { RequestHandler } from "@builder.io/qwik-city";
import { absoluteUrl } from "~/lib/site";

/**
 * Public pages to list. Add new routes here (and per-material pages later,
 * once materials come from the database).
 */
const PAGES = ["/", "/materials/", "/calculator/", "/help/", "/contact/"];

export const onGet: RequestHandler = ({ headers, send }) => {
  const urls = PAGES.map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  headers.set("Content-Type", "application/xml; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=3600");
  send(200, xml);
};
