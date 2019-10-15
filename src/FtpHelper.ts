import { Client, FileInfo } from "basic-ftp";
import { Report, ReportType } from "./interfaces";
import { asyncForEach } from "./helpers";

class FtpHelper {
  client: Client;

  constructor() {
    this.client = new Client();
  }

  async fetchFileList() {
    try {
      await this.client.access({
        host: process.env.FTP_HOST,
        port: Number.parseInt(process.env.FTP_PORT) || 21,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD
      });

      let reports: Report[] = [];

      const list = await this.client.list();
      if (list.find(li => li.name.toLowerCase() === "agentplus")) {
        // We're good, there is a folder called agentplus
        await this.client.cd(`agentplus`);
        const list = await this.client.list();
        if (list.length > 0) {
          // For each file inside
          await asyncForEach(list, async (li: FileInfo) => {
            // If it's a directory
            if (li.isDirectory) {
              // Get the list of files inside
              const innerList = await this.client.list(li.name);
              // For each file inside
              innerList.forEach(ili => {
                if (
                  ili.name.toLowerCase() === `to1c.zip` ||
                  ili.name.toLowerCase() === `from1c.zip`
                ) {
                  // Create a new To or From report
                  reports.push({
                    folder: li.name,
                    size: ili.size,
                    time: ili.modifiedAt.getTime().toString(),
                    type:
                      ili.name.toLowerCase() === `to1c.zip`
                        ? ReportType.To
                        : ReportType.From
                  });
                }
              });
            }
          });
        }
        return reports;
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export default FtpHelper;
