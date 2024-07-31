'use client';

import React, { useState, useCallback } from 'react';

import ResultsRow from './ResultsRow';
import InputRow from './InputRow';
import DividerWButtons from './DividerWButtons';
import { runAllColumns } from './LangServe';

// props interface
interface GridProps {
    paid: boolean;
    validators: any[];
    children?: React.ReactNode;
}


const Grid: React.FC<GridProps> = ({ paid, validators, children }) => {
    const [messages, setMessages] = useState([
        {
            type: 'system',
            messages: [
                'You act like a parrot. Squak with every message. Always respond in JSON format, without markdown.',
                'You are Evil SpongeBob Squarepants. You have made billions in private equity.',
                'You really really really like ginger ale and can\'t stop talking about it.',
                'You very obviously have a crush on the person you are talking to, but you are trying to hide it and you are very awkward.'
            ]
        },
        {
            type: 'human',
            messages: [
                'Hello!',
                'Hello!',
                'Hello!',
                'Hello!',
            ]
        }
    ]);

    const [results, setResults] = useState([]);

    const [model, setModel] = useState('gpt-4o-mini');
    const [langserveUrl, setLangserveUrl] = useState('http://0.0.0.0:8000/gpt-4o-mini/invoke');

    const handleChange = useCallback((rowIndex: number, colIndex: number, value: string) => {
        setMessages((prevData) => {
            const newData = [...prevData];
            newData[rowIndex].messages = [...newData[rowIndex].messages];
            newData[rowIndex].messages[colIndex] = value;
            return newData;
        });
    }, []);

    const handleMsgTypeChange = useCallback((rowIndex: number, value: string) => {
        setMessages((prevData) => {
            const newData = [...prevData];
            newData[rowIndex].messages = [...newData[rowIndex].messages];
            newData[rowIndex].type = value;
            return newData;
        });
    }, []);

    const handleAddMessage = useCallback(() => {
        setMessages((prevData) => {
            const newData = [...prevData];
            const lastIdx = newData.length - 1;
            const newMessages = [...newData[lastIdx].messages].map(() => "");
            newData.push({ type: 'human', messages: newMessages })
            return newData;
        });
    }, []);

    const handleDeleteRow = useCallback((rowIndex: number) => {
        setMessages((prevData) => {
            const newData = [...prevData];
            newData.splice(rowIndex, 1);
            return newData;
        });
    }, []);

    const handleDeleteColumn = useCallback((colIndex: number) => {
        setMessages((prevData) => {
            const newData = [...prevData];
            newData.forEach((row) => {
                row.messages.splice(colIndex, 1);
            });
            return newData;
        });

        setResults((prevData) => {
            const newData = [...prevData];

            for (let i = 0; i < newData.length; i++) {
                newData[i].results.splice(colIndex, 1);
            }

            return newData;
        });
    }, []);

    const handleAddColumn = () => {
        setMessages((prevData) => {
            const newData = [...prevData];
            newData.forEach((row) => {
                row.messages.push("");
            });
            return newData;
        });

        setResults((prevData) => {
            const newData = [...prevData];
            if (newData.length == 0) return;
            newData.forEach((row) => {
                row.results.push({
                    timeToComplete: NaN,
                    response: 'No data',
                    model: '',
                    completed: true
                });
            });
            return newData;
        });
    };

    const handleRunAll = () => {
        let runNumber;
        setResults((prevData) => {
            const newData = [...prevData];
            runNumber = newData.length + 1;
            newData.unshift(
                {
                    results: Array(messages[0].messages.length).fill({
                        timeToComplete: NaN,
                        response: '',
                        model: '',
                        completed: false
                    }),
                    runNumber: runNumber
                }
            );
            return newData;
        });

        runAllColumns(
            langserveUrl,
            messages
        ).then((promises) => {
            promises.map((promise) => {
                promise.then(([columnIdx, result, timeToComplete]) => {
                    setResults((prevData) => {
                        const newData = [...prevData];
                        newData.find((el) => el.runNumber === runNumber).results[columnIdx] = {
                            timeToComplete: timeToComplete,
                            response: result,
                            model: model,
                            completed: true
                        };
                        return newData;
                    })
                });
            });
        });
    };

    const appendResults = useCallback((results) => {
        setMessages((prevData) => {
            const newData = [...prevData];
            newData.push({ type: 'ai', messages: results.map((result) => result.response?.output?.content || '') });
            return newData;
        });
    }, []);

    const handleModelChange = useCallback((modelName: string, langserveUrl: string) => {
        setModel(modelName);
        setLangserveUrl(langserveUrl);
    }, []);

    const handleCopyHorizontal = (rowIdx: number, colIdx: number) => {
        console.log(rowIdx, colIdx);
        const valueToCopy = messages[rowIdx].messages[colIdx];
        setMessages((prevData) => {
            const newData = [...prevData];
            newData[rowIdx].messages = [...newData[rowIdx].messages];
            for (let i = 0; i < newData[rowIdx].messages.length; i++) {
                newData[rowIdx].messages[i] = valueToCopy;
            }
            return newData;
        });
    };

    return (
        <div className="flex items-center mx-auto">
            <div className="overflow-x-auto whitespace-nowrap mt-3">

                {messages.map((message_list, idx) => {
                    return <InputRow
                        handleChange={handleChange}
                        handleMsgTypeChange={handleMsgTypeChange}
                        handleDeleteCol={handleDeleteColumn}
                        handleDeleteRow={handleDeleteRow}
                        handleAddCol={handleAddColumn}
                        horizCopy={handleCopyHorizontal}
                        rowData={message_list}
                        rowIdx={idx}
                        key={idx}
                    />
                })}

                <DividerWButtons
                    handleAddMessage={handleAddMessage}
                    handleRunAll={handleRunAll}
                    handleModelChange={handleModelChange}
                    model={model}
                    paid={paid}
                >
                    {children}
                </DividerWButtons>
                {results.length > 0 ?
                    (
                        <div className="rounded mt-2 w-fit">
                            {results.length > 0 ? results.map((result, idx) => {
                                return <ResultsRow
                                    key={idx}
                                    results={result.results}
                                    runNumber={result.runNumber}
                                    appendResults={appendResults}
                                    validators={validators}
                                />
                            }) : <></>}
                        </div>
                    ) : (
                        <div className='w-full text-center'>
                            Click "Run All 🏃" to run your first comparison!
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Grid;
