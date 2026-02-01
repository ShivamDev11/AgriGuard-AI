import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseAnalysis } from "./types";

export const analyzeCropHealth = async (base64Image: string): Promise<DiseaseAnalysis> => {
  // Ensure API_KEY is available at runtime (injected via vite.config.ts)
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not configured in the environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    You are an expert plant pathologist. Analyze this crop image carefully.
    1. Identify the specific crop (Targeting a database of 120+ varieties including Grains, Vegetables, and Fruits).
    2. Check for signs of pests, fungal infections, bacterial blight, or nutrient deficiencies.
    3. If healthy, state 'Healthy'. If problematic, identify the specific disease.
    
    Return ONLY a JSON object:
    {
      "cropName": "Common and Scientific name",
      "status": "Healthy" | "Infected" | "Warning",
      "diseaseName": "Disease name if status is not Healthy",
      "confidence": number 0-100,
      "description": "Detailed health summary",
      "treatment": ["Immediate step 1", "Immediate step 2"],
      "preventativeMeasures": ["Long term measure 1", "Long term measure 2"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING },
            status: { type: Type.STRING },
            diseaseName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            description: { type: Type.STRING },
            treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            preventativeMeasures: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["cropName", "status", "confidence", "description"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as DiseaseAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Unable to analyze image. Please ensure the crop is clearly visible and try again.");
  }
};