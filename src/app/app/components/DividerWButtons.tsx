"use client";

import { MouseEventHandler, useState, useEffect } from "react"
import ModelSelectModel from "./ModelSelectModel"
import { hasAPIKey } from '@/lib/api-keys';
import { models } from '../../../lib/llm-models';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faKey } from '@fortawesome/free-solid-svg-icons';

export default function DividerWButtons(props: {
    handleAddMessage: MouseEventHandler<HTMLButtonElement>,
    handleRunAll: MouseEventHandler<HTMLButtonElement>,
    handleModelChange: Function,
    model: string,
    children?: any,
    showKeyModal: boolean,
    setShowKeyModal: (show: boolean) => void
}) {
    const [mounted, setMounted] = useState(false);
    
    // Check for API key for current model
    const getProviderForModel = (modelName: string) => {
        const model = models.find(m => m.name === modelName);
        if (!model) return null;
        
        switch (model.company) {
            case 'OpenAI':
                return 'openai';
            case 'Anthropic':
                return 'anthropic';
            case 'Groq':
                return 'groq';
            default:
                return null;
        }
    };
    
    const provider = getProviderForModel(props.model);
    const needsKey = mounted && provider && !hasAPIKey(provider);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex items-center text-gray-500 my-4 w-full overflow-hidden">
            <div className="flex-1 border-b-2 -ml-4 rounded-full"></div>
            <div className="flex px-2 gap-x-2">
                <button className="btn btn-primary py-1" onClick={props.handleAddMessage}>
                    <span><FontAwesomeIcon icon={faPlus} /> &nbsp;&nbsp;Message</span>
                </button>
                {props.children}
                <ModelSelectModel handleModelChange={props.handleModelChange} model={props.model} />
                <button 
                    className={`btn btn-circle ${needsKey ? 'btn-warning' : 'btn-ghost border-slate-300'}`}
                    onClick={() => props.setShowKeyModal(true)}
                    title="API Key Settings"
                >
                    <FontAwesomeIcon icon={faKey} />
                </button>
                <button 
                    className={`btn py-1 ${needsKey ? 'btn-warning' : 'btn-secondary'}`} 
                    onClick={needsKey ? () => props.setShowKeyModal(true) : props.handleRunAll}
                >
                    {!mounted ? 'Run All 🏃' : needsKey ? '⚠️ API Key Required' : 'Run All 🏃'}
                </button>
            </div>
            <div className="flex-1 border-b-2 -mr-4 rounded-full"></div>
        </div>
    )
}