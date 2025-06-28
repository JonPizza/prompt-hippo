"use client";

import { useState, useEffect, useRef } from 'react';
import { setAPIKey, getAPIKeys, hasAPIKey, clearAPIKey, APIKeyConfig } from '@/lib/api-keys';
import { toast } from 'react-hot-toast';

const PROVIDERS = [
	{
		id: 'openai',
		label: 'OpenAI',
		instructions: (
      <>
        Get your API key from{' '}
        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="link link-primary underline">https://platform.openai.com/api-keys</a>
      </>
    ),
		pattern: /^sk-[a-zA-Z0-9]{48}$/, // Basic OpenAI key pattern
	},
	{
		id: 'anthropic',
		label: 'Anthropic',
		instructions: (
      <>
        Get your API key from{' '}
        <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="link link-primary underline">https://console.anthropic.com/</a>
      </>
    ),
		pattern: /^sk-ant-api03-[a-zA-Z0-9_-]{95}$/, // Basic Anthropic key pattern
	},
	{
		id: 'groq',
		label: 'Groq',
		instructions: (
      <>
        Get your API key from{' '}
        <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="link link-primary underline">https://console.groq.com/keys</a>
      </>
    ),
		pattern: /^gsk_[a-zA-Z0-9]{52}$/, // Basic Groq key pattern
	},
] as const;

interface APIKeyModalProps {
	open: boolean;
	onClose: () => void;
}

export default function APIKeyModal({ open, onClose }: APIKeyModalProps) {
	const [keys, setKeys] = useState<APIKeyConfig>(getAPIKeys());
	const [input, setInput] = useState<{ [k: string]: string }>({});
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState<{ [k: string]: boolean }>({});
	const modalRef = useRef<HTMLDialogElement>(null);
	const firstInputRef = useRef<HTMLInputElement>(null);

	// Sync keys state with localStorage when modal opens
	useEffect(() => {
		if (open) {
			setKeys(getAPIKeys());
			setError(null);
			setInput({});
		}
	}, [open]);

	// Handle modal open/close with proper focus management
	useEffect(() => {
		const modal = modalRef.current;
		if (!modal) return;

		if (open) {
			modal.showModal();
			// Focus first input when modal opens
			setTimeout(() => {
				firstInputRef.current?.focus();
			}, 100);
		} else {
			modal.close();
		}

		// Handle ESC key and backdrop click
		const handleCancel = () => {
			onClose();
		};

		modal.addEventListener('cancel', handleCancel);
		return () => modal.removeEventListener('cancel', handleCancel);
	}, [open, onClose]);

	const validateAPIKey = (provider: string, key: string): boolean => {
		const providerConfig = PROVIDERS.find(p => p.id === provider);
		if (!providerConfig?.pattern) return true; // Skip validation if no pattern
		return providerConfig.pattern.test(key);
	};

	const maskAPIKey = (key: string): string => {
		if (key.length <= 8) return key;
		return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`;
	};

	async function handleSave(provider: string) {
		const key = input[provider]?.trim();
		if (!key) {
			setError('API key cannot be empty.');
			return;
		}

		if (!validateAPIKey(provider, key)) {
			setError(`Invalid API key format for ${PROVIDERS.find(p => p.id === provider)?.label}.`);
			return;
		}

		setSaving(prev => ({ ...prev, [provider]: true }));
		setError(null);

		try {
			setAPIKey(provider as keyof APIKeyConfig, key);
			setKeys(getAPIKeys());
			setInput(prev => ({ ...prev, [provider]: '' }));
			toast.success(`${PROVIDERS.find(p => p.id === provider)?.label} API key saved!`);
		} catch (err) {
			setError('Failed to save API key. Please try again.');
			console.error('Error saving API key:', err);
		} finally {
			setSaving(prev => ({ ...prev, [provider]: false }));
		}
	}

	function handleClear(provider: string) {
		const providerName = PROVIDERS.find(p => p.id === provider)?.label;
		if (confirm(`Are you sure you want to remove your ${providerName} API key?`)) {
			clearAPIKey(provider as keyof APIKeyConfig);
			setKeys(getAPIKeys());
			toast.success(`${providerName} API key removed.`);
		}
	}

	if (!open) return null;

	return (
		<dialog 
			ref={modalRef}
			className="modal"
			role="dialog"
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
		>
			<div className="modal-box max-w-2xl">
				<h2 id="modal-title" className="text-xl font-bold mb-2">Manage API Keys</h2>
				<p id="modal-description" className="text-sm text-gray-600 mb-6">
					API keys are stored securely in your browser's local storage and never sent to our servers.
				</p>
				
				<div className="space-y-6">
					{PROVIDERS.map((provider, index) => (
						<div key={provider.id} className="card bg-base-100 border">
							<div className="card-body p-4">
								<div className="flex items-start justify-between mb-2">
									<div>
										<h3 className="font-semibold text-lg">{provider.label}</h3>
										<p className="text-xs text-gray-500">{provider.instructions}</p>
									</div>
									<div className="flex items-center gap-2">
										{keys[provider.id] && (
											<div className="badge badge-success gap-1">
												<span className="w-2 h-2 bg-current rounded-full"></span>
												Connected
											</div>
										)}
									</div>
								</div>
								
								{keys[provider.id] ? (
									<div className="flex items-center gap-2">
										<input
											type="password"
											value={maskAPIKey(keys[provider.id] || '')}
											readOnly
											className="input input-bordered w-full text-sm bg-gray-50"
											aria-label={`${provider.label} API key (masked)`}
										/>
										<button 
											className="btn btn-sm btn-warning"
											onClick={() => handleClear(provider.id)}
											aria-label={`Remove ${provider.label} API key`}
										>
											Remove
										</button>
									</div>
								) : (
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<input
												ref={index === 0 ? firstInputRef : undefined}
												type="text"
												placeholder={`Enter your ${provider.label} API key`}
												value={input[provider.id] || ''}
												onChange={(e) => {
													setInput(prev => ({ ...prev, [provider.id]: e.target.value }));
													if (error) setError(null); // Clear error on input
												}}
												className="input input-bordered w-full text-sm"
												aria-label={`${provider.label} API key input`}
												disabled={saving[provider.id]}
											/>
											<button 
												className="btn btn-sm btn-primary"
												onClick={() => handleSave(provider.id)}
												disabled={saving[provider.id] || !input[provider.id]?.trim()}
												aria-label={`Save ${provider.label} API key`}
											>
												{saving[provider.id] ? (
													<span className="loading loading-spinner loading-xs"></span>
												) : (
													'Save'
												)}
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
				
				{error && (
					<div className="alert alert-error mt-4" role="alert">
						<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>{error}</span>
					</div>
				)}
				
				<div className="modal-action">
					<button 
						className="btn btn-primary"
						onClick={onClose}
						aria-label="Close modal"
					>
						Done
					</button>
				</div>
			</div>
			
			{/* Backdrop */}
			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose} aria-label="Close modal">close</button>
			</form>
		</dialog>
	);
}
