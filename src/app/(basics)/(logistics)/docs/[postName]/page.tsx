import Link from "next/link";
import fs from 'fs';
import Markdown from 'markdown-to-jsx';
import { Metadata } from 'next';
import postData from "../PostData";

export async function generateMetadata({
    params,
}): Promise<Metadata> {
    return {
      title: postData[params.postName]?.title || 'Not found',
      description: postData[params.postName]?.desc || 'Not found',
    };
  }

function getPost(slug: string) {
    if (slug.includes('..') || slug.includes('/')) {
        return "# 404 Not Found\n\nSorry!";
    }
    const folder = 'docs/';
    const file = folder + slug + '.md';
    try {
        return fs.readFileSync(file, 'utf-8');
    } catch (e) {
        return "# 404 Not Found\n\nSorry!";
    }
}

export default async function Page(props) {
    const postName = props.params.postName;
    const postContent = getPost(postName);

    return (
        <div className="text-lg prose">
            <Markdown>
                {postContent}
            </Markdown>
            <hr></hr>
            <Link href="/docs">Back to Docs</Link> &sdot;&nbsp; 
            <Link href="/app">Prompt Tester</Link> &sdot;&nbsp; 
            <Link href="/">Home</Link>
        </div>
    );
}