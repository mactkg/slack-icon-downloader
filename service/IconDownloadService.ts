import { SlackAPIClient } from "https://deno.land/x/deno_slack_api@2.1.0/types.ts";
import { UserRepository } from "../repository/UserRepository.ts";

export class IconDownloadService {
  private userRepository: UserRepository;

  constructor(private client: SlackAPIClient) {
    this.userRepository = new UserRepository(client);
  }

  async run(userIds: string[], directory: string) {
    const usersRes = await this.userRepository.getUsersById(userIds);
    usersRes.forEach(async (userRes) => {
      if (userRes.ok) {
        const user = userRes.user;
        const url = this.getDownloadableUrl(user.profile.image_512);
        await this.download(url, directory);
      } else {
        console.log(userRes.error);
      }
    });
  }

  private getDownloadableUrl(url: string) {
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
  }

  private async download(rawUrl: string, path: string) {
    const url = new URL(rawUrl);
    const fileResponse = await fetch(url);

    const pathname = url.pathname;
    const filename = pathname.substring(pathname.lastIndexOf("/") + 1);

    await Deno.mkdir(path, { recursive: true });
    if (fileResponse.body) {
      const file = await Deno.open(`${path}/${filename}`, {
        write: true,
        create: true,
      });
      await fileResponse.body.pipeTo(file.writable);
      return;
    } else {
      return fileResponse.text();
    }
  }
}
