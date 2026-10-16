import type { RequestHandler } from "@builder.io/qwik-city";
import { absoluteUrl } from "~/lib/site";

export const onGet: RequestHandler = ({ headers, send }) => {
  headers.set("Content-Type", "text/plain; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=3600");
  send(200, `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`);
};
