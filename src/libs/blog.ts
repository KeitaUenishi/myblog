// src/lib/note.ts

import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export async function getAllPublicBlogs(): Promise<CollectionEntry<"blog">[]> {
  const notes = await getCollection("blog", ({ data }) => {
    return import.meta.env.DEV || data.public === true;
  });
  return notes.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

// ユーティリティ関数
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function generateBlogPath(id: string): string {
  return `/${id}`;
}
