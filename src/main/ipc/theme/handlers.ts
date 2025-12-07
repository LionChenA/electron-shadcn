import { os } from '@orpc/server';
import { nativeTheme } from 'electron';
import * as z from 'zod'; // Import zod
import { setThemeModeInputSchema } from './schemas';

const ThemeSourceSchema = z.union([z.literal('system'), z.literal('light'), z.literal('dark')]);

export const getCurrentThemeMode = os.output(ThemeSourceSchema).handler(() => {
  return nativeTheme.themeSource;
});

export const toggleThemeMode = os.output(z.boolean()).handler(() => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }

  return nativeTheme.shouldUseDarkColors;
});

export const setThemeMode = os
  .input(setThemeModeInputSchema)
  .output(ThemeSourceSchema)
  .handler(({ input }) => {
    const { mode } = input;
    switch (mode) {
      case 'light':
        nativeTheme.themeSource = 'light';
        break;
      case 'dark':
        nativeTheme.themeSource = 'dark';
        break;
      case 'system':
        nativeTheme.themeSource = 'system';
        break;
    }

    return nativeTheme.themeSource;
  });
