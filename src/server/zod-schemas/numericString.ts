import { z } from 'zod';

export const numericString = z.union([z.number(), z.string()]).transform(e => Number(e));
