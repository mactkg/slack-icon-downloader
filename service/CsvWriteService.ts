import { SuccessResult } from "./IconDownloadService.ts";

export class CsvWriteService {

  constructor(private file: Deno.FsFile, private switchNameOrder: boolean) {}

  async run(results: SuccessResult[]) {
    const te = new TextEncoder();
        for (const res of results) {
          const splitName = res.real_name.split(" ");
          if (this.switchNameOrder) {
            [splitName[0], splitName[splitName.length - 1]] = [
              splitName[splitName.length - 1],
              splitName[0],
            ];
          }
          await this.file.write(
            te.encode(
              `${res.id},${res.name},${splitName.join(" ")},${res.path}\n`,
            ),
          );
        }
        this.file.close();
  }
}
