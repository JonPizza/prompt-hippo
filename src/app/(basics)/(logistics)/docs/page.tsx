import Link from "next/link";
import postData from "./PostData";
import type { Metadata } from "next";


export async function generateMetadata({
    params,
}): Promise<Metadata> {
    return {
      title: 'Blog & Documentation - PromptHippo',
      description: 'Learn about various topics related to LLMs, how PromptHippo works, and more!',
    };
}

export default async function Page() {
    return (
        <div className="text-lg prose">
            <h1 className="text-4xl font-bold">Prompt Hippo Blog + Documentation</h1>
            <marquee>
                Welcome to the PromptHippo blog! 
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