import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import { getUserPlan } from "@/utils/supabase/admin";
import Link from "next/link";
import PortalButton from "../PortalButton/PortalButton";

interface CoolColorfulTextProps {
    status: string;
}

function CoolColorfulText({ status }: CoolColorfulTextProps) {
    if (status === 'active') {
        return (
            <div className={`badge bg-emerald-100 text-emerald-600`}>&bull; {status}</div>
        )
    } else {
        return (
            <div className={`badge bg-indigo-100 text-indigo-600`}>{status}</div>
        )
    }
}

export default async function ProfileDropdownServer() {
    const {
        data: { session },
    } = await createSupabaseServerComponentClient().auth.getSession();

    const plan = await getUserPlan({ uuid: session?.user?.id || '' });
    console.log(plan);
    return (
        <div>
            <div className="card border text-primary-content w-96">
                <div className="card-body">
                    <h2 className="card-title">{plan?.type} Plan &#x1F4CC;</h2>
                    <div>
                        Plan status: <CoolColorfulText status={plan?.status || ''} />
                    </div>
                    <div className="card-actions justify-end">
                        <PortalButton />
                    </div>
                </div>
            </div>
        </div>
    )
}