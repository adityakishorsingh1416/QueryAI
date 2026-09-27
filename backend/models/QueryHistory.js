import mongoose from "mongoose";

const queryHistorySchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        },

        question: {
            type: String,
            required: true
        },

        query: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const QueryHistory = mongoose.model(
    "QueryHistory",
    queryHistorySchema
);

export default QueryHistory;