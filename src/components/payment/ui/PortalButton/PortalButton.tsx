import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import { getUserPlan } from "@/utils/supabase/admin";

import PortalButtonClient from "./PortalButtonClient";

export default async function PortalButton() {
    const {
        data: { session },
    } = await createSupabaseServerComponentClient().auth.getSession();

    const plan = await getUserPlan({ uuid: session?.user?.id || '' });

    return (
        <PortalButtonClient />
    )
}