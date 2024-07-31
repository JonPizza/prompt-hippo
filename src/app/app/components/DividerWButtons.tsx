import { MouseEventHandler } from "react"
import ModelSelectModel from "./ModelSelectModel"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function DividerWButtons(props: {
    handleAddMessage: MouseEventHandler<HTMLButtonElement>,
    handleRunAll: MouseEventHandler<HTMLButtonElement>,
    handleModelChange: Function,
    model: string,
    paid: boolean,
    children?: any
}) {

    return (
        <div className="flex items-center text-gray-500 my-4 w-full overflow-hidden">
            <div className="flex-1 border-b-2 -ml-4 rounded-full"></div>
            <div className="flex px-2 gap-x-2">
                <button className="btn btn-primary py-1" onClick={props.handleAddMessage}>
                    <span><FontAwesomeIcon icon={faPlus} /> &nbsp;&nbsp;Message</span>
                </button>
                {props.children}
                <ModelSelectModel handleModelChange={props.handleModelChange} model={props.model} paid={props.paid} />
                <button className="btn btn-secondary py-1" onClick={props.handleRunAll}>
                    Run All 🏃
                </button>
            </div>
            <div className="flex-1 border-b-2 -mr-4 rounded-full"></div>
        </div>
    )
} 