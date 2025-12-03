import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { VitePlugin } from '@electron-forge/plugin-vite';
import type { ForgeConfig } from '@electron-forge/shared-types';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    // --------------------------------------------------------------------------------
    // --- PLACEHOLDER FOR MACOS CODE SIGNING ---
    // To enable auto-updates on macOS, your application must be code-signed.
    // This requires an Apple Developer account and is out of scope for this template.
    //
    // 1. Set up your environment variables (e.g., in a .env file):
    //    APPLE_ID=your-apple-id@example.com
    //    APPLE_ID_PASSWORD=your-app-specific-password
    //    APPLE_TEAM_ID=YOUR_TEAM_ID
    //
    // 2. Ensure 'entitlements.mac.plist' exists in the project root.
    //
    // 3. Uncomment the osxSign block below.
    //
    // For more details, see the Electron Forge documentation on macOS signing.
    // --------------------------------------------------------------------------------
    /*
    osxSign: {
      identity: `Developer ID Application: YOUR_NAME (YOUR_TEAM_ID)`,
      'hardened-runtime': true,
      'gatekeeper-assess': false,
      entitlements: 'entitlements.mac.plist',
      'entitlements-inherit': 'entitlements.mac.plist',
    },
    */
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  publishers: [
    {
      /*
       * Publish release on GitHub as draft.
       * Remember to manually publish it on GitHub website after verifying everything is correct.
       */
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'LionChenA',
          name: 'electron-shadcn',
        },
        draft: true,
        prerelease: false,
      },
    },
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main/index.ts',
          config: 'vite.main.config.mts',
        },
        {
          entry: 'src/preload/index.ts',
          config: 'vite.preload.config.mts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.mts',
        },
      ],
    }),

    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
