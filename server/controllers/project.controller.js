import projectModel from "../models/project.model.js"
import * as projectService from "../services/project.service.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import userModel from "../models/user.model.js"
import { validationResult } from "express-validator"
import { ApiResponse } from "../utils/ApiResponse.js"




export const createProject = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "validation error", errors.array()));
    }

    const { name } = req.body;
    const { email } = req.user

    const loggedInUser = await userModel.findOne({ email })
    const userId = loggedInUser._id;


    const newProject = await projectService.createProject({ name, userId });

    return res.status(201).json(new ApiResponse(201, newProject));

})

export const getAllProject = asyncHandler(async (req, res) => {

    const loggedInUser = await userModel.findOne({ email: req.user.email });

    const allUserProject = await projectService.getAllProjectByUserId(loggedInUser._id);


    return res.status(200).json(new ApiResponse(200, allUserProject));
})

export const addUsersToProject = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "validation error", errors.array()));
    }

    const { projectId, users } = req.body

    const loggedInUser = await userModel.findOne({ email: req.user.email });

    const project = await projectService.addUsersToProjects({ projectId, users, userId: loggedInUser._id });


    res.status(200).json(new ApiResponse(200, project));

})

export const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await projectService.getProjectById(projectId);

    return res.status(200).json(new ApiResponse(200, project));
})