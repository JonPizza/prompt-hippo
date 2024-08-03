import Divider from "@/components/common/divider";
import PlanDetails from "@/components/payment/ui/PlanDetails/PlanDetails";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import Link from "next/link";

export default async function ProfilePage() {
    const client = createSupabaseServerComponentClient();
    const {
        data: { user },
        error,
    } = await client.auth.getUser();

    const { data: projects, error: projectsError } = await client
        .from('projects')
        .select('*')
        .eq('user_id', user?.id);

    if (error || projectsError) {
        return <div>Failed to load user profile</div>;
    }

    return (
        <>
            <h1 className="text-4xl">
                Profile
            </h1>
            <h1 className="text-xl break-words">
                {user?.user_metadata?.name} &bull; {user?.user_metadata?.email}
            </h1>
            <Divider />
            {projects.map((project, idx) => (
                <div key={idx} className="m-2 float-left">
                    <div className="card border text-primary-content w-96">
                        <div className="card-body">
                            <h2 className="card-title">{project.name}</h2>
                            <div className="card-actions justify-end">
                                <Link href={`/app/project/${project.id}`} className="btn btn-accent">Open Project</Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {projects.length > 0 ? (<br className="clear-both"></br>) : (<></>)}
            <Link href={"/app"} className="btn btn-secondary m-2">
                Create New Project
            </Link>
            <Divider />
            <PlanDetails />
            <Divider />
            <div className="prose m-8">
                <h3 className="mb-0">Quick Links</h3>
                <div>
                    &bull; <Link href={"/app"}>To Prompt Hippo 🦛</Link>
                </div>
                <div>
                    &bull; <Link href={"/docs"}>Documentation + Blog</Link>
                </div>
                <div>
                    &bull; <Link href={"/pricing"}>Pricing</Link>
                </div>
            </div>
        </>
    );
}