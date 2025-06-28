import Link from "next/link"
import { models } from "../../../lib/llm-models";

export default function ModelSelectModel(props: {
    handleModelChange: Function,
    model: string,
}) {
    return (
        <>
            <button className="btn" onClick={() => (document.getElementById('my_modal_2') as any)?.showModal()}>
                Model: {props.model} ⚙️
            </button>
            <dialog id="my_modal_2" className="modal w-full">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="text-lg py-2 font-bold">Models</h3>
                    <div className="flex flex-wrap gap-2">
                        {models.map((model, idx) => {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => { props.handleModelChange(model.name); (document.getElementById('my_modal_2') as any)?.close() }}>
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
                    <Link href={"/docs/ab-test-custom-langserve"} className="underline text-blue-400" target="_blank">Model Documentation 📚</Link>
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