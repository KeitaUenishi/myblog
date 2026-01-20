import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";

import rehypeInlineCodeStrong from "./src/libs/rehypeInlineCodeStrong";
import rehypeRemoveDetailsOpen from "./src/libs/rehypeRemoveDetailsOpen";
import remarkCallout from "./src/libs/remarkCallout";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [expressiveCode(), mdx(), sitemap(), icon()],

  markdown: {
    remarkPlugins: [remarkCallout],
    rehypePlugins: [rehypeInlineCodeStrong, rehypeRemoveDetailsOpen],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
