import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  // loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: () =>
    z.object({
      id: z.string(),
      title: z.string(),
      public: z.boolean(),
      publishedAt: z.date(),

      editedAt: z.date().nullable().optional(),
      description: z.string().nullable().optional(),
      image: z.string().nullable().optional(),
      tags: z.array(z.string()).nullable().optional(),
      category: z.string().nullable().optional(),
      lang: z.string().nullable().optional(),
    }),
});

export const collections = { blog };
