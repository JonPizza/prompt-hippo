async function getColumn(data, colIdx) {
    let messages = [];
    for (let i = 0; i < data.length; i++) {
        messages.push({
            type: data[i].type,
            content: data[i].messages[colIdx]
        })
    }
    return messages;
}

export async function runAllColumns(langServeUrl, data) {
    return data[0].messages.map(async (_, columnIdx) => {
        return new Promise(async (resolve, reject) => {
            let column = await getColumn(data, columnIdx)
            const startTime = Date.now();

            try {
                const response = await fetch(langServeUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input: { messages: column } })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const timeToComplete = (Date.now() - startTime) / 1000;

                resolve([columnIdx, result, timeToComplete]);
            } catch (error) {
                console.error(`Error in column ${columnIdx}:`, error);
                reject([columnIdx, 'Error occurred!!', (Date.now() - startTime) / 1000]);
            }
        });
    });
}