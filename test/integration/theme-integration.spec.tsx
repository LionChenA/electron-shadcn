import '@testing-library/jest-dom';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleTheme from '../../src/renderer/components/ToggleTheme';
import { ipc } from '../../src/shared/ipc/manager';

vi.mock('../../src/shared/ipc/manager', () => ({
  ipc: {
    client: {
      theme: {
        toggleThemeMode: vi.fn().mockResolvedValue(true),
        setThemeMode: vi.fn().mockResolvedValue(undefined),
        getCurrentThemeMode: vi.fn().mockResolvedValue('light'),
      },
    },
  },
}));

describe('Theme Integration', () => {
  test('toggle theme component renders button', async () => {
    render(<ToggleTheme />);

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  test('toggle theme component has moon icon initially', async () => {
    render(<ToggleTheme />);

    const toggleButton = screen.getByRole('button');
    expect(toggleButton.querySelector('.lucide-moon')).toBeInTheDocument();
  });

  test('clicking toggle switches theme to dark', async () => {
    const user = userEvent.setup();
    render(<ToggleTheme />);

    const toggleButton = screen.getByRole('button');

    await user.click(toggleButton);

    // Verify theme API was called
    expect(ipc.client.theme.toggleThemeMode).toHaveBeenCalled();
  });
});
