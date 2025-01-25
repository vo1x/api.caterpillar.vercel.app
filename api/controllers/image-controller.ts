const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;
const baseUrl = process.env.BASE_URL;

import { Context } from "hono";
import { compressAndResize, fetchImageBuffer } from "../utils";

const imageController = async (ctx: Context): Promise<any> => {
  const { imageFileName, imageUrl } = await ctx.req.json();

  if (!imageUrl || !imageFileName) {
    ctx.json({ success: true, error: "Missing image URL or filename" }, 400);
  }

  try {
    const imageArrayBuffer = await fetchImageBuffer(imageUrl);
    const resizedImage = await compressAndResize(imageArrayBuffer);

    if (!resizedImage) {
      throw new Error(`Image resize error!`);
    }

    console.log(resizedImage);

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([new Uint8Array(resizedImage)], { type: "image/webp" }),
      imageFileName.endsWith(".webp") ? imageFileName : `${imageFileName}.webp`
    );

    const uploadResponse = await fetch(`${baseUrl}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64"),
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorBody = await uploadResponse.text();
      throw new Error(
        `Image upload error! status: ${uploadResponse.status}, body: ${errorBody}`
      );
    }

    const uploadedImage = await uploadResponse.json();
    const featuredImageId = uploadedImage.id;

    if (featuredImageId == null) {
      return ctx.json({ message: "Failed to upload image to WP" }, 500);
    }
    return ctx.json(
      {
        success: true,
        message: "Uploaded image",
        featuredImageId,
      },
      200
    );
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return ctx.json({ success: false, error: error.message }, 500);
  }
};

export default imageController;
