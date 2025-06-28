export const models = [
    {
        company: 'OpenAI',
        color: 'green',
        name: 'gpt-4o-mini',
    },
    ...['gpt-3.5-turbo', 'gpt-4o', 'gpt-4', 'gpt-4-turbo',
        'gpt-4.1',
        'gpt-4.1-mini',
        'gpt-4.1-nano',
        'gpt-4.5-preview',
        'o1',
        'o1-pro',
        'o3-pro',
        'o3',
        'o4-mini',
        'o3-mini',
    ].map((name) => {
        return {
            company: 'OpenAI',
            color: 'green',
            name: name,
        }
    }),
    {
        company: 'Anthropic',
        color: 'orange',
        name: 'claude-3-opus-20240229',
        max_tokens: 4096,
    },
    {
        company: 'Anthropic',
        color: 'orange',
        name: 'claude-3-5-sonnet-20240620',
        max_tokens: 8192, // 4096 without beta header
    },
    {
        company: 'Anthropic',
        color: 'orange',
        name: 'claude-opus-4-20250514',
        max_tokens: 32000,
    },
    {
        company: 'Anthropic',
        color: 'orange',
        name: 'claude-sonnet-4-20250514',
        max_tokens: 64000,
    },
    {
        company: 'Anthropic',
        color: 'orange',
        name: 'claude-3-7-sonnet-20250219',
        max_tokens: 64000, // 128000 with beta header
    },
    {
        company: 'Anthropic',
        color: 'orange',
        name: 'claude-3-5-haiku-20241022',
        max_tokens: 8192,
    },
    ...['deepseek-r1-distill-llama-70b', 'mistral-saba-24b', 'qwen-qwq-32b'].map((name) => {
        return {
            company: 'Groq',
            color: 'purple',
            name: name,
        }
    })
];