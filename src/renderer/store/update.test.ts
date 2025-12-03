import { beforeEach, describe, expect, it } from 'vitest';
import { type UpdateStatus, useUpdateStore } from './update';

describe('useUpdateStore', () => {
  // Reset the store to its initial state before each test
  beforeEach(() => {
    useUpdateStore.setState({ status: 'idle', message: undefined });
  });

  it('should have an initial status of "idle" and no message', () => {
    const { status, message } = useUpdateStore.getState();
    expect(status).toBe('idle');
    expect(message).toBeUndefined();
  });

  it('should allow setting the status using the setStatus action', () => {
    const { setStatus } = useUpdateStore.getState();
    setStatus('checking');
    const { status, message } = useUpdateStore.getState();
    expect(status).toBe('checking');
    expect(message).toBeUndefined();
  });

  it('should allow setting the status and an optional message', () => {
    const { setStatus } = useUpdateStore.getState();
    setStatus('error', 'Something went wrong');
    const { status, message } = useUpdateStore.getState();
    expect(status).toBe('error');
    expect(message).toBe('Something went wrong');
  });

  it('should allow transitioning through various valid statuses', () => {
    const statuses: UpdateStatus[] = [
      'checking',
      'available',
      'downloaded',
      'not-available',
      'error',
      'idle',
    ];

    for (const testStatus of statuses) {
      useUpdateStore.getState().setStatus(testStatus);
      const { status } = useUpdateStore.getState();
      expect(status).toBe(testStatus);
    }
  });
});
