import { z } from 'astro/zod';

export const docsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  weight: z.number().default(100),
  aliases: z.array(z.string()).default([]),
  tiles: z.boolean().default(true),
});
