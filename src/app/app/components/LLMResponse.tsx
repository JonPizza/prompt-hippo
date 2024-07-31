import React from 'react';
import RunnerAnimation from './RunnerAnimation';
import SimpleModal from './SimpleModal';
import JSONView from './JSONView';

function TimeBadge(props: { timeToComplete: number }) {
    let timeToComplete = Math.round(props.timeToComplete * 100) / 100;
    if (timeToComplete < 5) {
        return <div className="badge badge-success float-right text-white ml-1">{timeToComplete}s</div>;
    } else if (timeToComplete < 10) {
        return <div className="badge badge-warning float-right text-white ml-1">{timeToComplete}s</div>;
    } else {
        return <div className="badge badge-error float-right text-white ml-1">{timeToComplete}s</div>;
    }
}

const LLMResponse = React.memo(
    (props: {
        response: any;
        model: string;
        completed: boolean;
        timeToComplete: number;
        validatorResults: { name: string, passed: boolean }[];
    }) => {
        if (!props.completed) {
            return <div className="border rounded p-2 text-slate-600 font-normal w-80 lg:w-96">
                <div><RunnerAnimation /> Running...</div>
            </div>;
        } else {
            const modalId = "modal-" + Math.random().toString(36).substring(7);
            return (
                <>
                    <div
                        onClick={() => document.getElementById(modalId).showModal()}
                        className="whitespace-pre-wrap w-80 lg:w-96 border rounded p-4 font-normal text-left cursor-pointer hover:bg-base-200 transition duration-150">
                        {props.response?.output?.content || props.response}
                        <br></br>
                        {props.validatorResults.map((result) => {
                            return result.passed ? (
                                    <div className='float-left m-1 w-4 h-4 rounded-full border-none bg-emerald-500'></div>
                                ) : (
                                    <div className='float-left m-1 w-4 h-4 rounded-full border-none bg-red-500'></div>
                                );
                            }
                        )}
                        <TimeBadge timeToComplete={props.timeToComplete} />
                        <div className="badge badge-ghost float-right">{props.model}</div>
                        <br className="clear-both" />
                    </div>
                    <SimpleModal
                        modalId={modalId}
                    >
                        <div className="whitespace-pre-wrap rounded font-normal text-left">
                            {props.validatorResults.length !== 0 ? <h2 className="text-xl font-semibold">Validator Results</h2> : <></>}
                            {props.validatorResults.map((result, idx) => {
                                return <div key={idx} className="text-lg font-normal m-2">
                                    {result.name}: {result.passed ? (
                                        <div className='badge bg-emerald-300 text-emerald-800'>Passed</div>
                                    ) : (
                                        <div className='badge bg-red-300 text-red-800'>Failed</div>
                                    )}
                                </div>;
                            })}
                            <h2 className="text-xl font-semibold">Raw Output</h2>
                            <JSONView jsonString={JSON.stringify(props.response)} />
                            <br></br>
                            <TimeBadge timeToComplete={props.timeToComplete} />
                            <div className="badge badge-ghost float-right">{props.model}</div>
                            <br className="clear-both" />
                        </div>
                    </SimpleModal>
                </>
            );
        }
    }
);

export default LLMResponse;