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
            <GridWithValidators paid={true || plan?.type?.startsWith('Pro')} />
        </div>
    );
}