# FCAU - Farcaster Command-line Utility

## Overview

FCAU (Farcaster Archive Utility) is a CLI tool designed to manage and archive messages on the Farcaster protocol effortlessly.

## Features

- Query the Farcaster API using a username
- Save query results to a JSON file

## Installation

Use `npx` to quickly run it:

```bash
npx fcau@latest
```

## Usage

### Available Commands and Options

#### Init Command

Perform an initial archive of a user's messages.

```bash
npx fcau@latest init
```

**Options:**

- `-u, --username [username]`: Specify the username to query. If not provided, you will be prompted.

#### Update Command

Update an existing archive of a user's messages.

```bash
npx fcau@latest update
```

No options required.

#### Help Command

Display help for any command.

```bash
npx fcau@latest help [COMMAND]
```

## Contribution and Issues

Feel free to contribute or report issues via this project's [GitHub repository](https://github.com/iammatthias/fcau).

## License

MIT
