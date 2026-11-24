import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: ({ image }) => {
    const photo = z.object({ src: image(), alt: z.string().trim().min(1), caption: z.string().optional(), aspect: z.enum(['landscape','portrait','square']).optional() });
    return z.object({
      title: z.string().trim().min(1), eventType: z.string().trim().min(1),
      services: z.array(z.enum(['catering','decoration','baking','confectionery'])).min(1),
      description: z.string().trim().min(1), location: z.string().optional(), date: z.string().optional(),
      published: z.boolean().default(false), permission: z.boolean().default(false), featured: z.boolean().default(false),
      cover: photo.optional(), photos: z.array(photo).default([]),
      testimonial: z.object({ quote: z.string().trim().min(1), attribution: z.string().trim().min(1), permission: z.boolean().default(false) }).optional(),
    });
  },
});
export const collections = { projects };
