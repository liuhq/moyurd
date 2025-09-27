import {
    type EpubCollection,
    type EpubFile,
    initEpubFile,
    type NavPoint,
} from '@lingo-reader/epub-parser'

export type { EpubFile } from '@lingo-reader/epub-parser'

export interface EpubTocItem extends NavPoint {
    anchor: {
        id?: string
        selector?: string
    }
    children?: EpubTocItem[]
}

export type EpubTocTree = EpubTocItem[]
export type EpubTocFlat = {
    items: Omit<EpubTocItem, 'children'>[]
    idMap: Map<string, number>
}

export interface EpubBook {
    fileName: string
    bookName: string
    publisher?: string
    collection: EpubCollection
    tocTree: EpubTocTree
    tocFlat: EpubTocFlat
}

type ParseEpubOption = {
    resourceSavePath: string
}

const flatToc = (toc: EpubTocTree): Omit<EpubTocItem, 'children'>[] =>
    toc.flatMap((t) => {
        const { children, ...withoutChildren } = t
        return [
            withoutChildren,
            ...(children ? flatToc(children) : []),
        ]
    })

export const parseEpub = async (
    path: string,
    option: ParseEpubOption,
): Promise<[EpubBook, EpubFile]> => {
    const epub = await initEpubFile(
        path,
        option.resourceSavePath,
    )

    const fileInfo = epub.getFileInfo()
    const metaData = epub.getMetadata()
    const collection = epub.getCollection()
    const tocTree = epub.getToc().map((toc) => {
        const resolveHref = (np: NavPoint): EpubTocItem => {
            const { id, selector } = epub.resolveHref(np.href)
                ?? { id: undefined, selector: undefined }
            if (np.children) {
                return {
                    ...np,
                    anchor: { id, selector },
                    children: np.children.map((c) => resolveHref(c)),
                }
            } else {
                return {
                    ...np,
                    anchor: { id, selector },
                    children: undefined,
                }
            }
        }

        return resolveHref(toc)
    })
    const tocFlatItem = flatToc(tocTree)
    const tocFlatMap = new Map<string, number>()
    tocFlatItem.map((v, i) => tocFlatMap.set(v.id, i))

    return [{
        fileName: fileInfo.fileName,
        bookName: metaData.title,
        publisher: metaData.publisher,
        collection,
        tocTree,
        tocFlat: {
            items: tocFlatItem,
            idMap: tocFlatMap,
        },
    }, epub]
}
