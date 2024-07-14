import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import ProfileDropdown from "./profile-dropdown";


export default async function ProfileDropdownServer() {
    const {
        data: { session },
        error,
    } = await createSupabaseServerComponentClient().auth.getSession();

    return <ProfileDropdown session={session} />;
}