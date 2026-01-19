import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import rehypeInlineCodeStrong from "./src/libs/rehypeInlineCodeStrong";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [expressiveCode(), mdx(), sitemap(), icon()],

  markdown: {
    rehypePlugins: [rehypeInlineCodeStrong],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
