import { Moon } from 'lucide-react';
import { Button } from '@/renderer/components/ui/Button';
import { toggleTheme } from '@/renderer/theme/service';

export default function ToggleTheme() {
  return (
    <Button onClick={toggleTheme} size="icon">
      <Moon size={16} />
    </Button>
  );
}
