import { BaseResponse, SlackAPIClient } from "https://deno.land/x/deno_slack_api@2.1.0/types.ts";

// ported by https://github.com/slackapi/node-slack-sdk/blob/main/packages/web-api/src/response/UsergroupsListResponse.ts
interface Prefs {
  channels?: string[];
  groups?:   string[];
}

interface Usergroup {
  auto_provision?:        boolean;
  channel_count?:         number;
  created_by?:            string;
  date_create?:           number;
  date_delete?:           number;
  date_update?:           number;
  description?:           string;
  enterprise_subteam_id?: string;
  handle?:                string;
  id?:                    string;
  is_external?:           boolean;
  is_subteam?:            boolean;
  is_usergroup?:          boolean;
  name?:                  string;
  prefs?:                 Prefs;
  team_id?:               string;
  updated_by?:            string;
  user_count?:            number;
  users?:                 string[];
}

type UserGroupListResponse = BaseResponse & Usergroup;
type ErrorResponse = {ok: false; error: string};

export class UserGroupRepository {
  private ugList: Record<string, string> = {};
  constructor(private client: SlackAPIClient) { }

  async reloadUserGroups() {
    await this.loadUserGroups();
  }

  async getUserListByHandle(handle: string): Promise<UserGroupListResponse | ErrorResponse> {
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
