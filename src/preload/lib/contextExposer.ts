import { exposeThemeContext } from '../ipc/themeContext';
import { exposeWindowContext } from '../ipc/windowContext';

export default function exposeContexts() {
  exposeWindowContext();
  exposeThemeContext();
}
