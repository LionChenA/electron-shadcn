import '@testing-library/jest-dom';
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleTheme from '../../src/renderer/components/ToggleTheme';

// Mock the theme API
Object.defineProperty(window, 'themeMode', {
  value: {
    current: vi.fn().mockResolvedValue('light'),
    dark: vi.fn().mockResolvedValue(undefined),
    light: vi.fn().mockResolvedValue(undefined),
    toggle: vi.fn().mockResolvedValue(true),
    system: vi.fn().mockResolvedValue(false),
  },
  writable: true,
});

describe('Theme Integration', () => {
  beforeEach(() => {
    // Reset theme before each test
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
    vi.clearAllMocks();
  });

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
    expect(window.themeMode.toggle).toHaveBeenCalled();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
