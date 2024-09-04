import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    startDate: {
        type: Date
    },
    targetDate: {
        type: Date,
    },
    steps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Step'
    }],
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Goal", GoalSchema);