import { SlackAPIClient } from "https://deno.land/x/deno_slack_api@2.8.0/types.ts";
import { UserRepository } from "../repository/UserRepository.ts";

type Result = {
  id: string;
  name: string;
  real_name: string;
};

export type SuccessResult = Result & {
  path: string;
};

export type ErrorResult = Result & {
  message: string;
};

export class IconDownloadService {
  private userRepository: UserRepository;

  constructor(private client: SlackAPIClient) {
    this.userRepository = new UserRepository(client);
  }

  async run(userIds: string[], directory: string): Promise<[SuccessResult[], ErrorResult[]]>{
    const usersRes = await this.userRepository.getUsersById(userIds);
    const result: SuccessResult[] = [];
    const errors: ErrorResult[] = [];
    for(const userRes of usersRes) {
      if (userRes.ok) {
        const user = userRes.user;
        const { id, name, real_name } = user;
        const url = this.getDownloadableUrl(user.profile.image_512);
        const res = await this.download(url, directory);
        if (res.ok) {
          result.push({
            id,
            name,
            real_name,
            path: res.path,
          });
        } else {
          errors.push({
            id,
            name,
            real_name,
            message: res.message,
          });
        }
      } else {
        console.log(userRes.error);
      }
    }
    return [result, errors]
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

  private async download(
    rawUrl: string,
    path: string,
  ): Promise<{ ok: true; path: string } | { ok: false; message: string }> {
    const url = new URL(rawUrl);
    const fileResponse = await fetch(url);

    const pathname = url.pathname;
    const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
    const filepath = `${path}/${filename}`;

    await Deno.mkdir(path, { recursive: true });
    if (fileResponse.body) {
      const file = await Deno.open(filepath, {
        write: true,
        create: true,
      });
      await fileResponse.body.pipeTo(file.writable);
      return { ok: true, path: await Deno.realPath(filepath) };
    } else {
      return { ok: false, message: await fileResponse.text() };
    }
  }
}
