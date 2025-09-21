/// 1. input is split by spaces not in quotes
/// 2. quotes prefixed by a backslash are treated as literals
/// 3. quotes not preceded by a space are also treated as literals
export const parser = (input: string) => {
    const tokens: string[] = []
    const container: string[] = []
    let quote: string | null = null
    let backslash = false

    for (const char of input) {
        if (backslash) {
            container.push(char)
            backslash = false
            continue
        }
        switch (char) {
            case '"':
            case "'":
                if (quote === null && container.length === 0) {
                    quote = char
                    continue
                }
                if (quote === char) {
                    if (container.length > 0) {
                        tokens.push(container.join(''))
                        container.length = 0
                    }
                    quote = null
                    continue
                }
                container.push(char)
                break
            case ' ':
                if (quote === null) {
                    if (container.length > 0) {
                        tokens.push(container.join(''))
                        container.length = 0
                    }
                } else {
                    container.push(char)
                }
                break
            case '\\':
                backslash = true
                continue
            default:
                container.push(char)
                break
        }
    }

    if (container.length > 0) tokens.push(container.join(''))

    return tokens
}
