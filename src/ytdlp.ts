import path from "node:path";
import { execFile } from "node:child_process";

export const PLATFORM_BIN_MAP: Record<string, Record<string, string>> = {
  darwin: { x64: "yt-dlp_macos", arm64: "yt-dlp_macos" },
  linux: { x64: "yt-dlp_linux", arm64: "yt-dlp_linux_aarch64" },
};

const BIN_NAME = PLATFORM_BIN_MAP[process.platform][process.arch];
const BIN_PATH = path.join(process.cwd(), "bin", BIN_NAME);

export function ytdpl(target: string): Promise<string> {
  return new Promise((res, rej) => {
    execFile(
      BIN_PATH,
      ["--get-url", "--format", "mp4", target],
      { encoding: "utf8" },
      (err, stdout, stderr) => {
        if (err) {
          rej(err);
          return;
        }
        if (stderr) {
          console.warn(stderr);
        }
        try {
          const url = new URL(stdout.trimEnd());
          res(url.toString());
        } catch (err) {
          rej(err);
        }
      }
    );
  });
}
