import { readFile, writeFile } from 'node:fs/promises'
import { z } from 'zod/mini'

const _bookCache = z.object({
    path: z.string(),
    // hash: z.hash('sha256'),
    bookName: z.string(),
    lastRead: z.iso.datetime(),
    lastChapter: z.string(),
    progress: z.number().check(z.minimum(0), z.maximum(1)),
})
const _dataCache = z.object({
    recent: z.array(_bookCache),
})

export type BookCache = z.infer<typeof _bookCache>
export type DataCache = z.infer<typeof _dataCache>

export const loadCache = async (
    path: string,
    fallback: DataCache,
): Promise<DataCache> => {
    const data = await readFile(path, { encoding: 'utf8' }).catch(() => '{}')
    const parsed = _dataCache.safeParse(JSON.parse(data))
    if (parsed.success) {
        return parsed.data
    } else {
        return fallback
    }
}

export const saveCache = async (
    path: string,
    data: DataCache,
) => {
    const parsed = _dataCache.safeParse(data)
    if (!parsed.success) return
    await writeFile(path, JSON.stringify(parsed.data))
}

const _color = z.string().check(
    z.toUpperCase(),
    z.minLength(7),
    z.maxLength(9),
    z.startsWith('#'),
)

const _config = z.object({
    colors: z.object({
        bg: _color,
        fg: _color,
        subFg: _color,
        inverseBg: _color,
        inverseFg: _color,
        shadow: _color,
        accent: _color,
    }),
})

export type Config = z.infer<typeof _config>

export const loadConfig = async (
    path: string,
    fallback: Config,
): Promise<Config> => {
    const data = await readFile(path, { encoding: 'utf8' }).catch(() => '{}')
    const parsed = _config.safeParse(JSON.parse(data))
    if (parsed.success) {
        return parsed.data
    } else {
        return fallback
    }
}

export const saveConfig = async (path: string, data: Config) => {
    const parsed = _config.safeParse(data)
    if (!parsed.success) return
    await writeFile(path, JSON.stringify(parsed.data))
}
