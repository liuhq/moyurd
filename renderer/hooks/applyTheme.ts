import type { Config as MoyurdConfig } from '#lib/load-data'

const wrapPx = (value: number) => `${value}px`

export const applyTheme = (config: MoyurdConfig) => {
    const root = document.documentElement

    root.style.setProperty('--bg', config.colors.bg)
    root.style.setProperty('--floating-bg', config.colors.floatingBg)
    root.style.setProperty('--fg', config.colors.fg)
    root.style.setProperty('--sub-fg', config.colors.subFg)

    root.style.setProperty('--list-select-bg', config.colors.listSelectBg)
    root.style.setProperty('--list-current-bg', config.colors.listCurrentBg)
    root.style.setProperty('--list-select-fg', config.colors.listSelectFg)
    root.style.setProperty(
        '--list-select-sub-fg',
        config.colors.listSelectSubFg,
    )

    root.style.setProperty('--border', config.colors.border)
    root.style.setProperty('--panel-mask', config.colors.shadow)

    root.style.setProperty('--popup-w', wrapPx(config.popup.width))
    root.style.setProperty('--popup-gap', wrapPx(config.popup.gap))
    root.style.setProperty('--popup-radius', wrapPx(config.popup.radius))
    root.style.setProperty('--info', config.popup.colors.info)
    root.style.setProperty('--warn', config.popup.colors.warn)
    root.style.setProperty('--error', config.popup.colors.error)
}
