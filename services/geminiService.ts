import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Ideally, in a production app, the key shouldn't be exposed on the client side without restrictions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMotivation = async (name: string, isMorning: boolean): Promise<string> => {
  try {
    const timeContext = isMorning ? "pagi hari sebelum mengajar" : "siang/sore hari setelah selesai mengajar";
    const prompt = `
      Berikan satu kalimat motivasi pendek, hangat, dan inspiratif (maksimal 20 kata) untuk seorang guru bernama ${name}. 
      Konteks waktu: ${timeContext}.
      Gunakan Bahasa Indonesia yang natural dan sopan.
      Jangan gunakan tanda kutip.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Terima kasih atas dedikasi Anda mencerdaskan bangsa!";
  } catch (error) {
    console.error("Error generating motivation:", error);
    return "Semangat mengajar! Anda adalah pahlawan tanpa tanda jasa.";
  }
};