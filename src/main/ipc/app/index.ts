import {
  appVersion,
  checkForUpdates,
  currentPlatfom,
  onUpdateStatus,
  restartAndInstall,
} from './handlers';

export const app = {
  currentPlatfom,
  appVersion,
  checkForUpdates,
  restartAndInstall,
  onUpdateStatus,
};
