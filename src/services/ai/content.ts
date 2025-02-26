
import { createGeminiClient, DEFAULT_MODEL_CONFIG } from './config';
import { parseDocument } from "@/utils/documentParser";

export const generateContent = async (prompt: string) => {
  try {
    console.log("Generating content for prompt:", prompt);
    const genAI = await createGeminiClient();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro",
      generationConfig: DEFAULT_MODEL_CONFIG
    });

    const fileUrlMatch = prompt.match(/https:\/\/.*?\.(?:pdf|txt|docx)/i);
    const fileUrl = fileUrlMatch ? fileUrlMatch[0] : null;

    let documentContent = "";
    if (fileUrl) {
      try {
        console.log("Attempting to fetch document from:", fileUrl);
        const response = await fetch(fileUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`);
        }

        const blob = await response.blob();
        const fileName = fileUrl.split('/').pop() || 'document';
        const file = new File([blob], fileName, { type: response.headers.get('content-type') || '' });

        console.log("Parsing document content...");
        documentContent = await parseDocument(file);
        console.log("Successfully parsed document content");
      } catch (error) {
        console.error("Error processing document:", error);
        documentContent = "Error: Unable to process the document content. Please ensure the file is accessible and try again.";
      }
    }

    const finalPrompt = `
      ${prompt}
      
      ${documentContent ? `Document Content:
      ${documentContent}
      
      Please analyze this document content and provide a detailed response based on the user's request.` : ''}
    `;

    console.log("Sending final prompt to Gemini API");
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    console.log("Received content generation response:", text);
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
