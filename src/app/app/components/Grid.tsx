'use client';

import React, { useState, useCallback, useEffect } from 'react';

import ResultsRow from './ResultsRow';
import InputRow from './InputRow';
import DividerWButtons from './DividerWButtons';
import { runAllColumns as runAllColumnsLLM } from '../../../lib/llm-runner';
import SavePromptsBtn from './SavePromptsBtn';
import APIStatus from '@/components/api-status';
import { getAPIErrorMessage } from '@/utils/api-errors';
import APIKeyModal from '@/components/api-key-modal';
import { ErrorBoundary } from '@/components/error-boundary';

// Loading component for grid initialization
function GridInitializing() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4 text-lg">Initializing project...</p>
                <p className="text-sm opacity-70">Setting up your workspace</p>
            </div>
        </div>
    );
}

// props interface
interface GridProps {
    validators: any[];
    projectId: number;
    userId: string;
    children?: React.ReactNode;
    projectData?: any;
}


const Grid: React.FC<GridProps> = ({ projectId, userId, validators, children, projectData }) => {
    let messages, setMessages;
    const [results, setResults] = useState([]);
    let model, setModel;
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiLoading, setApiLoading] = useState(false);
    const [showKeyModal, setShowKeyModal] = useState(false);
    
    // Add initialization loading state
    const [isInitializing, setIsInitializing] = useState(true);
    
    // Initialize data with loading state
    useEffect(() => {
        const initializeGrid = async () => {
            try {
                // Simulate initialization time for better UX
                await new Promise(resolve => setTimeout(resolve, 300));
                setIsInitializing(false);
            } catch (error) {
                console.error('Grid initialization error:', error);
                setIsInitializing(false);
            }
        };
        
        initializeGrid();
    }, [projectData]);
    
    if (projectData == null) {
        [messages, setMessages] = useState([
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

        [model, setModel] = useState('gpt-4o-mini');
    } else {
        let parsedData = JSON.parse(projectData);
        [messages, setMessages] = useState(parsedData.messages);
        [model, setModel] = useState(parsedData.model);
    }

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
            if (newData.length == 0) return [];
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

    const handleRunAll = async () => {
        setApiError(null);
        setApiLoading(true);
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

        try {
            const promises = await runAllColumnsLLM(
                model,
                messages
            );
            
            // Process results as they come in instead of waiting for all
            promises.forEach((promise, index) => {
                promise.then(([columnIdx, result, timeToComplete]) => {
                    // Check for error in this specific result
                    if (typeof result === 'object' && result?.error) {
                        alert(`An error occurred in column ${columnIdx + 1}. Here is the API output: ${result.message}`);
                    }
                    
                    setResults((prevData) => {
                        const newData = [...prevData];
                        const currentRun = newData.find((el) => el.runNumber === runNumber);
                        if (currentRun) {
                            currentRun.results[columnIdx] = {
                                timeToComplete: timeToComplete,
                                response: typeof result === 'object' && result?.error ? result.message : result,
                                model: model,
                                completed: true
                            };
                        }
                        return newData;
                    });
                }).catch((error) => {
                    // Handle individual promise errors
                    console.error(`Error in column ${index}:`, error);
                    setResults((prevData) => {
                        const newData = [...prevData];
                        const currentRun = newData.find((el) => el.runNumber === runNumber);
                        if (currentRun) {
                            currentRun.results[index] = {
                                timeToComplete: 0,
                                response: `Error: ${error.message || 'Unknown error'}`,
                                model: model,
                                completed: true
                            };
                        }
                        return newData;
                    });
                });
            });

            // Still wait for all promises to complete before clearing loading state
            await Promise.all(promises);
        } catch (err) {
            setApiError(getAPIErrorMessage(err));
        } finally {
            setApiLoading(false);
        }
    };

    const appendResults = useCallback((results) => {
        setMessages((prevData) => {
            const newData = [...prevData];
            newData.push({ type: 'ai', messages: results.map((result) => result.response?.output?.content || result.response?.output?.final_response || result.response) });
            return newData;
        });
    }, []);

    const handleModelChange = useCallback((modelName: string) => {
        setModel(modelName);
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

    const collectAllData = () => {
        return JSON.stringify({
            messages: messages,
            model: model
        })
    }

    return (
        <ErrorBoundary>
            {isInitializing ? (
                <GridInitializing />
            ) : (
                <>
                    <SavePromptsBtn getData={collectAllData} projectId={projectId} userId={userId} />

                    <div className="flex items-center mx-auto parent-scrollbar-top">
                        <div className="child-scrollbar-top whitespace-nowrap mt-3">

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
                                showKeyModal={showKeyModal}
                                setShowKeyModal={setShowKeyModal}
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
                    <APIStatus error={apiError} loading={apiLoading} />
                    <APIKeyModal open={showKeyModal} onClose={() => setShowKeyModal(false)} />
                </>
            )}
        </ErrorBoundary>
    );
};

export default Grid;
