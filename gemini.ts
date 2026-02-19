import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, LearningPath } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateLearningPath(input: UserInput): Promise<LearningPath> {
  const prompt = `Generate a highly personalized learning path for a student with the following profile:
  - Goal: ${input.goal}
  - Current Level: ${input.currentLevel}
  - Learning Style: ${input.learningStyle}
  - Time Commitment: ${input.timeCommitment}

  The response must be a structured curriculum that is realistic, engaging, and specifically tailored to their background.
  Include modules with specific topics, estimated durations, and difficulty levels.
  Also suggest 2-3 practical projects and some high-quality resource types.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          overview: { type: Type.STRING },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.STRING },
                topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] }
              },
              required: ["title", "description", "duration", "topics", "difficulty"]
            }
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ["name", "type"]
            }
          }
        },
        required: ["title", "overview", "modules", "projects", "resources"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as LearningPath;
}
