import type { BrowserWindow } from 'electron';
import { addThemeEventListeners } from './themeListeners';
import { addWindowEventListeners } from './windowListeners';

export default function registerListeners(mainWindow: BrowserWindow) {
  addWindowEventListeners(mainWindow);
  addThemeEventListeners();
}
