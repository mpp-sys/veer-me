import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '../utils/shiftPrompts.js';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // prototype only — never use in production
});

/**
 * Make a one-shot call to Shift (non-streaming)
 * @param {Array} messages - Array of { role: 'user'|'assistant', content: string }
 * @param {Object} userProfile - User profile from context
 * @param {number} maxTokens - Max tokens for response
 * @returns {Promise<string>} Shift's response text
 */
export async function callShift(messages, userProfile, maxTokens = 400) {
  const systemPrompt = buildSystemPrompt(userProfile);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: messages,
  });

  return response.content[0].text;
}

/**
 * Stream a response from Shift, calling onChunk with each text delta
 * @param {Array} messages - Array of { role: 'user'|'assistant', content: string }
 * @param {Object} userProfile - User profile from context
 * @param {Function} onChunk - Called with each text chunk as it arrives
 * @param {Function} onComplete - Called when streaming is done with full text
 * @param {number} maxTokens - Max tokens for response
 */
export async function streamShift(messages, userProfile, onChunk, onComplete, maxTokens = 400) {
  const systemPrompt = buildSystemPrompt(userProfile);

  let fullText = '';

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: messages,
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta?.type === 'text_delta'
    ) {
      const chunk = event.delta.text;
      fullText += chunk;
      onChunk(chunk, fullText);
    }
  }

  if (onComplete) {
    onComplete(fullText);
  }

  return fullText;
}
