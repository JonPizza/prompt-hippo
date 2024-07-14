import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import Image from "next/image";

export default async function Avatar() {
  const {
    data: { user },
    error,
  } = await createSupabaseServerComponentClient().auth.getUser();

  return (
    <div className="relative w-8 h-8">
      <Image
        src={user?.user_metadata.avatar_url}
        alt="profile image"
        fill={true}
        className="rounded-full"
      />
    </div>
  );
}
