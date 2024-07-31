'use client';

import React, { useState, memo, ChangeEventHandler, MouseEventHandler } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faEllipsisVertical, faArrowsLeftRight, faPlus } from '@fortawesome/free-solid-svg-icons'

interface InputBoxProps {
    value: string;
    rowIdx: number;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    handleDeleteCol: Function,
    horizCopy: Function,
    colIdx: number
}

const InputBox: React.FC<InputBoxProps> = memo(({ value, rowIdx, onChange, handleDeleteCol, horizCopy, colIdx }) => {
    return (
        <div className='flex relative group'>
            <textarea
                placeholder='Enter a message...'
                className='w-80 lg:w-96 input input-bordered min-h-32 h-full font-normal'
                value={value}
                onChange={onChange}
            />
            {
                rowIdx == 0 ? (
                    <button
                        className='bg-red-500 hover:bg-red-700 text-white rounded-full w-20 h-6 -ml-20 -mt-7 text-xs'
                        onClick={(e) => { handleDeleteCol(colIdx) }}
                    >
                        <FontAwesomeIcon icon={faEraser} />&nbsp;&nbsp;Column
                    </button>
                ) : (
                    <></>
                )
            }
            <div className="dropdown dropdown-hover dropdown-end absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <div tabIndex={0} role="button" className="btn btn-circle btn-secondary btn-xs">
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </div>
                <div
                    tabIndex={0}
                    className="card compact dropdown-content bg-base-100 rounded-box z-[1] w-64 shadow">
                    <ul tabIndex={0} className="card-body">
                        <li className='hover:bg-base-300 cursor-pointer p-1 rounded' onClick={() => {horizCopy(rowIdx, colIdx)}}>
                            <FontAwesomeIcon icon={faArrowsLeftRight} />&nbsp;&nbsp;Copy Horizontally
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
});

export default function InputRow(props: {
    rowData: { type: string; messages: string[]; },
    rowIdx: number,
    handleChange: Function,
    handleMsgTypeChange: Function,
    handleDeleteCol: Function,
    handleDeleteRow: Function,
    horizCopy: Function,
    handleAddCol: MouseEventHandler<HTMLButtonElement>
}) {
    let extraClass = props.rowIdx == 0 ? 'mt-7' : '';
    return (
        <div className={'flex flex-cols min-h-32 items-center ' + extraClass}>
            <div>
                <select
                    className='select w-32'
                    value={props.rowData.type}
                    onChange={(e) => props.handleMsgTypeChange(props.rowIdx, e.target.value)}
                >
                    <option value="human">Human</option>
                    <option value="ai">AI</option>
                    <option value="system">System</option>
                </select>
            </div>
            <div className='flex items-stretch'>
                {props.rowData.messages.map((data, colIndex) => {
                    return (
                        <InputBox
                            key={colIndex}
                            rowIdx={props.rowIdx}
                            value={data}
                            onChange={(e) => props.handleChange(props.rowIdx, colIndex, e.target.value)}
                            handleDeleteCol={props.handleDeleteCol}
                            colIdx={colIndex}
                            horizCopy={props.horizCopy}
                        />
                    );
                })}
            </div>
            {props.rowIdx == 0 ? (
                <div className='w-32 flex items-center'>
                    <button className='btn mx-auto' onClick={props.handleAddCol}>
                        <span><FontAwesomeIcon icon={faPlus} />&nbsp;&nbsp;Column</span>
                    </button>
                </div>
            ) : (
                <div className='w-32 flex items-center'>
                    <button className='btn btn-error mx-auto' onClick={(e) => { props.handleDeleteRow(props.rowIdx) }}>
                        <span><FontAwesomeIcon icon={faEraser} />&nbsp;&nbsp;Row</span>
                    </button>
                </div>
            )}

        </div>
    );
}