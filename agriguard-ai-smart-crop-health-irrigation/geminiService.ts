import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseAnalysis } from "./types";

const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey.includes("process.env")) {
    throw new Error("Gemini API Key is missing. Please add API_KEY to your environment.");
  }
  return apiKey;
};

export const analyzeCropHealth = async (base64Image: string): Promise<DiseaseAnalysis> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    You are an expert plant pathologist. Analyze this crop image carefully.
    1. Identify the specific crop (Targeting a database of 120+ varieties).
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
    throw new Error("Unable to analyze image. Please ensure the crop is clearly visible.");
  }
};

export const createAgriChat = () => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are Farmy, an expert agricultural assistant. 
      You have deep expertise in plant pathology (identifying 120+ crop diseases), soil science, and smart irrigation systems. 
      Help the user with crop health, irrigation schedules, and farm management. 
      Be professional, scientific yet practical, and supportive. 
      If a user asks about a disease, provide organic and chemical treatment suggestions.
      Keep responses concise but highly informative.`,
    },
  });
};