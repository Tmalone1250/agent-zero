
import { callOpenRouter } from './config';
import { parseDocument } from "@/utils/documentParser";

export const generateContent = async (prompt: string) => {
  try {
    console.log("Generating content for prompt:", prompt);
    
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

    const messages = [
      { role: "system", content: "You are a helpful AI assistant that provides high-quality content generation." },
      { role: "user", content: `${prompt}${documentContent ? `\n\nDocument Content:\n${documentContent}` : ''}` }
    ];

    console.log("Sending request to OpenRouter API");
    const result = await callOpenRouter(messages);
    console.log("Received content generation response");
    return result;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
