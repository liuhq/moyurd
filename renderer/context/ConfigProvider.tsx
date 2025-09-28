import type { Config as MoyurdConfig } from '#lib/load-data'
import { type ParentComponent, useContext } from 'solid-js'
import { ConfigContext } from './create'

export const ConfigProvider: ParentComponent<{ initialConfig: MoyurdConfig }> =
    (props) => {
        return (
            <ConfigContext.Provider value={props.initialConfig}>
                {props.children}
            </ConfigContext.Provider>
        )
    }

export const useConfig = () => {
    const context = useContext(ConfigContext)
    if (!context) {
        throw new Error("can't find ConfigContext")
    }
    return context
}
