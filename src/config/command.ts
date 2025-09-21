import { z } from 'zod/mini'
import { parser } from '../lib/command-parser'

const _mode = z.enum(['normal', 'command', 'toc', 'search', 'keymap'])
export type Mode = z.infer<typeof _mode>

const _errorMessage = z.enum([
    'EMPTY_INPUT',
    'COMMAND_NOT_FOUND',
    'MISSING_ARGUMENT',
    'FILE_NOT_FOUND',
])
export type ErrorMessage = z.infer<typeof _errorMessage>

const _commandEvents = z.object({
    close: z.void(),
    commandline: z.boolean(),
    commit: z.void(),
    error: z.tuple([_errorMessage, z.string()]),
    keymap: z.void(),
    loadnext: z.void(),
    loadprev: z.void(),
    open: z.string(),
    openfiledialog: z.void(),
    quit: z.void(),
    searchline: z.boolean(),
    scrolldown: z.union([z.number(), z.enum(['half', 'page', 'bottom'])]),
    scrollup: z.union([z.number(), z.enum(['half', 'page', 'top'])]),
    toc: z.boolean(),
    tocnext: z.union([z.number(), z.enum(['bottom'])]),
    tocprev: z.union([z.number(), z.enum(['top'])]),
    tocSelect: z.void(),
    win: z.enum(['maximize', 'max', 'minimize', 'min', 'unmaximize', 'unmax']),
})

export type CommandEvents = z.infer<typeof _commandEvents>

const _commands = new Set(Object.keys(_commandEvents.shape))

export const parseCommand = (
    input: string,
): [string, CommandEvents[keyof CommandEvents]] => {
    if (!input) {
        return [
            'error',
            ['EMPTY_INPUT' as ErrorMessage, 'command-parser::parseCommand'],
        ]
    }
    return parser(input) as [string, CommandEvents[keyof CommandEvents]]
}

export const matchCommand = (input: string) => {
    if (!input) return false
    return _commands.has(input)
}
