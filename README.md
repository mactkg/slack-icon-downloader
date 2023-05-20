# slack-icon-downloader
## Preparation
- Set slack token with permissions listed bellow to environment variable `SLACK_TOKEN`
  - `users:read`
  - `usergroups:read`

## Usage
- `deno task run [user group name]`

<details>
<summary>usage prototype</summary>
- download by user groups
    - `deno run main.ts --user-groups=[user group name]`
- download by user id
    - `deno run main.ts --user-id=[user id]`
    - id example: `W1234567890`
- (optional)specify image size
    - `deno run main.ts --size=512 --user-groups=[user group name]`
    - acceptable sizes: 24, 32, 48, 72, 192, 512, 1024
</details>

### handy script
```bash
ugs=(dev-team-alpha dev-team-bravo markating)
for ug in ${ugs[@]}
do
    deno task run $ug | xargs -n 1 curl -O --create-dirs --output-dir results/$ug
done 
```

## LICENSE
MIT License