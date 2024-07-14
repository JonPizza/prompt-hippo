import Avatar from "@/components/avatar";
import Divider from "@/components/common/divider";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";

export default async function ProfilePage() {
    const {
        data: { user },
        error,
    } = await createSupabaseServerComponentClient().auth.getUser();

    return (
        <div className="max-w-screen-lg mx-auto">
            <h1 className="text-4xl font-bold">
                Profile
            </h1>
            <h1 className="text-2xl">
                {user?.user_metadata?.name} &sdot; {user?.user_metadata?.email}
            </h1>
            <Divider />
        </div>
    );
}