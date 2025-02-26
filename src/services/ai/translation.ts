
import { createGeminiClient, DEFAULT_MODEL_CONFIG } from './config';

export const generateTranslation = async (text: string, targetLanguage: string) => {
  try {
    console.log("Generating translation for text:", text, "to language:", targetLanguage);
    const genAI = await createGeminiClient();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro",
      generationConfig: DEFAULT_MODEL_CONFIG
    });

    const result = await model.generateContent(`
      Please translate the following text to ${targetLanguage}:
      
      ${text}
      
      Please provide only the translated text without any additional comments or explanations.
    `);
    const response = await result.response;
    const translatedText = response.text();
    console.log("Received translation:", translatedText);
    return translatedText;
  } catch (error) {
    console.error("Error generating translation:", error);
    throw error;
  }
};
