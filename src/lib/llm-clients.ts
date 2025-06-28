import { getAPIKeys } from '@/lib/api-keys';
import { models } from '@/lib/llm-models';

export async function callOpenAI(model: string, messages: any[]) {
  const { openai } = getAPIKeys();
  if (!openai) throw new Error('Missing OpenAI API key');
  const url = 'https://api.openai.com/v1/chat/completions';
  
  // Convert message format: type -> role for OpenAI API
  const openaiMessages = messages.map(msg => ({
    role: msg.type === 'system' ? 'system' : msg.type === 'human' ? 'user' : 'assistant',
    content: msg.content
  }));
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openai}`,
    },
    body: JSON.stringify({
      model,
      messages: openaiMessages,
    }),
  });
  if (!res.ok) {
    let apiOutput = await res.text();
    throw new Error(`OpenAI API error: ${apiOutput}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function callAnthropic(model: string, messages: any[]) {
  const { anthropic } = getAPIKeys();
  if (!anthropic) throw new Error('Missing Anthropic API key');
  const url = 'https://api.anthropic.com/v1/messages';
  const system = messages.find((m) => m.type === 'system')?.content || '';
  const user = messages.filter((m) => m.type === 'human').map((m) => m.content).join('\n');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropic,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      system,
      messages: [
        { role: 'user', content: user }
      ],
      max_tokens: getMaxTokens(model),
    }),
  });
  if (!res.ok) {
    let apiOutput = await res.text();
    throw new Error(`Anthropic API error: ${apiOutput}`);
  }
  let json = await res.json();
  console.log(JSON.stringify(json));
  return json.content[0].text;
}

export async function callGroq(model: string, messages: any[]) {
  const { groq } = getAPIKeys();
  if (!groq) throw new Error('Missing Groq API key');
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  // Convert message format: type -> role for Groq API
  const groqMessages = messages.map(msg => ({
    role: msg.type === 'system' ? 'system' : msg.type === 'human' ? 'user' : 'assistant',
    content: msg.content
  }));
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groq}`,
    },
    body: JSON.stringify({
      model,
      messages: groqMessages,
    }),
  });
  if (!res.ok) {
    let apiOutput = await res.text();
    throw new Error(`Groq API error: ${apiOutput}`);
  }
  return (await res.json()).choices[0].message.content;
}

export function detectProvider(model: string): 'openai' | 'anthropic' | 'groq' {
  const found = models.find((m) => m.name === model);
  if (!found) throw new Error('Unknown model/provider');
  if (found.company === 'OpenAI') return 'openai';
  if (found.company === 'Anthropic') return 'anthropic';
  if (found.company === 'Groq') return 'groq';
  throw new Error('Unknown model/provider');
}

export function getMaxTokens(model: string): number {
  const found = models.find((m) => m.name === model);
  if (!found) throw new Error('Unknown model');
  
  // Only use model-specific max_tokens for Anthropic models
  if (found.company === 'Anthropic' && 'max_tokens' in found && found.max_tokens) {
    return found.max_tokens;
  }
  
  return 4096; // fallback
}
