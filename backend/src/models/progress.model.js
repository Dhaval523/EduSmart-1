import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modules",
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

progressSchema.index({ user: 1, module: 1 }, { unique: true });
progressSchema.index({ user: 1, course: 1 });

export const Progress = mongoose.model("Progress", progressSchema);
