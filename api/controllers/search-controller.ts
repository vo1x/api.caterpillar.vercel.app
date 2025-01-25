import { Context } from "hono";
import * as cheerio from "cheerio";

import { SearchQueryResult } from "../interfaces/interface";

export const searchController = async (ctx: Context) => {
  const query = ctx.req.query("q");

  if (!query || query.trim() === "") {
    return ctx.json({ error: "Query is required" }, 400);
  }

  try {
    const url = `https://store.steampowered.com/search/suggest?term=${encodeURIComponent(
      query
    )}&f=games&cc=us&l=english`;
    const response = await fetch(url);

    if (!response.ok) {
      return ctx.json(
        { success: false, error: "Failed to fetch data from Steam" },
        400
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const results: SearchQueryResult[] = [];

    $(".match").each((index: number, element: cheerio.Element) => {
      const name = $(element).find(".match_name").text().trim();
      const id = $(element).attr("data-ds-appid") || "";
      const image = $(element).find("img").attr("src") || "";
      const price = $(element).find(".match_price").text().trim();

      if (id) {
        results.push({ name, id, image, price });
      }
    });

    if (results.length === 0) {
      return ctx.json(
        { success: true, message: "No results found", results: [] },
        200
      );
    }

    return ctx.json({ success: true, results }, 200);
  } catch (error: any) {
    console.error("Error fetching search results:", error);
    return ctx.json({ success: false, error: error.message }, 500);
  }
};
