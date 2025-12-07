import { z } from 'zod';

export const setThemeModeInputSchema = z.object({
  mode: z.enum(['light', 'dark', 'system']),
});
