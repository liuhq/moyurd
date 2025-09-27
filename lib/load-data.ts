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
const _persistentData = z.object({
    recent: z.array(_bookCache),
})

export type BookCache = z.infer<typeof _bookCache>
export type PersistentData = z.infer<typeof _persistentData>

export const loadPersistentData = async (
    path: string,
): Promise<PersistentData> => {
    const data = await readFile(path, { encoding: 'utf8' }).catch(() => '')
    const parsed = _persistentData.safeParse(JSON.parse(data))
    if (parsed.success) {
        return parsed.data
    } else {
        return { recent: [] }
    }
}

export const savePersistentData = async (
    path: string,
    data: PersistentData,
) => {
    const parsed = _persistentData.safeParse(data)
    if (!parsed.success) return
    await writeFile(path, JSON.stringify(parsed.data))
}
