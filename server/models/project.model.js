import mongoose, { Schema } from "mongoose";


const projectSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: [true, "Project name must be unique  "]
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],

})


const Project = mongoose.model("project", projectSchema);

export default Project