export const isMacOS = (): boolean => {
  return window?.navigator.platform.includes('Mac');
};
