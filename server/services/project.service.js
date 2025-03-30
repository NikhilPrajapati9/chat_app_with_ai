import mongoose from "mongoose";
import projectModel from "../models/project.model.js"
import { ApiError } from "../utils/ApiError.js"



export const createProject = async ({
    name, userId
}) => {
    if (!name) throw new ApiError(401, "Name is required");
    if (!userId) throw new ApiError(401, "UserId is required");

    const project = await projectModel.create({
        name,
        users: [userId]
    })

    return project;
}


export const getAllProjectByUserId = async (userId) => {
    if (!userId) {
        throw new ApiError(401, "User id is required");
    }

    const allUserProject = await projectModel.find({ users: userId });


    return allUserProject
}


export const addUsersToProjects = async ({ projectId, users, userId }) => {

    if (!projectId) throw new Error("ProjectId is required")
    if (!mongoose.Types.ObjectId.isValid(projectId)) throw new Error("Invalid ProjectId")

    if (!users) throw new Error("Users are required")
    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) throw new Error("Invalid userId in users array");

    if (!userId) throw new Error("UserId is required");
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");




    try {
        const project = await projectModel.findOne({
            _id: projectId,
            users: userId
        })

        if (!project) throw new Error("User not belong to this project");

        const updatedProject = await projectModel.findOneAndUpdate({
            _id: projectId
        }, {
            $addToSet: {
                users: {
                    $each: users
                }
            }
        }, {
            new: true
        });

        return updatedProject;
    } catch (error) {
        throw new Error(error)
    }
}

export const getProjectById = async (projectId) => {
    try {
        if (!projectId) throw new Error("ProjectId is required")
        if (!mongoose.Types.ObjectId.isValid(projectId)) throw new Error("Invalid ProjectId")

        const project = await projectModel.findById(projectId).populate('users');

        return project
    } catch (error) {
        throw new Error(error)
    }
}