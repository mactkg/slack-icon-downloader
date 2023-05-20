import { SlackAPIClient } from "https://deno.land/x/deno_slack_api@2.1.0/types.ts";

export class UserGroupRepository {
  private ugList: Record<string, string> = {};
  constructor(private client: SlackAPIClient) { }

  async reloadUserGroups() {
    await this.loadUserGroups();
  }

  async getUserListByHandle(handle: string) {
    if(Object.keys(this.ugList).length <= 0) {
      await this.loadUserGroups();
    }

    const ugId = this.ugList[handle];
    if(ugId) {
      const user = await this.client.usergroups.users.list({
        usergroup: ugId
      });
      return user;
    } else {
      return { ok: false, error: `${handle} not found` };
    }
  }

  private async loadUserGroups() {
    const ugListRes = await this.client.usergroups.list();
    if(!ugListRes.ok) {
      return false;
    }
    this.ugList = Object.fromEntries(ugListRes.usergroups.map(({ id, handle }) => ([handle, id])));
  }
}
