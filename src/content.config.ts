import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    game: z.enum(['minecraft', 'gtav', 'stardew']),
    kind: z.enum(['mod', 'tool', 'resource']).default('mod'),
    summary: z.string(),
    /** Repo name inside the GitHub org; powers stars, latest release, etc. */
    repo: z.string().optional(),
    /** Extra download/store links, e.g. Modrinth, CurseForge, Nexus Mods. */
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
