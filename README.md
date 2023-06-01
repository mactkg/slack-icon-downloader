# slack-icon-downloader
## Preparation
- Pass slack token with permissions listed bellow to environment variable `SLACK_TOKEN`
  - `users:read`
  - `usergroups:read`

## Usage
- Copy `scripts/example.sh`
  - Edit `ugs` array
- Run script
  - Icons will be downloaded to `results` directory
  - You can use `results/list.csv` to load the icons from other apps(such like [ラベル屋さん](https://www.labelyasan.com/))

## LICENSE
MIT License