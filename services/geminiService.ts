
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AIAnalysis, Vacancy } from "../types";

// Always use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseResumeText = async (text: string): Promise<Partial<Candidate>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse the following resume text and return a JSON object with: 
    name, position, location, email, phone, salaryExpectation (number), experienceYears (number), skills (array of strings).
    Resume Text: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          position: { type: Type.STRING },
          location: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          salaryExpectation: { type: Type.NUMBER },
          experienceYears: { type: Type.NUMBER },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["name", "position", "skills"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return {};
  }
};

export const calculateMatchingScore = async (candidate: Candidate, vacancy: Vacancy): Promise<AIAnalysis> => {
  const prompt = `
    Compare the following candidate with the job vacancy.
    Candidate: ${JSON.stringify(candidate)}
    Vacancy: ${JSON.stringify(vacancy)}
    
    Calculate a matching score (0-100) based on:
    1. Hard Skills (40 pts)
    2. Experience Years (30 pts)
    3. Salary Fit (20 pts)
    4. Nice-to-have skills (10 pts)
    
    Return a JSON object with: 
    score (total number), 
    breakdown (object with hardSkills, experience, salary, bonus), 
    summary (short description).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              hardSkills: { type: Type.NUMBER },
              experience: { type: Type.NUMBER },
              salary: { type: Type.NUMBER },
              bonus: { type: Type.NUMBER },
            },
            required: ["hardSkills", "experience", "salary", "bonus"]
          },
          summary: { type: Type.STRING }
        },
        required: ["score", "breakdown", "summary"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to calculate score", e);
    return {
      score: 0,
      breakdown: { hardSkills: 0, experience: 0, salary: 0, bonus: 0 },
      summary: "Error calculating score"
    };
  }
};
