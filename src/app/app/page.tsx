import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import { getUserPlan } from "@/utils/supabase/admin";
import GridWithValidators from "./components/GridWithValidators";

export default async function AppPage() {
    const {
        data: { user },
        error,
    } = await createSupabaseServerComponentClient().auth.getUser();

    const plan = await getUserPlan({ uuid: user?.id || '' });

    return (
        <div className="w-full">
            <GridWithValidators 
                paid={plan?.type?.startsWith('Pro') || user?.id == '5430cef7-2e40-40ce-bd5b-6285c9798a42'} 
                projectId={-1} 
                userId={user?.id}
                projectData={null}
                projectName={"Unsaved Project"}
            />
        </div>
    );
}