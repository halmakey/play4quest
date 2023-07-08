import http from "node:http";
import { ytdpl } from "./ytdlp";
import { isAVProMobile, isStageFright } from "./user-agent";
import { getHelp } from "./help";

export function createServer() {
  const cache: Record<string, Promise<string>> = {};

  const server = http.createServer((req, res) => {
    try {
      if (req.url === "/favicon.ico") {
        res.statusCode = 404;
        res.end();
        return;
      }
  
      const url = new URL(req.url?.slice(1)!);
      if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
      }

      const ua = req.headers["user-agent"] || "";
      const needResolve = isAVProMobile(ua) || isStageFright(ua);
      const target = url.toString();

      if (!needResolve) {
        res.statusCode = 302;
        res.writeHead(302, {
          Location: target,
        });
        res.end();
        return;
      }

      let promise = cache[target];
      if (!promise) {
        promise = ytdpl(target);
        cache[target] = promise;
        promise.finally(() => {
          setTimeout(() => {
            delete cache[target];
          }, 1000 * 60 * 30);
        });
      }

      promise.then(
        (location) => {
          res.writeHead(302, {
            Location: location,
          });
          res.end();
        },
        (err) => {
          console.error(err);
          res.statusCode = 500;
          res.end();
        }
      );
    } catch (err) {
      console.warn(err);
      res.statusCode = 200;
      res.end(getHelp());
    }
  });

  return server;
}
