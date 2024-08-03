import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import SimpleModal from "./SimpleModal";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

import { useState } from "react";
import { toast } from 'react-hot-toast';

export default function ChangeNameButton(props: { name: string, projectId: number, setName: Function }) {
    const [name, setName] = useState(props.name);
    const client = createSupabaseBrowserClient();

    async function saveName() {
        try {
            const { data: project, error } = await client
                .from('projects')
                .update({
                    name: name
                })
                .eq(
                    'id', props.projectId
                );
            if (error) {
                console.error(error);
                toast.error('Failed to update :(');
            }
            props.setName(name);
        } catch (e) {
            console.error(e);
            toast.error('Failed to update :(');
        } finally {
            document.getElementById('change-name-modal').close();
        }
    }

    return (
        <>
            <button className="btn btn-circle btn-xs btn-secondary" onClick={
                () => { document.getElementById('change-name-modal').showModal() }
            }>
                <FontAwesomeIcon icon={faPencil} />
            </button>
            <SimpleModal modalId="change-name-modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Change Project Name</h5>
                    </div>
                    <div className="modal-body m-2">
                        <input type="text" className="input border" value={name} onChange={(e) => {
                            setName(e.target.value);
                        }} />
                    </div>
                    
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-primary" onClick={saveName}>Save</button>
                        </form>
                    </div>
                </div>
            </SimpleModal>
        </>
    );
}