import Link from "next/link";
import fs from 'fs';
import Markdown from 'markdown-to-jsx';
import { Metadata } from 'next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import postData from "../PostData";


export async function generateMetadata({
    params,
}): Promise<Metadata> {
    return {
      title: (postData[params.postName]?.title || 'Not found') + ' - Prompt Hippo',
      description: postData[params.postName]?.desc || 'Not found',
    };
  }

function getPost(slug: string) {
    if (slug.includes('..') || slug.includes('/')) {
        return "# 404 Not Found\n\nSorry!";
    }
    const folder = process.cwd() + '/docs/'; 
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
        <div className="text-lg prose prose-slate dark:prose-invert prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none">
            <Markdown
                options={{
                    overrides: {
                        code: {
                            component: ({ className, children, ...props }) => {
                                // Check if this is a multi-line code block (className will be like "lang-javascript")
                                const match = /lang-(\w+)/.exec(className || '');
                                const language = match ? match[1] : '';
                                
                                // Also check if it's a block-level code element (has newlines or is in a pre tag)
                                const isCodeBlock = match || (typeof children === 'string' && children.includes('\n'));
                                
                                if (isCodeBlock && language) {
                                    // The react-syntax-highlighter renders its own <pre> and <code> by default,
                                    // but here PreTag="div" is used, so the outer padding is likely coming from
                                    // the default .prose pre styling (from Tailwind Typography plugin).
                                    // However, prose-pre:p-0 removes padding from <pre>, but not from <div>.
                                    // So, the SyntaxHighlighter's <div> still gets default margin/padding from prose.
                                    // To fix, add prose-div:p-0 to your container className, or set margin/padding to 0 here.
                                    return (
                                        <SyntaxHighlighter
                                            style={oneDark}
                                            language={language}
                                            PreTag="div"
                                            customStyle={{
                                                borderRadius: '0.375rem',
                                                margin: 0,
                                                padding: '1rem', // Remove extra padding
                                            }}
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    );
                                } else {
                                    return (
                                        <code className={`${className} bg-gray-100 dark:bg-gray-800 rounded text-sm`} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            },
                        },
                    },
                }}
            >
                {postContent}
            </Markdown>
            <hr></hr>
            <Link href="/docs">Back to Docs</Link> &sdot;&nbsp; 
            <Link href="/app">Prompt Tester</Link> &sdot;&nbsp; 
            <Link href="/">Home</Link>
        </div>
    );
}