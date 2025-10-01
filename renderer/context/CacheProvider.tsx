import type { DataCache } from '#lib/load-data'
import { type ParentComponent, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { CacheContext } from './create'

export const CacheProvider: ParentComponent<{ initialCache: DataCache }> = (
    props,
) => {
    const [cache, setCache] = createStore<DataCache>(props.initialCache)
    return (
        <CacheContext.Provider value={[cache, setCache]}>
            {props.children}
        </CacheContext.Provider>
    )
}

export const useCache = () => {
    const context = useContext(CacheContext)
    if (!context) {
        throw new Error("can't find CacheContext")
    }
    return context
}
