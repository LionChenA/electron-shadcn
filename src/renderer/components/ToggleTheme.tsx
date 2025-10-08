import { Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toggleTheme } from '@/theme/service';

export default function ToggleTheme() {
  return (
    <Button onClick={toggleTheme} size="icon">
      <Moon size={16} />
    </Button>
  );
}
