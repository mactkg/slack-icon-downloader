import { SlackAPIClient } from "https://deno.land/x/deno_slack_api@2.1.0/types.ts";

export class ChannelRepository {
  constructor(private client: SlackAPIClient) {}

  async getUserListByChannelID(channel: string) {
    let cursor: string | undefined = undefined;
    const members: string[] = [];
    do {
      const res = await this.client.conversations.members({
        cursor,
        channel,
      });
      if (res.ok) {
        members.push(...res.members);
        cursor = res.response_metadata?.next_cursor;
      } else {
        return { ok: false, error: res.error };
      }
    } while (cursor);

    return { ok: true, members };
  }
}
