import {
    connectOrganizationDatabase
} from "../services/databaseService.js";


const connectDatabase = async (req, res) => {

    try {

        const organizationId =
            req.session.organizationId;

        if (!organizationId) {
            return res.status(401).json({
                message: "Please login first"
            });
        }


        const {
            uri,
            database
        } = req.body;


        if (!uri || !database) {
            return res.status(400).json({
                message:
                    "MongoDB URI and database name are required"
            });
        }


        await connectOrganizationDatabase(
            organizationId,
            {
                uri,
                database
            }
        );


        res.json({
            message:
                "MongoDB database connected successfully"
        });


    } catch (error) {

        console.error(
            "DATABASE CONNECTION ERROR:",
            error
        );


        res.status(500).json({
            message: error.message
        });

    }

};


export default connectDatabase;