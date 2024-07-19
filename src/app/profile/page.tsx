import Avatar from "@/components/avatar";
import Divider from "@/components/common/divider";
import PlanDetails from "@/components/payment/ui/PlanDetails/PlanDetails";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import { getUserPlan } from "@/utils/supabase/admin";
import { use } from "react";

export default async function ProfilePage() {
    const {
        data: { user },
        error,
    } = await createSupabaseServerComponentClient().auth.getUser();

    return (
        <>
            <h1 className="text-4xl">
                Profile
            </h1>
            <h1 className="text-xl break-words">
                {user?.user_metadata?.name} &bull; {user?.user_metadata?.email}
            </h1>
            <Divider />
            <PlanDetails />
        </>
    );
}