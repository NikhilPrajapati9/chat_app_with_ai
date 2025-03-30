import { asyncHandler } from "../utils/asyncHandler.js";
import userModel from "../models/user.model.js"
import { validationResult } from "express-validator";
import * as userService from "../services/user.service.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import redisClient from "../services/redis.service.js";



export const createUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "validation error", errors.array()));
    }

    const user = await userService.createUser(req.body);

    const token = await user.generateJWT();

    delete user._doc.password


    res.status(201).json(new ApiResponse(201, { user, token }))
})

export const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "validation error", errors.array()));
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json(new ApiResponse(401, "", "User not found"));
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
        return res.status(401).json(new ApiResponse(401, "", "Password does't match"))
    }

    const token = await user.generateJWT();

    delete user._doc.password

    res.status(200).json(new ApiResponse(200, { user, token }))
})

export const getProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(200, { user: req.user })
})

export const logout = asyncHandler(async (req, res) => {
    const token =
        req.cookies?.token || req.headers?.authorization.split(' ')[1];

    redisClient.set(token, "logout", "EX", 60 * 60 * 24);

    res.status(200).json(new ApiResponse(200, "", "Logged out successfully"))
})


export const getAllUsers = asyncHandler(async (req, res) => {

    const loggedInUser = await userModel.findOne({ email: req.user.email });

    const users = await userService.getAllUsers({ userId: loggedInUser._id });

    return res.status(200).json(new ApiResponse(200, users));
})