import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "@hono/node-server/vercel";

import router from "./routes";
import { wpProxy } from "./middleware/proxy";

const app = new Hono();

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

// export default app;
export default handle(app);
