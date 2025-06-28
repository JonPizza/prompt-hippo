'use client';

import Grid from "./Grid";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingState } from "@/components/common/loading-states";

import { useState, Suspense } from "react";
import Link from "next/link";
import ChangeNameButton from "./ChangeNameButton";

const validatorOptions = [
    {
        name: 'JSON Validator',
        description: 'Ensure that the output is in valid JSON format.',
        config: [{}],
        validator: (output: string, config) => {
            try {
                JSON.parse(output);
                return true;
            } catch (e) {
                return false;
            }
        },
        enabled: false
    },
    {
        name: 'String Check',
        description: 'Check for a specific string in the output.',
        config: [{
            type: 'text',
            label: 'String',
            placeholder: 'The string to check for',
            value: 'Hello'
        }],
        validator: (output: string, config: any[]) => {
            console.log(output, config);
            return output.includes(config[0].value);
        },
        enabled: false
    }
];

function ConfigInput(props: { config: any[], validators: any[], validatorIdx: number, setValidators: Function }) {
    function updateValidatorsConfig(idx: number, configIdx: number, newValue: string) {
        try {
            const newValidators = [...props.validators];
            if (newValidators[idx] && newValidators[idx].config && newValidators[idx].config[configIdx]) {
                newValidators[idx].config[configIdx].value = newValue;
                props.setValidators(newValidators);
            }
        } catch (error) {
            console.error('Error updating validator config:', error);
        }
    }

    if (!props.config || !Array.isArray(props.config)) {
        return <div>Invalid configuration</div>;
    }

    for (let i = 0; i < props.config.length; i++) {
        const conf = props.config[i];
        if (conf.type === 'text') {
            return (
                <div key={i}>
                    <label>{conf.label}: </label>
                    <input type="text" className="input" value={conf.value} placeholder={conf.placeholder} onInput={
                        (e: React.ChangeEvent<HTMLInputElement>) => { updateValidatorsConfig(props.validatorIdx, i, e.target.value) }
                    } />
                </div>
            );
        }
    }
}

export default function GridWithValidators(props: {
    projectId: number,
    userId: string,
    projectData: any
    projectName: string
}) {
    const [validators, setValidators] = useState(validatorOptions);
    const [name, setName] = useState(props.projectName);

    const enabledValidators = validators.filter(option => option.enabled);

    function toggleValidator(idx: number) {
        try {
            if (idx >= 0 && idx < validators.length) {
                const newValidators = [...validators];
                newValidators[idx].enabled = !newValidators[idx].enabled;
                setValidators(newValidators);
            }
        } catch (error) {
            console.error('Error toggling validator:', error);
        }
    }

    return (
        <ErrorBoundary>
            <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <Link href={"/profile"} className="link">
                        ← All Projects
                    </Link>

                    <h1 className="text-3xl font-bold my-1 flex items-center gap-2">
                        {name || 'Untitled Project'}
                        {props.projectId > 0 ? (
                            <ErrorBoundary fallback={<span className="text-sm text-error">Error loading name editor</span>}>
                                <ChangeNameButton 
                                    name={name || 'Untitled Project'} 
                                    projectId={props.projectId} 
                                    setName={setName} 
                                />
                            </ErrorBoundary>
                        ) : null}
                    </h1>
                    
                    <Suspense fallback={
                        <LoadingState message="Loading project..." size="lg" />
                    }>
                        <Grid
                            validators={enabledValidators}
                            projectId={props.projectId}
                            userId={props.userId}
                            projectData={props.projectData}
                        >
                            <label htmlFor="my-drawer-4" className="drawer-button btn">
                                Validators: {enabledValidators.length} ⚙️
                            </label>
                        </Grid>
                    </Suspense>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 lg:w-[800px] p-12">
                        <div className="font-bold text-2xl">
                            Configure Validators <div className="badge badge-warning">BETA</div>
                        </div>
                        <ErrorBoundary fallback={<div className="text-error">Error loading validators</div>}>
                            {validators.map((option, idx) => {
                                return (
                                    <div key={idx} className="m-4 border border-base-300 rounded-xl p-4 gap-4 grid grid-cols-1">
                                        <div className="font-bold text-lg">
                                            <input 
                                                type="checkbox" 
                                                defaultChecked={option.enabled} 
                                                onChange={() => toggleValidator(idx)}
                                            /> {option.name}
                                        </div>
                                        <div>
                                            {option.description}
                                        </div>
                                        <ErrorBoundary fallback={<div className="text-sm text-error">Error loading config</div>}>
                                            <ConfigInput 
                                                config={option.config} 
                                                validators={validators}
                                                validatorIdx={idx}
                                                setValidators={setValidators}
                                            />
                                        </ErrorBoundary>
                                    </div>
                                );
                            })}
                        </ErrorBoundary>
                    </ul>
                </div>
            </div>
        </ErrorBoundary>
    );
}