import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const streamNarrative = async (prompt: string, onUpdate: (chunk: string) => void) => {
  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    for await (const chunk of response) {
      onUpdate(chunk.text);
    }
  } catch (error) {
    console.error(`Error streaming content for prompt: ${prompt.substring(0, 50)}...`, error);
    throw new Error("Failed to stream content from the API.");
  }
};

export const streamNarratives = async (
  idea: string,
  onStorytellingUpdate: (chunk: string) => void,
  onStorydoingUpdate: (chunk: string) => void
): Promise<void> => {
  const storytellingPrompt = `
    Basado en la siguiente idea central, genera una narrativa convincente y atractiva (storytelling). 
    La narrativa debe tener un principio, un desarrollo y un final claros. 
    Debe ser evocadora y pintar una imagen vívida para el lector.
    
    Idea Central: "${idea}"
  `;

  const storydoingPrompt = `
    Basado en la siguiente idea central, diseña una experiencia interactiva o una serie de acciones para que una audiencia participe (storydoing). 
    Describe los pasos, las interacciones o las actividades que la gente realizaría. 
    Debe ser práctico, atractivo y fomentar la participación activa.

    Idea Central: "${idea}"
  `;

  await Promise.all([
    streamNarrative(storytellingPrompt, onStorytellingUpdate),
    streamNarrative(storydoingPrompt, onStorydoingUpdate),
  ]);
};