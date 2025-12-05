import { GoogleGenAI } from "@google/genai";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates multiple images based on the provided prompt using Gemini 2.5 Flash Image.
 * @param prompt The text description of the image to generate.
 * @param count The number of images to generate (default: 2).
 * @returns Array of base64 data URLs.
 */
export const generateImagesFromText = async (prompt: string, count: number = 2): Promise<string[]> => {
  try {
    // Create an array of promises to run in parallel
    // We make multiple requests because gemini-2.5-flash-image typically returns one image per generation request
    const imagePromises = Array.from({ length: count }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      })
    );

    const responses = await Promise.all(imagePromises);
    const generatedImages: string[] = [];

    for (const response of responses) {
      if (!response.candidates || response.candidates.length === 0) {
        continue;
      }

      // Iterate through parts to find the image part
      const parts = response.candidates[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            generatedImages.push(`data:image/png;base64,${base64EncodeString}`);
            // Assuming one image per request is the goal, break after finding one
            break;
          }
        }
      }
    }

    if (generatedImages.length === 0) {
      throw new Error("No images were generated.");
    }

    return generatedImages;
  } catch (error) {
    console.error("Error generating images:", error);
    throw error;
  }
};
