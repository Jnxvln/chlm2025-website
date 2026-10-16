import { nodeServerAdapter } from "@builder.io/qwik-city/adapters/node-server/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.express.tsx", "@qwik-city-plan"],
      },
    },
    plugins: [
      nodeServerAdapter({
        name: "express",
        // The sitemap is served by src/routes/sitemap.xml. Without this, SSG
        // writes an empty dist/sitemap.xml that Express serves first.
        ssg: { sitemapOutFile: null },
      }),
    ],
  };
});
