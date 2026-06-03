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

## Deployment

### Static web app

Build the app and serve the `dist/` folder with any static host (Cloudflare Pages, Nginx, S3, etc.).

```bash
bun run build   # output goes to dist/
```

For a quick local test of the production build:

```bash
bun run preview  # serves dist/ at http://localhost:4173
```

To deploy to **Cloudflare Pages**, connect your GitHub repo and set:
- Build command: `bun run build`
- Output directory: `dist`

### Docker

The `deploy/` folder contains everything needed to build and run the app as a Docker container.

#### Build the image

Builds a multi-architecture image (linux/amd64 + linux/arm64) and exports it as a versioned OCI tar file into `deploy/`.

```bash
./deploy/build-image.sh
```

The version is read from `deploy/.env`:

```
APP_VERSION=1.0.0
```

#### Deploy to a host

```bash
# 1. SFTP the deploy folder contents to the target host
sftp user@host
put deploy/dev-tools-<version>.tar
put deploy/docker-compose.yml
put deploy/.env

# 2. On the target host
docker load -i dev-tools-<version>.tar
docker compose up -d
```

`docker-compose.yml` uses `pull_policy: never` so it only uses locally loaded images and never contacts Docker Hub.

#### Releasing a new version

1. Bump `version` in `package.json`
2. Update `APP_VERSION` in `deploy/.env` to match
3. Run `./deploy/build-image.sh`
4. SFTP the new tar + updated `.env` to the target host
5. On the target: `docker load -i dev-tools-<version>.tar && docker compose up -d`
