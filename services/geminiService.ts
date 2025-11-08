import { GoogleGenAI, Modality, Part } from "@google/genai";
import { ImageFile } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const PROMPT_TEMPLATE = `
# User Avatar Creation Master 

Create an avatar for the user: {{USER_NAME}} 
It needs to be a png image 800x800 pixels with {{DARK_LIGHT}} colors and {{IDEAS_THEMES_IMAGERY}} ideas, themes, and imagery. 
The user intends to use this avatar on a cyber security forum with primarily Eastern European members.

The image you design is going to be the 'face' of this user on the forum, the image shown on every post, message, and comment on the forum. It should be simple, interesting, unique, and similar to other avatars on similar forums and message groups.

## !! IMPORTANT RULES !!
- Examples may be provided for you as attachments. These examples are to give you an idea of the avatars in-use by other users of the same forum. It's okay to use the examples as a guide or for general ideas of popular themes among that user-base, but the avatars generated should be unique and MUST ALWAYS reflect the users requests for theme,colors,ideas,imagery,and username and if possible conform to forum 'norms'.
- Two images will be generated for every request, one with USER_NAME in avatar and one without USER_NAME.
- Use information like: The type of community the avatar is for, the language spoken by users, themes popular among users of similar groups and websites.
- If you're able to search the internet, or use any external tools you have full permission to do anything necessary and use any data you seem fit.
- If any text is included, such as the username, please use characters appropriate for the following languages: {{TEXT_LANGUAGES}}.

EXAMPLE INPUT: 
USER_NAME="{{USER_NAME_INPUT}}"
DARK_LIGHT="{{DARK_LIGHT}}"
IDEAS_THEMES_IMAGERY="{{IDEAS_THEMES_IMAGERY}}"
`;

interface GenerationParams {
  userName: string;
  darkLight: string;
  ideas: string;
  exampleImages: ImageFile[];
  quantity: number;
  includeUsername: boolean;
  textLanguages: string[];
}

export interface AvatarResult {
  withUsername: string | null;
  withoutUsername: string;
}

const generateSingleAvatar = async (prompt: string, exampleImages: ImageFile[]): Promise<string> => {
  const imageParts: Part[] = exampleImages.map(img => ({
    inlineData: {
      data: img.base64,
      mimeType: img.mimeType
    }
  }));

  const parts: Part[] = [{ text: prompt }, ...imageParts];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated from API");
};

export const generateAvatars = async ({ userName, darkLight, ideas, exampleImages, quantity, includeUsername, textLanguages }: GenerationParams): Promise<AvatarResult[]> => {
  const languages = textLanguages.length > 0 ? textLanguages.join(', ') : 'English';
  const basePrompt = PROMPT_TEMPLATE
    .replace('{{DARK_LIGHT}}', darkLight)
    .replace('{{IDEAS_THEMES_IMAGERY}}', ideas)
    .replace('{{TEXT_LANGUAGES}}', languages);

  const promptWithUsername = basePrompt
    .replace(/{{USER_NAME}}/g, `"${userName}"`)
    .replace('{{USER_NAME_INPUT}}', userName);
    
  const promptWithoutUsername = basePrompt
    .replace(/{{USER_NAME}}/g, "No username in this version.")
    .replace('{{USER_NAME_INPUT}}', userName);

  const generationTasks: Promise<string>[] = [];

  for (let i = 0; i < quantity; i++) {
    if (includeUsername) {
      generationTasks.push(generateSingleAvatar(promptWithUsername, exampleImages));
    }
    generationTasks.push(generateSingleAvatar(promptWithoutUsername, exampleImages));
  }

  const allGeneratedImages = await Promise.all(generationTasks);

  const results: AvatarResult[] = [];
  let imageIndex = 0;
  for (let i = 0; i < quantity; i++) {
    if (includeUsername) {
      results.push({
        withUsername: allGeneratedImages[imageIndex++],
        withoutUsername: allGeneratedImages[imageIndex++]
      });
    } else {
      results.push({
        withUsername: null,
        withoutUsername: allGeneratedImages[imageIndex++]
      });
    }
  }

  return results;
};


export const editImageWithText = async (image: ImageFile, prompt: string): Promise<string> => {
  const parts: Part[] = [
    {
      inlineData: {
        data: image.base64,
        mimeType: image.mimeType
      }
    },
    {
      text: prompt
    }
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No edited image generated from API.");
};