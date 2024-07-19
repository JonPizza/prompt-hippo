import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";
import ProfileDropdownServer from "./profile-server";
import Link from "next/link";

export default async function NavBar() {
  const {
    data: { session },
    error,
  } = await createSupabaseServerComponentClient().auth.getSession();

  const user = session?.user;

  return (
    <div className="w-full bg-base-100" style={{zIndex: 999}}>
      <div className="max-w-screen-xl mx-auto navbar">
        <div className="navbar-start">
          <Link className="btn btn-ghost text-xl" href={"/"}>JonPizza</Link>
        </div>
        <div className="navbar-end">
          {user ? (
            <>
              <ProfileDropdownServer />
            </>
          ) : (
            <>
              <LoginButton />
              <button className="ml-4 btn btn-secondary">Register</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
