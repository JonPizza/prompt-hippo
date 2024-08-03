import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import { getUserPlan } from "@/utils/supabase/admin";
import GridWithValidators from "@/app/app/components/GridWithValidators";
import Link from "next/link";

export default async function AppPage(props) {
    const client = createSupabaseServerComponentClient();

    const {
        data: { user },
        error,
    } = await client.auth.getUser();

    const plan = await getUserPlan({ uuid: user?.id || '' });

    const { data: projects, error: projectsError } = await client
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .eq('id', parseInt(props.params.projectId));

    if (projectsError || projects.length == 0) {
        return (
            <div>
                Double check the url!
                <br></br>
                <Link href={'/profile'} className="link">To Profile</Link>    
            </div>
        );
    }

    return (
        <div className="w-full">
            <GridWithValidators
                paid={plan?.type?.startsWith('Pro')}
                projectId={parseInt(props.params.projectId)}
                userId={user?.id}
                projectData={projects[0].data}
                projectName={projects[0].name}
            />
        </div>
    );
}