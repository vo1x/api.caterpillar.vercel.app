import sharp = require("sharp");

export const compressAndResize = async (
  imageBuffer: Buffer,
  quality: number = 70,
  targetWidth: number = 1280,
  targetHeight: number = 720
): Promise<any> => {
  try {
    const resizedImage = await sharp(imageBuffer)
      .resize({
        width: targetWidth,
        height: targetHeight,
        fit: "inside",
      })
      .webp({ quality })
      .toBuffer();

    if (!resizedImage) throw new Error("Unable to resize image");

    return resizedImage;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
