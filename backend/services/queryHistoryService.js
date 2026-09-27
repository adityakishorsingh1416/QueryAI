import QueryHistory from "../models/QueryHistory.js";


const saveQueryHistory = async (
    organizationId,
    question,
    query
) => {

    await QueryHistory.create({
        organizationId,
        question,
        query
    });

};


const getQueryHistory = async (
    organizationId
) => {

    const history =
        await QueryHistory
            .find({
                organizationId
            })
            .sort({
                createdAt: -1
            })
            .limit(10);

    return history;

};


export {
    saveQueryHistory,
    getQueryHistory
};