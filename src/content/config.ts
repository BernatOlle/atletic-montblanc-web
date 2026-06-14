import { defineCollection, z } from 'astro:content';

const carreres = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    race: z.enum(['sant-joan', 'sant-silvestre', 'cursa-dona', 'sant-josep']),
    year: z.number(),
    date: z.coerce.date(),
    edition: z.number().optional(),
    distance: z.number().optional(),
    elevation: z.number().optional(),
    location: z.string().optional(),
    registrationUrl: z.string().optional(),
    registrationDeadline: z.coerce.date().optional(),
    reglamentUrl: z.string().optional(),
    recorregutUrl: z.string().optional(),
    resultsUrl: z.string().optional(),
    photosUrl: z.string().optional(),
    photos: z.array(z.string()).optional(),
    image: z.string().optional(),
    modalities: z.array(z.object({
      name: z.string(),
      edition: z.string().optional(),
      type: z.enum(['cursa', 'caminada']).optional(),
      startTime: z.string().optional(),
      dorsalPickup: z.string().optional(),
      price: z.number().optional(),
      maxParticipants: z.number().optional(),
      registrationUrl: z.string().optional(),
    })).optional(),
    featured: z.boolean().default(false),
  }),
});

const caminades = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    distance: z.number().optional(),
    elevation: z.number().optional(),
    difficulty: z.enum(['fàcil', 'moderat', 'difícil']).optional(),
    duration: z.string().optional(),
    meetingPoint: z.string().optional(),
    image: z.string().optional(),
    photosUrl: z.string().optional(),
    routeUrl: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const noticies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { carreres, caminades, noticies };
