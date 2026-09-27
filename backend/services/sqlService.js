import { getOrganizationDatabase } from "./databaseService.js";


const executeQuery = async (query, organizationId) => {

    const db =
        getOrganizationDatabase(organizationId);


    if (!query || typeof query !== "object") {
        throw new Error("Invalid MongoDB query");
    }


    const {
        collection,
        operation,
        filter = {},
        projection,
        sort,
        limit = 100
    } = query;


    // Collection is required
    if (!collection) {
        throw new Error("Collection name is required");
    }


    // Only allow read operations
    if (operation !== "find") {
        throw new Error(
            "Only read queries are allowed"
        );
    }


    // Prevent unlimited results
    const safeLimit =
        Math.min(Number(limit) || 100, 100);


    const mongoCollection =
        db.db.collection(collection);


    const cursor =
        mongoCollection.find(
            filter,
            {
                projection
            }
        );


    if (sort && typeof sort === "object") {
        cursor.sort(sort);
    }


    const results =
        await cursor
            .limit(safeLimit)
            .toArray();


    return results;
};


export default executeQuery;