import { createWriteStream } from "node:fs";
import { PLATFORM_BIN_MAP } from "../src/ytdlp";
import axios from "axios";
import { chmod, mkdir } from "node:fs/promises";
import path from "node:path";
import { argv } from "node:process";

const VERSION = "2023.06.22";

async function download(binName: string, binDir: string) {
  const binPath = path.join(binDir, binName);
  await mkdir(binDir, {
    recursive: true,
  });
  await axios({
    method: "get",
    url: `https://github.com/yt-dlp/yt-dlp/releases/download/${VERSION}/${binName}`,
    responseType: "stream",
  }).then(async (res) => {
    await new Promise((resolve, reject) => {
      res.data
        .pipe(createWriteStream(binPath))
        .on("finish", resolve)
        .on("error", reject);
    });
    return await chmod(binPath, "770");
  });
}

async function main() {
  const args = argv.slice(2);
  const platform = args.shift() || process.platform;
  const arch = args.shift() || process.arch;
  const dir = args.shift() || path.join(process.cwd(), "bin");
  const binName = PLATFORM_BIN_MAP[platform][arch];
  await download(binName, dir);
}

main();
