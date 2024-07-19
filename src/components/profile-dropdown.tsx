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
        <div className="dropdown dropdown-end">
            <summary tabIndex={0} role="button" className="btn m-1">
                <Avatar />
                {user?.user_metadata?.full_name}
            </summary>
            <ul tabIndex={0} className="dropdown-content text-xl menu border bg-base-100 rounded-box z-[1] min-w-52 p-2">
                <li><Link href="/profile">Profile</Link></li>
                <li><Link href="/app">App</Link></li>
                <li></li>
                <li><LogoutButton /></li>
                <li><Link href="/pricing">Pricing</Link></li>
            </ul>
        </div>
    );
}