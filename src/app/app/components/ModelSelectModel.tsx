import Link from "next/link"

const baseUrl = 'http://0.0.0.0:8000'

export default function ModelSelectModel(props: {
    handleModelChange: Function,
    model: string,
    paid: boolean
}) {
    const freeModels = [
        {
            company: 'OpenAI',
            color: 'green',
            name: 'gpt-4o-mini',
            langserve: baseUrl + '/gpt-4o-mini/invoke'
        }
    ]

    const paidModels = [
        ...['gpt-4o', 'gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'].map((name) => {
            return {
                company: 'OpenAI',
                color: 'green',
                name: name,
                langserve: baseUrl + '/' + name + '/invoke'
            }
        }),
        ...['claude-3-5-sonnet-20240620', 'claude-3-opus-20240229'].map((name) => {
            return {
                company: 'Anthropic',
                color: 'orange',
                name: name,
                langserve: baseUrl + '/' + name + '/invoke'
            }
        }),
        ...['llama-3.1-70b-versatile', 'mixtral-8x7b-32768'].map((name) => {
            return {
                company: 'Groq',
                color: 'purple',
                name: name,
                langserve: baseUrl + '/' + name + '/invoke'
            }
        })
    ]

    return (
        <>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn" onClick={() => document.getElementById('my_modal_2').showModal()}>
                Model: {props.model} ⚙️
            </button>
            <dialog id="my_modal_2" className="modal w-full">
                <div className="modal-box">
                    <h3 className="text-lg py-2 font-bold">Free</h3>
                    <div className="flex flex-wrap gap-2">
                        {freeModels.map((model, idx) => {
                            return (
                                <button 
                                    key={idx}
                                    onClick={() => { props.handleModelChange(model.name, model.langserve); document.getElementById('my_modal_2').close() }}>
                                    <div className="border rounded-xl shadow-sm font-normal p-2 flex gap-x-2 w-fit hover:bg-base-200">
                                        <div>
                                            {model.name}
                                        </div>
                                        <div className={"badge bg-" + model.color + "-300"}>{model.company}</div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                    <h3 className="text-lg py-2 font-bold">With Pro</h3>
                    <div className="flex flex-wrap gap-2">
                        {paidModels.map((model, idx) => {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (props.paid) {
                                            props.handleModelChange(model.name, model.langserve);
                                            document.getElementById('my_modal_2').close()
                                        } else {
                                            window.open('/pricing', '_blank');
                                        }
                                    }}>
                                    <div className="border rounded-xl shadow-sm font-normal p-2 flex gap-x-2 w-fit hover:bg-base-200">
                                        <div>
                                            {model.name}
                                        </div>
                                        <div className={"badge bg-" + model.color + "-300"}>{model.company}</div>
                                    </div>
                                </button>
                            )
                        })}

                        <button onClick={() => {
                            if (props.paid) {
                                let url = prompt('Enter your LangServe URL (i.e. http://localhost:8000/chat/invoke). ONLY /invoke is supported.');
                                if (url) {
                                    props.handleModelChange('Custom LangServe 🦜', url);
                                    document.getElementById('my_modal_2').close();
                                }
                            } else {
                                window.open('/pricing', '_blank');
                            }
                        }}>
                            <div className="border rounded-xl shadow-sm font-normal p-2 flex gap-x-2 w-fit hover:bg-base-200">
                                <div>
                                    Custom LangServe URL 🦜
                                </div>
                            </div>
                        </button>
                    </div>
                    <Link href={"/docs/integrate-custom-langserve"} className="underline text-blue-400" target="_blank">Custom LangServe Docs 📚</Link>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}