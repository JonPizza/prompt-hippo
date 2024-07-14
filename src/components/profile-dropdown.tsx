import Avatar from "./avatar";
import { Session } from "@supabase/supabase-js";
import LogoutButton from "./logout-button";
import Link from "next/link";

export default function ProfileDropdown({
    session,
}: {
    session: Session | null;
}) {
    const user = session?.user;

    return (
        <ul className="menu menu-horizontal px-1">
            <li>
                <details>
                    <summary>
                        <Avatar />
                        {user?.user_metadata?.full_name}
                    </summary>
                    <ul className="p-2 w-full">
                        <li><Link href={"/profile"}>Profile</Link></li>
                        <li></li>
                        <li><LogoutButton /></li>
                        <li><Link href={"/manage-plan"}>Manage Plan</Link></li>
                    </ul>
                </details>
            </li>
        </ul>
    );
}