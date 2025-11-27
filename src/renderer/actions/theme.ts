import { LOCAL_STORAGE_KEYS } from '@/shared/constants';
import { ipc } from '@/shared/ipc/manager';
import type { ThemeMode } from '@/shared/types/themeMode';

export interface ThemePreferences {
  system: ThemeMode;
  local: ThemeMode | null;
}

export async function getCurrentTheme(): Promise<ThemePreferences> {
  const currentTheme = await ipc.client.theme.getCurrentThemeMode();
  const localTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as ThemeMode | null;

  return {
    system: currentTheme,
    local: localTheme,
  };
}

export async function setTheme(newTheme: ThemeMode) {
  await ipc.client.theme.setThemeMode(newTheme);
  localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
}

export async function toggleTheme() {
  const isDarkMode = await ipc.client.theme.toggleThemeMode();
  const newTheme = isDarkMode ? 'dark' : 'light';

  updateDocumentTheme(isDarkMode);
  localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
}

export async function syncWithLocalTheme() {
  const { local } = await getCurrentTheme();
  if (!local) {
    setTheme('system');
    return;
  }

  await setTheme(local);
}

function updateDocumentTheme(isDarkMode: boolean) {
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
