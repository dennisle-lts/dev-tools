# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-06-03

### Added
- **Regex Tester** (Text section) — live pattern testing with match highlighting and capture group extraction
  - Text mode: paste any text and see matches highlighted in real time
  - CSV mode: apply a regex across all rows of a selected column to batch-extract data, with downloadable results
  - Sticky regex cheatsheet with 7 sections and click-to-insert patterns
  - Copy button for the finalised `/pattern/flags` literal
  - Responsive layout: collapsible cheatsheet on mobile, sticky sidebar on desktop
- **Base64 Converter** (Converter section) — encode and decode Base64 with URL-safe mode
- **Date-Time Converter** (Converter section) — convert a date/time into 10 common formats and display across all Australian timezones + UTC
- **ULID Generator** (Crypto section) — generate Universally Unique Lexicographically Sortable Identifiers
- **UUID Generator** (Crypto section) — generate UUIDs in v1, v3, v4, v5, and v7 formats
- **Bcrypt** (Crypto section) — hash strings and compare plain text against a hash
- **Token Generator** (Crypto section) — generate random strings with configurable character sets and length
- Sidebar version number now reads from `package.json` automatically
