"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useState } from "react";

import { toast } from 'react-hot-toast';

export default function SavePromptsBtn(props: {
    getData: Function,
    projectId: number,
    userId: string
}) {
    const client = createSupabaseBrowserClient();
    const [saving, setSaving] = useState(false);

    async function savePrompts() {
        setSaving(true);
        try {
            const data = props.getData();
            if (props.projectId > 0) {
                await client
                    .from('projects')
                    .update({ data })
                    .match({ 'id': props.projectId });
                toast.success('Prompts saved!');
            } else {
                const { data: project, error } = await client
                    .from('projects')
                    .insert({ 
                        data,
                        name: 'Untitled Project',
                        user_id: props.userId
                    })
                    .select('*')
                    .single();

                console.log(project, error);
                if (error) {
                    console.error(error);
                    toast.error('Failed to save prompts');
                } else {
                    window.location.href = `/app/project/${project.id}`;
                    toast.success(`Prompts saved! You should be redirected to /app/project/${project.id}`);
                }
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to save prompts');
        } finally {
            setSaving(false);
        }
    }

    return (
        <button className="btn btn-primary btn-sm" disabled={saving} onClick={savePrompts}>
            <FontAwesomeIcon icon={faFloppyDisk} /> Save Prompts
        </button>
    );
}