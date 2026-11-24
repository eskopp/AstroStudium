import type { z } from 'astro/zod';

export declare const docsSchema: z.ZodObject<{
  title: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  weight: z.ZodDefault<z.ZodNumber>;
  aliases: z.ZodDefault<z.ZodArray<z.ZodString>>;
  tiles: z.ZodDefault<z.ZodBoolean>;
  abgabe: z.ZodOptional<z.ZodCoercedDate>;
  status: z.ZodOptional<z.ZodEnum<['offen', 'in-arbeit', 'abgegeben']>>;
}>;
