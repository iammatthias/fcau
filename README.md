# FCAU - Farcaster Command-line Utility

## Overview

FCAU (Farcaster Archive Utility) is a CLI tool designed to manage and archive messages on the Farcaster protocol effortlessly.

## Features

- Query the Farcaster API using a username
- Save query results to a JSON file
- Schedule recurring queries via cron jobs
- Customize cron frequency: every 10 minutes, every hour, or every day

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

#### Schedule Command

Schedule a cron job to regularly update the archive of a user's messages.

```bash
npx fcau schedule
```

No options required.

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

**Options:**

- `-n, --nested-commands`: Include all nested commands in the output.

### Cron Job Scheduling

If you opt to schedule a cron job using the `init` command, you'll be prompted to specify the frequency:

- Every 10 minutes
- Every hour
- Every day

The cron job will be tagged with `fcau` and the username for easy identification.

## Contribution and Issues

Feel free to contribute or report issues via this project's [GitHub repository](https://github.com/iammatthias/fcau).

## License

MIT
