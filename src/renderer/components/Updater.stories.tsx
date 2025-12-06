import type { Meta, StoryObj } from '@storybook/react';
import {
  appAppVersionHandler,
  appCheckForUpdatesHandler,
  appCurrentPlatfomHandler,
  appOnUpdateStatusHandler,
  appRestartAndInstallHandler,
} from '../../../test/mocks/gen/msw/app';
import { Updater } from './Updater';

const meta = {
  title: 'Components/Updater',
  component: Updater,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // Default handlers for all stories in this file
    msw: {
      handlers: [
        appCurrentPlatfomHandler(() => ({ body: 'darwin' })),
        appAppVersionHandler(() => ({ body: '1.0.0' })),
        appCheckForUpdatesHandler(() => ({ body: undefined })), // No specific body needed for void
        appRestartAndInstallHandler(() => ({ body: undefined })), // No specific body needed for void
        // Default onUpdateStatus handler, can be overridden by individual stories
        appOnUpdateStatusHandler(() => {
          return { event: 'message', data: { status: 'not-available' } };
        }),
      ],
    },
  },
} satisfies Meta<typeof Updater>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // Uses default MSW handlers
};

export const CheckingForUpdates: Story = {
  parameters: {
    msw: {
      handlers: [
        appOnUpdateStatusHandler(() => {
          return {
            event: 'message',
            data: { status: 'checking', message: 'Checking for updates...' },
          };
        }),
      ],
    },
  },
};

export const UpdateAvailable: Story = {
  parameters: {
    msw: {
      handlers: [
        appOnUpdateStatusHandler(() => {
          return {
            event: 'message',
            data: { status: 'available', message: 'Update available. Downloading...' },
          };
        }),
      ],
    },
  },
};

export const UpdateDownloaded: Story = {
  parameters: {
    msw: {
      handlers: [
        appOnUpdateStatusHandler(() => {
          return {
            event: 'message',
            data: { status: 'downloaded', message: 'Update downloaded. Restart to install.' },
          };
        }),
      ],
    },
  },
};

export const UpdateError: Story = {
  parameters: {
    msw: {
      handlers: [
        appOnUpdateStatusHandler(() => {
          return {
            event: 'message',
            data: { status: 'error', message: 'Failed to check for updates.' },
          };
        }),
      ],
    },
  },
};
