import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { format } from "https://deno.land/std@0.200.0/datetime/mod.ts";
import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.1.0/mod.ts";
import { UserGroupRepository } from "./repository/UserGroupRepository.ts";
import { ChannelRepository } from "./repository/ChannelRepository.ts";
import { IconDownloadService } from "./service/IconDownloadService.ts";

const SLACK_TOKEN = Deno.env.get("SLACK_TOKEN");
if (!SLACK_TOKEN) {
  console.log("SLACK_TOKEN should be defined");
  Deno.exit(1);
}
const client = SlackAPI(SLACK_TOKEN);

const group = new Command()
  .arguments("<groupHandle:string>")
  .description("Download icons of users who are belong to the user groups.")
  .action((_, groupHandle: string) => {
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
      await iconService.run(
        userIds,
        `./results/${format(new Date(), "yyMMdd_HHmmss")}_${groupHandle}`,
      );
    })();
  });

const channel = new Command()
  .arguments("<channelID:string>")
  .description("Download icons of users who are joined in the channel.")
  .action((_, channelID: string) => {
    (async () => {
      const channelRepository = new ChannelRepository(client);
      const usersRes = await channelRepository.getUserListByChannelID(
        channelID,
      );
      if (!usersRes.ok) {
        console.error(`Channel "${channelID}" is not found: ${usersRes.error}`);
        Deno.exit(1);
      } else {
        const iconService = new IconDownloadService(client);
        await iconService.run(
          usersRes.members as string[],
          `./results/${format(new Date(), "yyMMdd_HHmmss")}_${channelID}`,
        );
      }
    })();
  });

const cli = new Command()
  .name("slack-icon-downloader")
  .description("Slack icon downloader")
  .version("v0.1.0")
  .command("group", group)
  .command("channel", channel);
await cli.parse();
