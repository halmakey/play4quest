import { Handler } from "aws-lambda";
import { ytdpl } from "./ytdlp";
import { isAVProMobile, isStageFright } from "./user-agent";
import { getHelp } from "./help";

const cache: Record<string, Promise<string>> = {};

export const handler: Handler = (event, context) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
    return Promise.resolve({
      statusCode: 405,
      headers: { "Content-Type": "text/plain" },
      body: "",
    });
  }
  try {
    const ua = event.headers?.["User-Agent"] || "";
    const needResolve = isAVProMobile(ua) || isStageFright(ua);
    if (event.path === "/favicon.ico") {
      return Promise.resolve({
        statusCode: 404,
        headers: { "Content-Type": "text/plain" },
        body: "",
      });
    }
    const url = new URL(event.path.slice(1));
    for (const key of Object.keys(event.queryStringParameters ?? {})) {
      url.searchParams.append(key, event.queryStringParameters?.[key] ?? "");
    }
    const target = url.toString();

    let promise = cache[target];
    if (!promise) {
      promise = cache[target] = ytdpl(target);
      promise.finally(() => {
        setTimeout(() => {
          delete cache[target];
        }, 1000 * 60 * 30);
      });
    }

    if (!needResolve) {
      return Promise.resolve({
        statusCode: 302,
        headers: {
          Location: target,
          "Content-Type": "text/plain",
        },
        body: "",
      });
    }

    return promise.then(
      (location) => {
        return {
          statusCode: 302,
          headers: {
            Location: location,
            "Content-Type": "text/plain",
          },
          body: "",
        };
      },
      (err) => {
        console.error(err);
        return {
          statusCode: 500,
          headers: { "Content-Type": "text/plain" },
          body: "Error",
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
          headers: { "Content-Type": "text/plain" },
        },
        body: "",
      });
    }
    return Promise.resolve({
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: getHelp(),
    });
  }
};
