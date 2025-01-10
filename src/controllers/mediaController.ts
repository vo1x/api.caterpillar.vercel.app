import * as cheerio from "cheerio";
import { RequestHandler } from "express";
import { Request, Response } from "express";

interface MediaController {
  getRoot: RequestHandler;
  getSearch: RequestHandler;
  getGameInfo: RequestHandler;
}

interface SteamSearchResult {
  id: string;
  name: string;
  price?: string;
  image?: string;
}

interface QueryResult {
  backdrop_path: string;
  id: string;
  title: string;
  original_name?: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  release_date: string;
}

const parseGameDescription = (html: string) => {
  const $ = cheerio.load(html);

  const plainText = $.text()
    .replace(/[\r\n]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return plainText;
};

const parseSystemRequirements = (html: string) => {
  const $ = cheerio.load(html);
  const items = $(".bb_ul li");
  const systemRequirements: { name: string; value: string }[] = [];

  items.each((_, item) => {
    const key = $(item).find("strong").text().replace(/:$/, "").trim();
    const value = $(item).text().replace(/^.*?:/, "").trim();

    if (key) {
      systemRequirements.push({ name: key, value });
    } else {
      console.warn("Missing key for item:", $(item).html());
    }
  });

  const fieldMapping: Record<string, string> = {
    OS: "OS",
    Memory: "RAM",
    Storage: "Storage",
    DirectX: "DirectX",
    Processor: "Processor",
    Graphics: "Graphics",
  };

  const formattedSystemRequirements = Object.keys(fieldMapping).reduce(
    (acc, steamField) => {
      const match = systemRequirements.find(
        (req) => req.name.toLowerCase() === steamField.toLowerCase()
      );

      acc[fieldMapping[steamField]] = match?.value || "Not Specified";
      return acc;
    },
    {} as Record<string, string>
  );

  return formattedSystemRequirements;
};

const mediaController: MediaController = {
  async getRoot(req, res) {
    try {
      res.status(200).json("API is up and running");
    } catch (error) {
      res.status(500).json("Error.");
    }
  },

  async getGameInfo(req, res) {
    const { appId } = req.query;

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
        size: "0.0GB",
        platforms: [
          { name: "Steam", url: "" },
          { name: "Epic Games", url: "" },
        ],
        systemRequirements:
          parseSystemRequirements(md.pc_requirements.minimum) ?? "",
        genres: md.genres.map((genre: any) => genre.description),
        publishers: md.publishers,
        developers: md.developers,
        repack: "GamesLeech",
        posterFileName: "",
        posterURL: md.header_image.replace("header", "capsule_616x353"),
        trailerURL:
          md.movies.filter((movie) =>
            movie.name.toLowerCase().includes("trailer")
          )[0].mp4.max ?? "",
        fields: [],
        posters: [],
        itemSelected: false,
        embedCode: "",
        wpTitle: "",
      };
      res.status(200).json(metadata);
    } catch (error) {
      console.error(error);
      res.status(500).json("Error.");
    }
  },

  async getSearch(req: Request, res: Response) {
    const { term } = req.query;

    try {
      const url = `https://store.steampowered.com/search/suggest?term=${term}&f=games&cc=us&l=english`;
      console.log(url);
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      const results = [];

      $(".match").each((index, element) => {
        return results.push({
          name: $(element).find(".match_name").text().trim(),
          id: $(element).attr("data-ds-appid"),
          image: $(element).find("img").attr("src"),
          price: $(element).find(".match_price").text().trim(),
        });
      });

      res.status(200).json({
        success: true,
        results: results,
      });
    } catch (error) {
      res.status(500).json("Error.");
    }
  },
};

export default mediaController;
