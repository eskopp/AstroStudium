import type { z } from 'astro/zod';

export declare const docsSchema: z.ZodObject<{
  title: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  weight: z.ZodDefault<z.ZodNumber>;
}>;
