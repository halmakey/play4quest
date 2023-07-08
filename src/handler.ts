import { Handler } from "aws-lambda";
import { ytdpl } from "./ytdlp";
import { isAVProMobile, isStageFright } from "./user-agent";
import { getHelp } from "./help";

const cache: Record<string, Promise<string>> = {};

export const handler: Handler = (event, context) => {
  if (event.httpMethod !== "GET") {
    return Promise.resolve({
      statusCode: 405,
      body: "",
    });
  }
  try {
    const ua = event.headers?.["User-Agent"] || "";
    const needResolve = isAVProMobile(ua) || isStageFright(ua);
    if (event.path === "/favicon.ico") {
      return Promise.resolve({
        statusCode: 404,
        body: "",
      });
    }
    const url = new URL(event.path.slice(1));
    for (const key of Object.keys(event.queryStringParameters ?? {})) {
      url.searchParams.append(key, event.queryStringParameters?.[key] ?? "");
    }
    const target = url.toString();

    if (!needResolve) {
      return Promise.resolve({
        statusCode: 302,
        headers: {
          Location: target,
        },
        body: "",
      });
    }

    let promise = cache[target];
    if (!promise) {
      cache[target] = promise = ytdpl(target);
      promise.finally(() => {
        setTimeout(() => {
          delete cache[target];
        }, 1000 * 60 * 20);
      });
    }

    return promise.then(
      (location) => {
        return {
          statusCode: 302,
          headers: {
            Location: location,
          },
          body: "",
        };
      },
      (err) => {
        return {
          statusCode: 500,
          header: "Error",
        };
      }
    );
  } catch (err) {
    console.warn(err);
    if (event.path !== "/") {
      return Promise.resolve({
        statusCode: 302,
        headers: {
          Location: "/",
        },
      });
    }
    return Promise.resolve({
      statusCode: 200,
      body: getHelp(),
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
};
