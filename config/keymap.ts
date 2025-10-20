import type { CommandEvents } from './command'

export type KeymapMode =
    | 'global'
    | 'booklist'
    | 'reading'
    | 'toc'
    | 'searchline'
    | 'keymap'

type KeymapEntry = {
    [K in keyof CommandEvents]: {
        command: K
        payload?: CommandEvents[K]
        desc?: string
    }
}[keyof CommandEvents]

export type Keymap = {
    [Shortcut: string]: KeymapEntry
}

export type KeymapConfig = {
    [K in KeymapMode]: Keymap
}

export const keymap: KeymapConfig = {
    'global': {
        'Q': {
            command: 'quit',
            desc: 'Quit',
        },
        ' ': {
            command: 'win',
            payload: 'minimize',
            desc: 'Minimize Current Window',
        },
        'M': {
            command: 'win',
            payload: 'maximize',
            desc: 'Maximize Current Window',
        },
        'Shift+M': {
            command: 'win',
            payload: 'unmaximize',
            desc: 'Unmaximize Current Window',
        },
        'Shift+?': {
            command: 'keymap',
            payload: true,
            desc: 'Show Keymap Help',
        },
    },
    'booklist': {
        'O': {
            command: 'openfiledialog',
            desc: 'Open a File',
        },
        'K': {
            command: 'bookprev',
            payload: 1,
            desc: 'Prev Book Item',
        },
        'J': {
            command: 'booknext',
            payload: 1,
            desc: 'Next Book Item',
        },
        'U': {
            command: 'bookprev',
            payload: 5,
            desc: 'Prev 5 Book Item',
        },
        'D': {
            command: 'booknext',
            payload: 5,
            desc: 'Next 5 Book Item',
        },
        'F': {
            command: 'bookprev',
            payload: 10,
            desc: 'Prev 10 Book Item',
        },
        'B': {
            command: 'booknext',
            payload: 10,
            desc: 'Next 10 Book Item',
        },
        'G': {
            command: 'bookprev',
            payload: 'top',
            desc: 'First Book Item',
        },
        'Shift+G': {
            command: 'booknext',
            payload: 'bottom',
            desc: 'Last Book Item',
        },
        'Enter': {
            command: 'bookselect',
            desc: 'Open Seleted Book Item',
        },
    },
    'reading': {
        'C': {
            command: 'close',
            desc: 'Close Book',
        },
        '/': {
            command: 'searchline',
            payload: true,
            desc: 'Open Search Line',
        },
        'T': {
            command: 'toc',
            payload: true,
            desc: 'Open Table of Contents',
        },
        'H': {
            command: 'loadprev',
            desc: 'Load Prev Chapter',
        },
        'L': {
            command: 'loadnext',
            desc: 'Load Next Chapter',
        },
        'K': {
            command: 'scrollup',
            payload: 1,
            desc: 'Scroll Up 1 Line',
        },
        'J': {
            command: 'scrolldown',
            payload: 1,
            desc: 'Scroll Down 1 Line',
        },
        'U': {
            command: 'scrollup',
            payload: 'half',
            desc: 'Scroll Up Half Page',
        },
        'D': {
            command: 'scrolldown',
            payload: 'half',
            desc: 'Scroll Down Half Page',
        },
        'F': {
            command: 'scrollup',
            payload: 'page',
            desc: 'Scroll Up 1 Page',
        },
        'B': {
            command: 'scrolldown',
            payload: 'page',
            desc: 'Scroll Down 1 Page',
        },
        'G': {
            command: 'scrollup',
            payload: 'top',
            desc: 'Scroll to Top',
        },
        'Shift+G': {
            command: 'scrolldown',
            payload: 'bottom',
            desc: 'Scroll to Bottom',
        },
    },
    'toc': {
        'Escape': {
            command: 'toc',
            payload: false,
            desc: 'Close Table of Contents',
        },
        'K': {
            command: 'tocprev',
            payload: 1,
            desc: 'Prev TOC Item',
        },
        'J': {
            command: 'tocnext',
            payload: 1,
            desc: 'Next TOC Item',
        },
        'U': {
            command: 'tocprev',
            payload: 5,
            desc: 'Prev 5 TOC Item',
        },
        'D': {
            command: 'tocnext',
            payload: 5,
            desc: 'Next 5 TOC Item',
        },
        'F': {
            command: 'tocprev',
            payload: 10,
            desc: 'Prev 10 TOC Item',
        },
        'B': {
            command: 'tocnext',
            payload: 10,
            desc: 'Next 10 TOC Item',
        },
        'G': {
            command: 'tocprev',
            payload: 'top',
            desc: 'First TOC Item',
        },
        'Shift+G': {
            command: 'tocnext',
            payload: 'bottom',
            desc: 'Last TOC Item',
        },
        'Enter': {
            command: 'tocselect',
            desc: 'Jump to Seleted TOC Item',
        },
    },
    'searchline': {
        // 'Escape': {
        //     command: 'searchline',
        //     payload: false,
        //     desc: 'Close Search Line',
        // },
        // 'Enter': {
        //     command: 'commit',
        //     desc: 'Confirm Search',
        // },
    },
    'keymap': {
        'Escape': {
            command: 'keymap',
            payload: false,
            desc: 'Close Keymap Help',
        },
        'K': {
            command: 'scrollup',
            payload: 1,
            desc: 'Scroll Up 1 Line',
        },
        'J': {
            command: 'scrolldown',
            payload: 1,
            desc: 'Scroll Down 1 Line',
        },
        'U': {
            command: 'scrollup',
            payload: 'half',
            desc: 'Scroll Up Half Page',
        },
        'D': {
            command: 'scrolldown',
            payload: 'half',
            desc: 'Scroll Down Half Page',
        },
        'F': {
            command: 'scrollup',
            payload: 'page',
            desc: 'Scroll Up 1 Page',
        },
        'B': {
            command: 'scrolldown',
            payload: 'page',
            desc: 'Scroll Down 1 Page',
        },
        'G': {
            command: 'scrollup',
            payload: 'top',
            desc: 'Scroll to Top',
        },
        'Shift+G': {
            command: 'scrolldown',
            payload: 'bottom',
            desc: 'Scroll to Bottom',
        },
    },
}
