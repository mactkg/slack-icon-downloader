# slack-icon-downloader

## SYNOPSYS

```bash
# => icons of users in channel "C1ABCDEFG"(id) are downloaded to ./results/...
$ deno run task main.ts channel C1ABCDEFG

# => icons of user group "@dev-team-alpha" are downloaded to ./results/...
$ deno run task main.ts group dev-team-alpha

# => icons of user group "@dev-team-alpha" are downloaded to ./results/...
#    and user informations are written in dev-team-alpha.csv(it may be useful when creating badges!) 
$ deno run task main.ts group dev-team-alpha --csv=dev-team-alpha.csv
```

## Preparation

- Pass slack token with permissions listed bellow to environment variable
  `SLACK_TOKEN`
  - `users:read`
  - `usergroups:read` (when use group command)
  - `channels:read` (when use channel command with a public channel)
  - `groups:read` (when use channel command with a private channel)
  - `im:read` (when use channel command with a direct messages)
  - `mpim:read` (when use channel command with a group direct messages)

## Usage

### with script

- Copy `scripts/example.sh`
  - Edit `ugs` or `channels` array
- Run script
  - Icons will be downloaded to `results` directory
  - You can use `results/list.csv` to load the icons from other apps(such like
    [ラベル屋さん](https://www.labelyasan.com/))

### as cli

```
Description:

  Slack icon downloader

Options:

  -h, --help     - Show this help.                            
  -V, --version  - Show the version number for this program.  

Commands:

  group    <groupHandle>  - Download icons of users who are belong to the user groups.
  channel  <channelID>    - Download icons of users who are joined in the channel.
```

## LICENSE

MIT License
