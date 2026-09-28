import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey.trim().length > 0) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
    console.log("✅ Google GenAI client initialized with API key");
  } catch (err: any) {
    console.warn("⚠️ Failed to initialize Google GenAI client:", err.message);
  }
} else {
  console.log("ℹ️ No GEMINI_API_KEY detected. Intelligent fallback story generator will be active.");
}

export const getGeminiClient = () => aiClient;

export interface GeneratedChapter {
  title: string;
  topic: string;
  chapterNumber: number;
  narrativeText: string;
  culturalContext: string;
  cliffhanger: string;
  teaserForNextLevel: string;
  interactiveChoices?: string[];
}

export const storyChapterSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    topic: { type: Type.STRING },
    chapterNumber: { type: Type.INTEGER },
    narrativeText: { type: Type.STRING, description: "Main story text (300-500 words)" },
    culturalContext: { type: Type.STRING, description: "Educational historical takeaway" },
    cliffhanger: { type: Type.STRING, description: "Suspenseful closing twist ending" },
    teaserForNextLevel: { type: Type.STRING, description: "Call to action to play next game" },
    interactiveChoices: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 suspenseful choices for the reader"
    }
  },
  required: [
    "title",
    "topic",
    "chapterNumber",
    "narrativeText",
    "culturalContext",
    "cliffhanger",
    "teaserForNextLevel"
  ]
};

const SYSTEM_INSTRUCTION = `You are Katha AI, an expert storyteller, cultural historian, and youth educator for the platform "Katha Yatra".
Your mission is to write engaging, age-appropriate educational story chapters based on ancient civilizations, sacred epics, history, and modern science.

STRICT STORY FORMAT RULES:
1. Tone: Immersive, inspiring, age-appropriate (for ages 8-16), respectful of all cultures and faiths.
2. Structure: 
   - Historical / Moral Context Setting
   - Narrative Core (Action, Discovery, Ethical Choice)
   - CLIFFHANGER ENDING: The chapter MUST end at a suspenseful moment or dramatic choice ("twist") that forces the reader to play the next mini-games to find out what happens next.
3. Non-Violence & Respect: Emphasize wisdom, courage, science, strategy, and virtue over graphic violence.
4. Language: Clear, vivid English with contextual terminology defined inline.
5. Provide 2 suspenseful reader choices that explore what the protagonist should do next.`;

export async function generateStoryChapterWithGemini(
  topic: string,
  chapterNumber: number,
  previousSummary?: string
): Promise<GeneratedChapter | null> {
  const client = getGeminiClient();
  if (!client) {
    return null;
  }

  try {
    const prompt = `Generate Chapter ${chapterNumber} for the cultural/historical topic "${topic}".
Previous context summary: "${previousSummary || 'The protagonist begins an epic quest to uncover ancient wisdom and civilizational heritage.'}".
Enforce a suspenseful cliffhanger twist at the very end of the chapter that leaves the protagonist facing an unexpected riddle, hidden doorway, or urgent moral choice.`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: storyChapterSchema,
        temperature: 0.7,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    const parsed = JSON.parse(responseText) as GeneratedChapter;
    return parsed;
  } catch (error: any) {
    console.warn("⚠️ Gemini generation failed or quota reached, using curated fallback engine:", error.message);
    return null;
  }
}
