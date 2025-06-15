import OpenAI from 'openai';
import { OPENAI_CONFIG } from '../config/openai';

const openai = import.meta.env.VITE_OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
  : null;

export async function processAudioTranscript(transcript: string): Promise<string> {
  if (!openai) {
    console.log('OpenAI API key not found, using original transcript');
    return transcript;
  }

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      temperature: 0.3, // Lower temperature for more focused responses
      max_tokens: 150,
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that improves voice transcripts. Your task is to:
1. Fix any speech-to-text errors
2. Correct grammar and punctuation
3. Format numbers and currency values
4. Keep the original meaning intact
5. Be concise and clear
Only respond with the improved text, no explanations.`
        },
        {
          role: 'user',
          content: transcript
        }
      ]
    });

    return response.choices[0]?.message?.content || transcript;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return transcript;
  }
}