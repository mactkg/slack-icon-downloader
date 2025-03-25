import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { format } from "https://deno.land/std@0.200.0/datetime/mod.ts";
import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.8.0/mod.ts";
import { UserGroupRepository } from "./repository/UserGroupRepository.ts";
import { ChannelRepository } from "./repository/ChannelRepository.ts";
import { IconDownloadService } from "./service/IconDownloadService.ts";
import { CsvWriteService } from "./service/CsvWriteService.ts";

const SLACK_TOKEN = Deno.env.get("SLACK_TOKEN");
if (!SLACK_TOKEN) {
  console.log("SLACK_TOKEN should be defined");
  Deno.exit(1);
}
const client = SlackAPI(SLACK_TOKEN);

const group = new Command()
  .arguments("<groupHandle:string>")
  .option(
    "--csv=<patfilepathh>",
    "Write informations of user to csv. It is useful when create badges with icons.",
  )
  .option(
    "--switch-name-order",
    `Swap the display order of given and family names (e.g., "John Doe" becomes "Doe John").`,
  )
  .description("Download icons of users who are belong to the user groups.")
  .action(({ csv, switchNameOrder }, groupHandle: string) => {
    (async () => {
      const userGroupRepository = new UserGroupRepository(client);
      const usersRes = await userGroupRepository.getUserListByHandle(
        groupHandle,
      ) as any;
      if (!usersRes.ok) {
        console.error(`User group "${groupHandle}" is not found`);
        Deno.exit(1);
      }

      const userIds = usersRes.users;
      const iconService = new IconDownloadService(client);
      const [results, errors] = await iconService.run(
        userIds,
        `./results/${format(new Date(), "yyMMdd_HHmmss")}_${groupHandle}`,
      );
      if (csv) {
        const f = await Deno.create(csv);
        const csvWriteService = new CsvWriteService(f, !!switchNameOrder);
        await csvWriteService.run(results)
        console.log(`Success writing user informations to ${csv}.`);
      }

      if (errors.length > 0) {
        errors.forEach((e) =>
          console.error(`${e.id},${e.name},${e.real_name},${e.message}`)
        );
      }
    })();
  });

const channel = new Command()
  .arguments("<channelID:string>")
  .option(
    "--csv=<path>",
    "Write informations of user to csv. It is useful when create badges with icons.",
  )
  .option(
    "--switch-name-order",
    `Swap the display order of given and family names (e.g., "John Doe" becomes "Doe John").`,
  )
  .description("Download icons of users who are joined in the channel.")
  .action(({ csv, switchNameOrder }, channelID: string) => {
    (async () => {
      const channelRepository = new ChannelRepository(client);
      const usersRes = await channelRepository.getUserListByChannelID(
        channelID,
      );
      if (!usersRes.ok) {
        console.error(`Channel "${channelID}" is not found: ${usersRes.error}`);
        Deno.exit(1);
      }

      const iconService = new IconDownloadService(client);
      const [results, errors] = await iconService.run(
        usersRes.members as string[],
        `./results/${format(new Date(), "yyMMdd_HHmmss")}_${channelID}`,
      );
      if (csv) {
        const f = await Deno.create(csv);
        const csvWriteService = new CsvWriteService(f, !!switchNameOrder);
        await csvWriteService.run(results)
        console.log(`Success writing user informations to ${csv}.`);
      }

      if (errors.length > 0) {
        errors.forEach((e) =>
          console.error(`${e.id},${e.name},${e.real_name},${e.message}`)
        );
      }
    })();
  });

const cli = new Command()
  .name("slack-icon-downloader")
  .description("Slack icon downloader")
  .version("v0.1.1")
  .command("group", group)
  .command("channel", channel);
await cli.parse();
