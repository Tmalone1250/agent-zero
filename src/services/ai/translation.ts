
import { callOpenRouter } from './config';

export const generateTranslation = async (text: string, targetLanguage: string) => {
  try {
    console.log("Generating translation for text:", text, "to language:", targetLanguage);
    
    const messages = [
      { role: "system", content: `You are a professional translator. Translate the given text to ${targetLanguage} accurately, maintaining the original meaning and tone. Provide only the translated text without any additional comments or explanations.` },
      { role: "user", content: text }
    ];

    const result = await callOpenRouter(messages);
    console.log("Received translation");
    return result;
  } catch (error) {
    console.error("Error generating translation:", error);
    throw error;
  }
};
