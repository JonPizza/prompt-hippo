import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import GridWithValidators from "./components/GridWithValidators";

export default async function AppPage() {
    const {
        data: { user },
        error,
    } = await createSupabaseServerComponentClient().auth.getUser();

    return (
        <div className="w-full">
            <GridWithValidators 
                projectId={-1} 
                userId={user?.id}
                projectData={null}
                projectName={"Unsaved Project"}
            />
        </div>
    );
}