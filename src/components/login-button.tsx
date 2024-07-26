"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import Image from "next/image";

export default function LoginButton(props: { nextUrl?: string, google?: boolean }) {
  const supabase = createSupabaseBrowserClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${props.nextUrl || ""
          }`,
      },
    });
  };

  if (!props.google) {
    return <button onClick={handleLogin} className="btn">Login</button>;
  } else {
    return (
      <button onClick={handleLogin} className="p-6 text-black flex flex-row w-full mx-auto border border-bg-slate-400 rounded-lg justify-center items-center py-2 space-x-4 mb-2 hover:bg-gray-100 duration-200">
        <Image src="/images/google.webp" alt="Google" width={24} height={24} />
        <div>Sign in with Google</div>
      </button>
    );
  }
}
