# Dev Tools

A collection of developer utilities built with React, TypeScript, and shadcn/ui.

## Tech Stack

- **Runtime** — [Bun](https://bun.sh)
- **Framework** — [React 19](https://react.dev) + [Vite 8](https://vite.dev)
- **Language** — TypeScript
- **UI** — [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS v4](https://tailwindcss.com)
- **Linting & Formatting** — [Biome](https://biomejs.dev)

## Features

### Crypto

| Tool | Description |
|------|-------------|
| **Token Generator** | Generate random strings using uppercase/lowercase letters, numbers, and/or symbols. Configurable length via slider. |
| **Bcrypt** | Hash strings with bcrypt and compare a plain string against a hash. Configurable salt rounds. |
| **UUID Generator** | Generate UUIDs in v1, v3, v4, v5, and v7 formats. Configurable count, with namespace and name inputs for v3/v5. |
| **ULID Generator** | Generate Universally Unique Lexicographically Sortable Identifiers. Configurable count. |

### Converter

| Tool | Description |
|------|-------------|
| **Date-Time Converter** | Convert a date/time into 10 common formats (ISO 8601, Unix, Mongo ObjectID, Excel, etc.) and display it across all Australian timezones + UTC. |
| **Base64** | Encode plain text to Base64 and decode Base64 back to plain text. Supports URL-safe mode. |

### Text

| Tool | Description |
|------|-------------|
| **Regex Tester** | Test regular expressions against text in real time with match highlighting and group extraction. Includes a full cheatsheet with click-to-insert patterns. CSV mode applies a regex across all rows of a column to batch-extract data, with downloadable results. |

## Getting Started

```bash
bun install
bun dev
```

## Other Commands

```bash
bun run build    # Production build
bun run preview  # Preview production build
bun run lint     # Run Biome linter
bun run format   # Run Biome formatter
```
