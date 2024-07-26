import Title from "@/components/common/title";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import { getUserPlan } from "@/utils/supabase/admin";
import PaidAppPage from "./paid";
import UnpaidAppPage from "./unpaid";

export default async function AppPage() {
    const {
        data: { user },
        error,
    } = await createSupabaseServerComponentClient().auth.getUser();

    const plan = await getUserPlan({ uuid: user?.id || '' });

    return (
        <>
            <Title title={"Welcome, " + user?.user_metadata?.name} />
            {plan?.type?.startsWith('Pro') ? <PaidAppPage /> : <UnpaidAppPage />}
        </>
    );
}