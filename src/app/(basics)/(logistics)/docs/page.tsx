import Link from "next/link";
import postData from "./PostData";

export default async function Page() {
    return (
        <div className="text-lg prose">
            <h1 className="text-4xl font-bold">Prompt Hippo Blog + Documentation</h1>
            <marquee>
                Welcome to my blog :) If you have any questions, always reach out to me.
            </marquee>
            {Object.keys(postData).map((slug) => (
                <div key={slug}>
                    <Link href={`/docs/${slug}`}><h2>{postData[slug].title}</h2></Link>
                    <p>{postData[slug].desc}</p>
                </div>
            ))}
        </div>
    );
}