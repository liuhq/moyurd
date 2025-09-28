import type { Config as MoyurdConfig } from '#lib/load-data'

export const applyTheme = (colors: MoyurdConfig['colors']) => {
    const root = document.documentElement

    root.style.setProperty('--bg', colors.bg)
    root.style.setProperty('--fg', colors.fg)
    root.style.setProperty('--sub-fg', colors.subFg)
    root.style.setProperty('--inverse-bg', colors.inverseBg)
    root.style.setProperty('--inverse-fg', colors.inverseFg)
    root.style.setProperty('--panel-mask', colors.shadow)
    root.style.setProperty('--accent', colors.accent)
}
