
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, LearningPath } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateLearningPath = async (profile: UserProfile): Promise<LearningPath> => {
  const prompt = `Act as a senior educational architect for the platform "EduStream". Create a highly structured, age-appropriate 6-unit learning roadmap for the goal: "${profile.goal}".

    Context:
    - Target Learner: ${profile.ageGroup} (Level: ${profile.currentLevel})
    - Subject/Skill: ${profile.goal}
    - Weekly Commitment: ${profile.availableHoursPerWeek} hours
    - Preferred Style: ${profile.learningStyle}
    - Specific Interests to include: ${profile.interests.join(', ')}

    Guidelines:
    1. If this is a school subject (like Math, Science, History), follow standard curriculum progressions (K-12 or Intermediate/College level).
    2. Units should build logically. Start with foundations/theory, then move to application.
    3. Include 4 specific learning activities for each unit (e.g., experiments, problem sets, case studies, videos).
    4. Provide 3 high-quality resource links (use placeholders like "khanacademy.org", "coursera.org", "youtube.com/education" appropriately).
    5. Each unit must have a "Final Task" or "Check-in Project".
    6. Tone: Encouraging, professional, and clear.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          summary: { type: Type.STRING },
          totalEstimatedWeeks: { type: Type.STRING },
          prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
          outcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      url: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['video', 'article', 'quiz', 'tool'] }
                    },
                    required: ["name", "url", "type"]
                  }
                },
                project: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "description"]
                }
              },
              required: ["id", "title", "description", "duration", "difficulty", "activities", "resources", "project"]
            }
          }
        },
        required: ["topic", "summary", "totalEstimatedWeeks", "modules", "outcomes", "prerequisites"]
      },
    },
  });

  return JSON.parse(response.text || "{}") as LearningPath;
};

export const chatWithMentor = async (message: string, context: LearningPath) => {
  const chatResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are the EduStream Academy Tutor. You are helping a student master "${context.topic}".
    The student's curriculum is for ${context.topic}.
    Answer their question in a way that is suitable for their level. 
    Question: ${message}
    Be encouraging, use examples, and keep it educational.`,
  });
  return chatResponse.text;
};
