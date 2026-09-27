import { getOrganizationDatabase } from "./databaseService.js";


const getDatabaseSchema = async (organizationId) => {

    const db =
        getOrganizationDatabase(organizationId);

    const collections =
        await db.db.listCollections().toArray();

    const schema = {};


    for (const collection of collections) {

        const collectionName =
            collection.name;


        const mongoCollection =
            db.db.collection(
                collectionName
            );


        // Get one document to determine
        // the available fields
        const sampleDocument =
            await mongoCollection.findOne();


        if (!sampleDocument) {

            schema[collectionName] = [];

            continue;
        }


        const fields =
            Object.keys(sampleDocument);


        schema[collectionName] =
            fields.map(field => {

                const value =
                    sampleDocument[field];


                let type =
                    typeof value;


                if (value === null) {
                    type = "null";
                }


                if (Array.isArray(value)) {
                    type = "array";
                }


                if (
                    value &&
                    typeof value === "object" &&
                    !Array.isArray(value)
                ) {
                    type = "object";
                }


                return {
                    field,
                    type
                };

            });

    }


    return schema;
};


export default getDatabaseSchema;