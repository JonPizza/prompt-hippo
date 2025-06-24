import { getAPIKeys } from '@/lib/api-keys';

export async function callOpenAI(model: string, messages: any[]) {
  const { openai } = getAPIKeys();
  if (!openai) throw new Error('Missing OpenAI API key');
  const url = 'https://api.openai.com/v1/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openai}`,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });
  if (!res.ok) throw new Error('OpenAI API error');
  return res.json();
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
    },
    body: JSON.stringify({
      model,
      system,
      messages: [
        { role: 'user', content: user }
      ],
      max_tokens: 1024,
    }),
  });
  if (!res.ok) throw new Error('Anthropic API error');
  return res.json();
}

export async function callGroq(model: string, messages: any[]) {
  const { groq } = getAPIKeys();
  if (!groq) throw new Error('Missing Groq API key');
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groq}`,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });
  if (!res.ok) throw new Error('Groq API error');
  return res.json();
}

export function detectProvider(model: string): 'openai' | 'anthropic' | 'groq' {
  if (model.startsWith('gpt')) return 'openai';
  if (model.startsWith('claude')) return 'anthropic';
  if (model.startsWith('llama') || model.startsWith('mixtral')) return 'groq';
  throw new Error('Unknown model/provider');
}
