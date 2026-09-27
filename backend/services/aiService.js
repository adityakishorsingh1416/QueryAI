import dotenv from "dotenv";

dotenv.config();

const generateQuery = async (userQuestion, schema) => {

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error(
            "OPENROUTER_API_KEY is missing"
        );
    }

    const prompt = `
You are a MongoDB query generator.

Your job is to convert the user's natural language request
into a MongoDB read query represented as JSON.

DATABASE SCHEMA:
${JSON.stringify(schema, null, 2)}

USER REQUEST:
${userQuestion}

RULES:

1. Return ONLY valid JSON.
2. Do not return markdown.
3. Do not return JavaScript code.
4. Only use collections and fields that exist in the provided schema.
5. Only generate read operations.
6. The only allowed operation is "find".
7. Never generate insert, update, delete, drop, create, or any other write operation.
8. Limit the result to a maximum of 100 documents.
9. Use an empty object {} for filter when no filtering is required.
10. Use projection only when the user asks for specific fields.
11. Use sort only when the user asks for sorting.
12. Do not invent collection names or fields.

Return exactly this JSON structure:

{
    "collection": "collection_name",
    "operation": "find",
    "filter": {},
    "projection": {},
    "sort": {},
    "limit": 100
}
`;

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",

            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://queryai-4q50.onrender.com",
                "X-Title": "QueryAI"
            },

            body: JSON.stringify({
                model: "openai/gpt-4o-mini",

                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        console.error(
            "OPENROUTER ERROR:",
            data
        );

        throw new Error(
            data?.error?.message ||
            "OpenRouter request failed"
        );
    }

    let output =
        data.choices[0].message.content.trim();

    output = output
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "");

    let query;

    try {

        query = JSON.parse(output);

    } catch (error) {

        console.error(
            "INVALID AI RESPONSE:",
            output
        );

        throw new Error(
            "AI returned an invalid MongoDB query"
        );
    }

    if (
        !query.collection ||
        query.operation !== "find"
    ) {
        throw new Error(
            "AI generated an invalid MongoDB query"
        );
    }

    query.limit = Math.min(
        Number(query.limit) || 100,
        100
    );

    return query;
};

export default generateQuery;