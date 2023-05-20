import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.1.0/mod.ts";
import { UserGroupRepository } from "./repository/UserGroupRepository.ts";
import { UserRepository } from "./repository/UserRepository.ts";

const SLACK_TOKEN = Deno.env.get("SLACK_TOKEN");
if(!SLACK_TOKEN) {
  console.log("SLACK_TOKEN should be defined");
  Deno.exit(1);
}
const client = SlackAPI(SLACK_TOKEN);
const ugname = Deno.args[0];
if(!ugname) {
  console.log("paramater should be defined");
  Deno.exit(1);
}

const userGroupRepository = new UserGroupRepository(client);
const usersRes = await userGroupRepository.getUserListByHandle(ugname) as any;
if(!usersRes.ok) {
  console.error(`User group "${ugname}" is not found`)
  Deno.exit(1);
}

const userIds = usersRes.users
const userRepository = new UserRepository(client);
const users = await userRepository.getUsersById(userIds);
users.forEach(user => {
  console.log(user.profile.image_512);
})