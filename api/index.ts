import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

import router from "./routes";
import { wpProxy } from "./middleware/proxy";

const app = new Hono().basePath(`/api`);

app.use(
  "*",
  cors({
    origin: [
      "https://gamesbuilder.vercel.app",
      "https://caterpillarjs.vercel.app",
      "http://localhost:5173",
    ],
  })
);

app.route("/", router);
app.use("/wp-json", wpProxy);

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;