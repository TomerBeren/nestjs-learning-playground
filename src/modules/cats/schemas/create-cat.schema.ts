import { z } from 'zod';

export const createCatSchema = z
  .object({
    name: z.string().min(1),
    age: z.number().min(0),
    breed: z.string().min(1),
  })
  .required();

export type CreateCatDto = z.infer<typeof createCatSchema>;