import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import { getUserPlan } from "@/utils/supabase/admin";
import Link from "next/link";

export default async function ProfileDropdownServer() {
    const {
        data: { session },
        error,
    } = await createSupabaseServerComponentClient().auth.getSession();

    const plan = await getUserPlan({ uuid: session?.user?.id || '' });
    console.log(plan);
    return (
        <div>
            <div className="card border text-primary-content w-96">
                <div className="card-body">
                    <h2 className="card-title">Free Plan &#x1F4CC;</h2>
                    <p>Plan status: {plan?.status}</p>
                    <div className="card-actions justify-end">
                        <Link href="pricing">
                            <button className="btn btn-secondary">Change Plan</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}