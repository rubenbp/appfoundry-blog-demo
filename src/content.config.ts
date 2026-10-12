import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const juegos = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/juegos' }),
	schema: z.object({
		title: z.string(),
		year: z.number().int(),
		platform: z.string(),
		generation: z.enum(['8 bits', '16 bits', '32 bits']),
		genre: z.string(),
		developer: z.string(),
		publisher: z.string(),
		players: z.string(),
		playtime: z.string(),
		rating: z.number().min(1).max(5),
		featured: z.boolean().default(false),
		visual: z.enum(['mario', 'sonic', 'tetris', 'street-fighter', 'donkey-kong', 'outrun', 'zelda', 'chrono-trigger', 'castlevania']),
		palette: z.enum(['theme-lime', 'theme-orange', 'theme-blue', 'theme-pink', 'theme-violet', 'theme-sky']),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { juegos };
