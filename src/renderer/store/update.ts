import { create } from 'zustand';

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'not-available'
  | 'downloaded'
  | 'error';

interface UpdateState {
  status: UpdateStatus;
  message?: string; // To store optional error messages
  setStatus: (status: UpdateStatus, message?: string) => void;
}

export const useUpdateStore = create<UpdateState>((set) => ({
  status: 'idle',
  message: undefined,
  setStatus: (status, message) => set({ status, message }),
}));
