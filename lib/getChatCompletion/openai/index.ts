import pLimit from 'p-limit';
import { openAiRequestConcurrency, openAiApiKey, openAiModel, openAiOrganisation } from './config';
import { GetChatCompletion } from '..';

const globalRateLimit = pLimit(openAiRequestConcurrency);

export const getChatCompletion: GetChatCompletion = async (messages) => {
  return globalRateLimit(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiApiKey}`,
          'OpenAI-Organization': openAiOrganisation,
        },
        body: JSON.stringify({
          model: openAiModel,
          messages: messages,
          max_tokens: 1000
        })
    });
    
    if (!response.ok || response.status >= 400) {
        throw new Error(`HTTP error calling API: got status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  });
}