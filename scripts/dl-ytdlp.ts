import { createWriteStream } from "node:fs";
import { BIN_NAME, BIN_PATH } from "../src/ytdlp";
import axios from "axios";
import { chmod } from "node:fs/promises";

const VERSION = "2023.06.22";

axios({
  method: "get",
  url: `https://github.com/yt-dlp/yt-dlp/releases/download/${VERSION}/${BIN_NAME}`,
  responseType: "stream",
}).then(async (res) => {
  await new Promise((resolve, reject) => {
    res.data
      .pipe(createWriteStream(BIN_PATH))
      .on("finish", resolve)
      .on("error", reject);
  });
  return await chmod(BIN_PATH, "770");
});
