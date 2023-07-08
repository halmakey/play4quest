import { ProxyHandler } from "aws-lambda";
import { ytdpl } from "./ytdlp";
import { isAVProMobile, isStageFright } from "./user-agent";

const cache: Record<string, Promise<string>> = {};

export const handler: ProxyHandler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "",
    };
  }
  try {
    const ua = event.headers?.["user-agent"] || "";
    const needResolve = isAVProMobile(ua) || isStageFright(ua);
    const url = new URL(event.path.slice(1));
    for (const key of Object.keys(event.queryStringParameters ?? {})) {
      url.searchParams.append(key, event.queryStringParameters?.[key] ?? "");
    }
    const target = url.toString();

    if (!needResolve) {
      return {
        statusCode: 302,
        headers: {
          Location: target,
        },
        body: "",
      };
    }

    let resolve = cache[target];
    if (resolve) {
      const location = await resolve;
      return {
        statusCode: 302,
        headers: {
          Location: location,
        },
        body: "",
      };
    }

    cache[target] = resolve = ytdpl(target);
    resolve.finally(() => {
      setTimeout(() => {
        delete cache[target];
      }, 1000 * 60 * 20);
    });

    const location = await resolve;
    return {
      statusCode: 302,
      headers: {
        Location: location,
      },
      body: "",
    };
  } catch (err) {
    console.warn(err);
    return {
      statusCode: 404,
      body: String(err),
    };
  }
};
