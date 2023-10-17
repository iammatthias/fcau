# FCAU - Farcaster Command-line Utility

## Overview

FCAU (Farcaster Archive Utility) is a CLI tool designed to manage and archive messages on the Farcaster protocol effortlessly.

## Features

- Query the Farcaster API using a username
- Save query results to a JSON file

## Installation

You don't need to install this package globally. Use `npx` to run it without installation:

```bash
npx fcau
```

## Usage

### Available Commands and Options

#### Init Command

Perform an initial archive of a user's messages.

```bash
npx fcau init
```

**Options:**

- `-u, --username [username]`: Specify the username to query. If not provided, you will be prompted.
- `-c, --cron`: Schedule a cron job for this query.

#### Update Command

Update an existing archive of a user's messages.

```bash
npx fcau update
```

No options required.

#### Help Command

Display help for any command.

```bash
npx fcau help [COMMAND]
```

## Contribution and Issues

Feel free to contribute or report issues via this project's [GitHub repository](https://github.com/iammatthias/fcau).

## License

MIT
