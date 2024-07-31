
export default function SimpleModal(props: {children: any, modalId: string}) {
    return (
        <>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id={props.modalId} className="modal w-full">
                <div className="modal-box max-w-[95%] w-1/3 min-w-96">
                    {props.children}
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop w-full">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}