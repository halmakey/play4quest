import http from "node:http";
import { ytdpl } from "./ytdlp";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({
  ignorePath: true,
  changeOrigin: true,
});

export function createPsudoJinnaiServer() {
  const cache: Record<string, Promise<string>> = {};

  const server = http.createServer((req, res) => {
    try {
      let url: URL;
      try {
        url = new URL(req.url?.slice(1)!);
      } catch (err) {
        res.statusCode = 404;
        res.end();
        return;
      }
      if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
      }

      const target = url.toString();
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
        (target) => {
          proxy.web(req, res, { target });
        },
        (err) => {
          console.error(err);
          res.statusCode = 500;
          res.end();
        }
      );
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.end();
    }
  });

  return server;
}
