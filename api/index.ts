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

app.use("/wp-json", wpProxy);
app.route("/", router);

export default handle(app);
