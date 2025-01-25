import { Context } from "hono";

import { parseGameDescription, parseSystemRequirements } from "../utils";

export const metadataController = async (ctx: Context) => {
  const appId = ctx.req.query("appId");

  if (!appId || appId.trim() === "") {
    return ctx.json({ success: true, error: "appId is required" }, 400);
  }

  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}`
    );
    const data = await response.json();
    const md = await data[`${appId}`].data;
    const metadata = {
      title: md.name,
      desc: parseGameDescription(md.about_the_game),
      released: md.release_date.date,
      systemRequirements:
        parseSystemRequirements(md.pc_requirements.minimum) ?? "",
      genres: md.genres.map((genre: any) => genre.description),
      publishers: md.publishers,
      developers: md.developers,
      posterURL: md.header_image.replace("header", "capsule_616x353"),
    };
    return ctx.json(metadata, 200);
  } catch (error: any) {
    return ctx.json({ success: false, error: error.message }, 500);
  }
};
