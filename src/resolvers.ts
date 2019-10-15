import { config } from "dotenv";
import FtpHelper from "./FtpHelper";

config();

const fth = new FtpHelper();

const resolvers = {
  Query: {
    allReports: async () => {
      return await fth.fetchFileList();
    }
  }
};

export default resolvers;
