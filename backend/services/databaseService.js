import mongoose from "mongoose";

const organizationDatabases = new Map();


const connectOrganizationDatabase = async (
    organizationId,
    {
        uri,
        database
    }
) => {

    if (!uri) {
        throw new Error(
            "MongoDB connection URI is required"
        );
    }

    if (!database) {
        throw new Error(
            "MongoDB database name is required"
        );
    }


    const connection =
        await mongoose.createConnection(uri, {
            dbName: database
        }).asPromise();


    // Test MongoDB connection
    await connection.db.command({
        ping: 1
    });


    // Store connection for this organization
    organizationDatabases.set(
        organizationId,
        connection
    );


    return connection;
};


const getOrganizationDatabase = (organizationId) => {

    const connection =
        organizationDatabases.get(
            organizationId
        );


    if (!connection) {
        throw new Error(
            "Organization database not connected"
        );
    }


    return connection;
};


export {
    connectOrganizationDatabase,
    getOrganizationDatabase
};