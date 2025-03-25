import { SlackAPIClient } from "https://deno.land/x/deno_slack_api@2.8.0/types.ts";

export class UserRepository {
  constructor(private client: SlackAPIClient) {}
  async getUserById(id: string) {
    return await this.client.users.info({ user: id });
  }

  async getUsersById(ids: string[]) {
    const tasks = ids.map(async (id) => await this.getUserById(id));
    return await Promise.all(tasks);
  }
}
