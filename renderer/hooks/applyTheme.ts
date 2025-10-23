import type { Config as MoyurdConfig } from '#lib/load-data'

const wrapPx = (value: number) => `${value}px`

export const applyTheme = (config: MoyurdConfig) => {
    const root = document.documentElement

    root.style.setProperty('--bg', config.colors.bg)
    root.style.setProperty('--fg', config.colors.fg)
    root.style.setProperty('--sub-fg', config.colors.subFg)
    root.style.setProperty('--inverse-bg', config.colors.inverseBg)
    root.style.setProperty('--inverse-fg', config.colors.inverseFg)
    root.style.setProperty('--panel-mask', config.colors.shadow)
    root.style.setProperty('--accent', config.colors.accent)

    root.style.setProperty('--popup-w', wrapPx(config.popup.width))
    root.style.setProperty('--popup-gap', wrapPx(config.popup.gap))
    root.style.setProperty('--popup-radius', wrapPx(config.popup.radius))
    root.style.setProperty('--popup-bg', config.popup.colors.bg)
    root.style.setProperty('--popup-border', config.popup.colors.border)
    root.style.setProperty('--info', config.popup.colors.info)
    root.style.setProperty('--warn', config.popup.colors.warn)
    root.style.setProperty('--error', config.popup.colors.error)
}
