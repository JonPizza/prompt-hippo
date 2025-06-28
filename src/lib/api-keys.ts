// Client-side API key management for LLM providers

export interface APIKeyConfig {
  openai?: string;
  anthropic?: string;
  groq?: string;
}

const STORAGE_KEY = 'prompt-hippo-api-keys';

export function getAPIKeys(): APIKeyConfig {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setAPIKey(provider: keyof APIKeyConfig, key: string): void {
  if (typeof window === 'undefined') return;
  const keys = getAPIKeys();
  keys[provider] = key;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function hasAPIKey(provider: keyof APIKeyConfig): boolean {
  const keys = getAPIKeys();
  return !!keys[provider];
}

export function clearAPIKey(provider: keyof APIKeyConfig): void {
  if (typeof window === 'undefined') return;
  const keys = getAPIKeys();
  delete keys[provider];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}
