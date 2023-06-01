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
  const url = user.profile.image_512;

  // Old Slack icon images are stored in Gravatar and converting size of the images may failed and fallback to the default image.
  // So here remove default image param
  // https://ja.gravatar.com/site/implement/images/#:~:text=low%2Dquality%20images.-,Default%20Image,-What%20happens%20when
  if(url.includes("gravatar.com")) {
    const gravatarUrl = new URL(url);
    gravatarUrl.searchParams.delete("d");
    console.log(gravatarUrl.toString())
  } else {
    console.log(url);
  }
})