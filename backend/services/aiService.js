import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();



const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});


const generateQuery = async (userQuestion, schema) => {

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

JSON FORMAT:

{
    "collection": "collection_name",
    "operation": "find",
    "filter": {},
    "projection": {},
    "sort": {},
    "limit": 100
}
`;


    const response =
        await client.responses.create({
            model: "openai/gpt-4o-mini",
            input: prompt,
        });


    let output =
        response.output_text.trim();


    // Remove markdown code fences if the model
    // accidentally returns them
    output = output.replace(
        /^```json\s*/i,
        ""
    );

    output = output.replace(
        /^```\s*/i,
        ""
    );

    output = output.replace(
        /\s*```$/i,
        ""
    );


    let query;


    try {

        query = JSON.parse(output);

    } catch (error) {

        throw new Error(
            "AI returned an invalid MongoDB query"
        );

    }


    // Basic validation

    if (
        !query.collection ||
        query.operation !== "find"
    ) {
        throw new Error(
            "AI generated an invalid MongoDB query"
        );
    }


    // Always enforce a maximum limit

    query.limit =
        Math.min(
            Number(query.limit) || 100,
            100
        );


    return query;
};


export default generateQuery;