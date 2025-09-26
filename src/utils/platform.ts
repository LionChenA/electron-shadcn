/**
 * Platform detection utilities
 */

/**
 * Check if the current platform is macOS
 * @returns true if running on macOS, false otherwise
 */
export const isMacOS = (): boolean => {
  return window?.navigator.platform.includes("Mac");
};
