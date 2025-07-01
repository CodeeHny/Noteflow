import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    archived: {
        type: Boolean,
        default:false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    collaborators: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            role:{
                type: String,
                enum: ['viewer', 'editor'],
                default: 'viewer'
            },
        },
    ]
}, { timestamps: true });

export const Notes = mongoose.model('notes', notesSchema) ;