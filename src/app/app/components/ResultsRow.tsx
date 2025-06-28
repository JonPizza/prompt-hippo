import LLMResponse from "./LLMResponse";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

function getOutputString(response: any) {
    if (!response) return '';
    if (typeof response === 'string') return response;
    if (response.output) {
        if (typeof response.output.content === 'string') return response.output.content;
        if (typeof response.output.final_response === 'string') return response.output.final_response;
    }
    return JSON.stringify(response);
}

export default function ResultsRow(
    props: {
        results: { response: any, model: string, timeToComplete: number, completed: boolean }[],
        runNumber: number,
        appendResults: Function,
        validators: any[]
    }
) {
    return (
        <div className="flex flex-cols items-center">
            <div>
                <div className="w-32">
                    Run #{props.runNumber}
                </div>
            </div>
            <div className="flex">
                {props.results.map((result, index) => {
                    let validatorResults = result.completed ? props.validators.map((validator) => {
                        const outputString = getOutputString(result.response);
                        return {
                            name: validator.name,
                            passed: validator.validator(outputString, validator.config)
                        };
                    }) : [];
                    return (
                        <LLMResponse
                            key={index}
                            completed={result.completed}
                            response={result.response}
                            model={result.model}
                            timeToComplete={result.timeToComplete}
                            validatorResults={validatorResults}
                        />
                    );
                })}
            </div>
            <div className="w-32 flex items-center">
                <button className='btn btn-primary mx-auto' onClick={() => { props.appendResults(props.results) }}>
                    <span><FontAwesomeIcon icon={faArrowUp} />&nbsp;&nbsp;Append</span>
                </button>
            </div>
        </div>
    )
}