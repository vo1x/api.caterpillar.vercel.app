export const fetchImageBuffer = async (imageUrl: string): Promise<Buffer> => {
  try {
    console.log(imageUrl);
    const response = await fetch(imageUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch image. Status code: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error: any) {
    throw new Error(`Failed to fetch image: ${error.message}`);
  }
};
