import { Context } from "hono";

const BASE_URL = process.env.BASE_URL;

const wpProxy = async (c: Context, next: () => Promise<void>) => {
  const url = new URL(BASE_URL || "https://gamesleech.com");

  const modifiedHeaders = new Headers();

  Object.entries(c.req.raw.headers).forEach(([key, value]) => {
    modifiedHeaders.set(key, value as string);
  });

  modifiedHeaders.set("Origin", url.origin);
  modifiedHeaders.set("Host", url.hostname);

  return next();
};

export default wpProxy;
