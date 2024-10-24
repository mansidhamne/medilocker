import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatbotService {
  private readonly apiKey = process.env.GEMINI_API_KEY;
  private readonly genAI = new GoogleGenerativeAI(this.apiKey);
  private readonly model = this.genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  private readonly generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  async getChatResponse(userMessage: string): Promise<string> {
    const chatSession = this.model.startChat({
      generationConfig: this.generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: 'you are a health bot trained to answer basic questions related to health/fitness',
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: "I'm here to help! Ask me anything about health and fitness...",
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(userMessage);
    return result.response.text();
  }
}
