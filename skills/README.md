# @its-thepoe/skills

CLI to **install**, **sync**, **check**, and **remove** [@its-thepoe](https://www.npmjs.com/search?q=scope%3Aits-thepoe) Agent Skills into local directories used by **Cursor**, **Claude Code**, **OpenCode**, and **Windsurf**.

## Install & use

```bash
npx @its-thepoe/skills@latest install --all
npx @its-thepoe/skills@latest sync --all
npx @its-thepoe/skills@latest check
```

One skill:

```bash
npx @its-thepoe/skills@latest install alt-text
```

Options: `--dry-run`, `--only=cursor,claude`, `--strategy copy` (if symlinks fail), `remove <name>` / `remove --all`.

## Docs

- [Full documentation on GitHub](https://github.com/its-thepoe/skills)

## License

MIT
