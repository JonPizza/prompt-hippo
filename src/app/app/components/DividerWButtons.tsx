import { MouseEventHandler, useState } from "react"
import ModelSelectModel from "./ModelSelectModel"
import APIKeyModal from '@/components/api-key-modal';
import { hasAPIKey } from '@/lib/api-keys';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function DividerWButtons(props: {
    handleAddMessage: MouseEventHandler<HTMLButtonElement>,
    handleRunAll: MouseEventHandler<HTMLButtonElement>,
    handleModelChange: Function,
    model: string,
    children?: any
}) {
    const [showKeyModal, setShowKeyModal] = useState(false);
    // Check for API key for current model
    const provider = props.model.startsWith('gpt') ? 'openai' : props.model.startsWith('claude') ? 'anthropic' : (props.model.startsWith('llama') || props.model.startsWith('mixtral')) ? 'groq' : null;
    const needsKey = provider && !hasAPIKey(provider);

    return (
        <div className="flex items-center text-gray-500 my-4 w-full overflow-hidden">
            <div className="flex-1 border-b-2 -ml-4 rounded-full"></div>
            <div className="flex px-2 gap-x-2">
                <button className="btn btn-primary py-1" onClick={props.handleAddMessage}>
                    <span><FontAwesomeIcon icon={faPlus} /> &nbsp;&nbsp;Message</span>
                </button>
                {props.children}
                <ModelSelectModel handleModelChange={props.handleModelChange} model={props.model} />
                <button className="btn btn-secondary py-1" onClick={needsKey ? () => setShowKeyModal(true) : props.handleRunAll}>
                    {needsKey ? 'Add API Key' : 'Run All 🏃'}
                </button>
            </div>
            <div className="flex-1 border-b-2 -mr-4 rounded-full"></div>
            <APIKeyModal open={showKeyModal} onClose={() => setShowKeyModal(false)} />
        </div>
    )
}