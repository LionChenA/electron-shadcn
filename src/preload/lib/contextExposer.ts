import { exposeThemeContext } from '@/preload/ipc/themeContext';
import { exposeWindowContext } from '@/preload/ipc/windowContext';

export default function exposeContexts() {
  exposeWindowContext();
  exposeThemeContext();
}
