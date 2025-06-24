import { useState } from 'react';
import { setAPIKey, getAPIKeys, hasAPIKey, clearAPIKey, APIKeyConfig } from '@/lib/api-keys';

const PROVIDERS = [
  {
    id: 'openai',
    label: 'OpenAI',
    instructions: 'Get your API key from https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    instructions: 'Get your API key from https://console.anthropic.com/',
  },
  {
    id: 'groq',
    label: 'Groq',
    instructions: 'Get your API key from https://console.groq.com/keys',
  },
];

export default function APIKeyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [keys, setKeys] = useState<APIKeyConfig>(getAPIKeys());
  const [input, setInput] = useState<{ [k: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  function handleSave(provider: string) {
    const key = input[provider]?.trim();
    if (!key) {
      setError('API key cannot be empty.');
      return;
    }
    setAPIKey(provider as keyof APIKeyConfig, key);
    setKeys(getAPIKeys());
    setInput({ ...input, [provider]: '' });
    setError(null);
  }

  function handleClear(provider: string) {
    clearAPIKey(provider as keyof APIKeyConfig);
    setKeys(getAPIKeys());
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Manage API Keys</h2>
        {PROVIDERS.map((provider) => (
          <div key={provider.id} className="mb-4">
            <div className="font-semibold">{provider.label}</div>
            <div className="text-xs text-gray-500 mb-1">{provider.instructions}</div>
            {keys[provider.id] ? (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={keys[provider.id] || ''}
                  readOnly
                  className="input input-bordered w-full text-xs"
                />
                <button className="btn btn-sm btn-warning" onClick={() => handleClear(provider.id)}>
                  Clear
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Paste API key"
                  value={input[provider.id] || ''}
                  onChange={(e) => setInput({ ...input, [provider.id]: e.target.value })}
                  className="input input-bordered w-full text-xs"
                />
                <button className="btn btn-sm btn-primary" onClick={() => handleSave(provider.id)}>
                  Save
                </button>
              </div>
            )}
          </div>
        ))}
        {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
        <div className="flex justify-end mt-4">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2">API keys are stored only in your browser (localStorage).</div>
      </div>
    </div>
  );
}
