import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const authUser = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token || req.headers?.authorization.split(' ')[1];


        if (!token) {
            return res.status(401).json(new ApiResponse(401, "", "Unauthorized user"));
        }

        const isBlackListed = await redisClient.get(token)

        if (isBlackListed) {
            res.cookie('token', '')
            return res.status(401).json(new ApiResponse(401, "", "Unauthorized user"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        next()
    } catch (error) {
        throw new Error(error?.message || "Invalid access Token");
    }

}