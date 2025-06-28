import { callOpenAI, callAnthropic, callGroq, detectProvider } from '@/lib/llm-clients';
import { hasAPIKey } from '@/lib/api-keys';

function getColumn(data: any[], colIdx: number) {
  let messages = [];
  for (let i = 0; i < data.length; i++) {
    messages.push({
      type: data[i].type,
      content: data[i].messages[colIdx],
    });
  }
  return messages;
}

export async function runAllColumns(model: string, data: any[]) {
  const provider = detectProvider(model);
  if (!hasAPIKey(provider)) throw new Error(`Missing API key for ${provider}`);

  let errorShown = false;
  let errorMessage = '';

  return data[0].messages.map(async (_: any, columnIdx: number) => {
    return new Promise(async (resolve) => {
      let column = getColumn(data, columnIdx);
      const startTime = Date.now();
      try {
        let result;
        if (provider === 'openai') {
          result = await callOpenAI(model, column);
        } else if (provider === 'anthropic') {
          result = await callAnthropic(model, column);
        } else if (provider === 'groq') {
          result = await callGroq(model, column);
        }
        const timeToComplete = (Date.now() - startTime) / 1000;
        resolve([columnIdx, result, timeToComplete]);
      } catch (error: any) {
        if (!errorShown) {
          errorShown = true;
          errorMessage = error?.message || 'Unknown error';
        }
        resolve([columnIdx, { error: true, message: error?.message || 'Error occurred!!' }, (Date.now() - startTime) / 1000]);
      }
    });
  });
}
