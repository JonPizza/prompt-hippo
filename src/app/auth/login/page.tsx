import Title from "@/components/common/title";
import LoginButton from "@/components/login-button";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Title title="Login or Register" />

      <div className="card bg-base-100">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Click to authenticate with Google:</h2>
          <div className="card-actions">
            <LoginButton google={true} />
          </div>
        </div>
      </div>
    </>
  );
}
