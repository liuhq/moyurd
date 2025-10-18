# moyurd
A keyboard-driven and simple Epub reader.

## Installation

### Archlinux

>AUR todo...

### Download

Get moyurd from [release](https://github.com/liuhq/moyurd/releases)

## Build

Build a ready-to-use standalone package, or a system-specific installer.

### Package

```sh
npm run forge:package
```

### Installer

```sh
npm run forge:make
```

## Usage

Press `?` (`shift+/`) to get help with shortcut keys.

### Custom Themes

config file at `XDG_CONFIG_HOME/moyurd/moyurd.config`

```json
{
  "colors": {
    "bg": "#dce0e8",         // background color
    "fg": "#4c4f69",         // foreground color
    "subFg": "#5c5f77",      // sub foreground color
    "inverseBg": "#4c4f69",  // inverse Background color
    "inverseFg": "#dce0e8",  // inverse foreground color
    "shadow": "#00000030",   // shadow color under the toc panel
    "accent": "#7287fd"      // primary theme color
  }
}

```

<!-- ## Support -->



<!-- ## Contributing -->



<!-- ## Changelog -->

<!-- You can check the [Changelog](./CHANGELOG.md) here. -->

## Thanks

- [@lingo-reader/epub-parser](https://github.com/hhk-png/lingo-reader)

## License

[MIT](./LICENSE)
