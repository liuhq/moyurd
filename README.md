# moyurd
A keyboard-driven and simple Epub reader.

## Installation

### Archlinux

Get [moyurd](https://aur.archlinux.org/packages/moyurd) from AUR

or

```sh
paru -S moyurd
```

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

### Configuration

The configuration file is usually located at `XDG_CONFIG_HOME/moyurd/config.json`

You can get the default configuration and available options from [config.default.json](./config/config.default.json)

<!-- ## Support -->



<!-- ## Contributing -->



<!-- ## Changelog -->

<!-- You can check the [Changelog](./CHANGELOG.md) here. -->

## Thanks

- [@lingo-reader/epub-parser](https://github.com/hhk-png/lingo-reader)

## License

[MIT](./LICENSE)
