const mongoose = require("mongoose");

const sportSessionSchema = new mongoose.Schema(
    {
        sport: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sport",
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        teamA: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        teamB: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        additionalPlayersNeeded: {
            type: Number,
            required: true,
            min: 0
        },

        dateTime: {
            type: Date,
            required: true
        },

        venue: {
            type: String,
            required: true,
            trim: true
        },

        joinedPlayers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        status: {
            type: String,
            enum: ["active", "cancelled", "completed"],
            default: "active"
        },

        cancellationReason: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("SportSession", sportSessionSchema);