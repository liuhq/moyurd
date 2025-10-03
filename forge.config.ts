import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { VitePlugin } from '@electron-forge/plugin-vite'
import type { ForgeConfig } from '@electron-forge/shared-types'
import { FuseV1Options, FuseVersion } from '@electron/fuses'

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        icon: './images/icon',
        executableName: 'moyurd',
        extraResource: ['./images/icon.ico', './images/icon.png'],
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({
            name: 'moyurd',
            description: 'A simple Epub Reader',
            authors: 'Horace Liu',
            setupIcon: './images/icon.ico',
        }),
        new MakerZIP({}, ['darwin']),
        new MakerDeb({
            options: {
                name: 'moyurd',
                productName: 'moyurd',
                description: 'A simple Epub Reader',
                productDescription: 'A simple Epub Reader',
                icon: './images/icon.png',
                maintainer: 'Horace Liu',
                homepage: 'https://github.com/liuhq/moyurd',
            },
        }),
    ],
    plugins: [
        new VitePlugin({
            // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
            // If you are familiar with Vite configuration, it will look really familiar.
            build: [
                {
                    // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                    entry: 'main/main.ts',
                    config: 'vite.main.config.ts',
                    target: 'main',
                },
                {
                    entry: 'main/preload.ts',
                    config: 'vite.preload.config.ts',
                    target: 'preload',
                },
            ],
            renderer: [
                {
                    name: 'main_window',
                    config: 'vite.renderer.config.mts',
                },
            ],
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
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
}

export default config
