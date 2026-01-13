import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    desc: z.string().optional(),
    date: z.string().optional()
  })
})

export const collections = {
  articles
}
