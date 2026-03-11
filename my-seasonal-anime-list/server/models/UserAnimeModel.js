import { Schema } from "mongoose";

const userAnimeSchema = new Schema({
    title: {type: String, required: true},
    watched: {type: Boolean, required: true},
    currentEp: {type: Number, required: true},
    status: {type: String, enum: ["Watching", "Completed", "Dropped"], required: true},
    rating: {type: Number, required: true},
    op: {type: Boolean, required: true},
    ed: {type: Boolean, required: true}
});

export default userAnimeSchema;