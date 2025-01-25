import * as cheerio from "cheerio";

export const parseGameDescription = (html: string) => {
  const $: any = cheerio.load(html);

  const plainText = $.text()
    .replace(/[\r\n]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return plainText;
};

export const parseSystemRequirements = (html: string) => {
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
