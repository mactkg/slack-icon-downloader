import { SlackAPIClient } from "https://deno.land/x/deno_slack_api@2.1.0/types.ts";
import { UserRepository } from "../repository/UserRepository.ts";

export class IconDownloadService {
  private userRepository: UserRepository;

  constructor(private client: SlackAPIClient) {
    this.userRepository = new UserRepository(client);
  }

  async run(userIds: string[]) {
    const users = await this.userRepository.getUsersById(userIds);
    return users.map((user) => {
      const url = user.profile.image_512;

      // Old Slack icon images are stored in Gravatar and converting size of the images may failed and fallback to the default image.
      // So here remove default image param
      // https://ja.gravatar.com/site/implement/images/#:~:text=low%2Dquality%20images.-,Default%20Image,-What%20happens%20when
      if (url.includes("gravatar.com")) {
        const gravatarUrl = new URL(url);
        gravatarUrl.searchParams.delete("d");
        return gravatarUrl.toString();
      } else {
        return url;
      }
    });
  }
}
