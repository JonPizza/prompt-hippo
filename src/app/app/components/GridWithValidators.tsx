'use client';

import Grid from "./Grid";

import { useState } from "react";
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
    function updateValidatorsConfig(idx: number, configIdx, newValue) {
        const newValidators = [...props.validators];
        newValidators[idx].config[configIdx].value = newValue;
        props.setValidators(newValidators);
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
        const newValidators = [...validators];
        newValidators[idx].enabled = !newValidators[idx].enabled;
        setValidators(newValidators);
    }

    return (
        <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <Link href={"/profile"} className="link">
                    ← All Projects
                </Link>

                <h1 className="text-3xl font-bold my-1 flex items-center gap-2">
                    {name || 'Untitled Project'}
                    {props.projectId > 0 ? <ChangeNameButton name={name || 'Untitled Project'} projectId={props.projectId} setName={setName} /> : <></>}
                </h1>
                
                <Grid
                    validators={enabledValidators}
                    projectId={props.projectId}
                    userId={props.userId}
                    projectData={props.projectData}
                >
                    <label htmlFor="my-drawer-4" className="drawer-button btn">Validators: {enabledValidators.length} ⚙️</label>
                </Grid>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 lg:w-[800px] p-12">
                    <div className="font-bold text-2xl">Configure Validators <div className="badge badge-warning">BETA</div></div>
                    {validators.map((option, idx) => {
                        return (
                            <div key={idx} className="m-4 border border-base-300 rounded-xl p-4 gap-4 grid grid-cols-1">
                                <div className="font-bold text-lg"><input type="checkbox" defaultChecked={option.enabled} onClick={
                                    (e) => { toggleValidator(idx) }
                                } /> {option.name}</div>
                                <div>
                                    {option.description}
                                </div>
                                <ConfigInput 
                                    config={option.config} 
                                    validators={validators}
                                    validatorIdx={idx}
                                    setValidators={setValidators}
                                />
                            </div>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}