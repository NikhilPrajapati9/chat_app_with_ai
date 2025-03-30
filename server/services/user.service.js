import userModel from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"



export const createUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new ApiError(401, "Email or Password is required")
    }

    const user = await userModel.findOne({ email });
    if (user) {
        throw new ApiError(401, "User is already register with this email")
    } else {

        const hashPassword = await userModel.hashPassword(password)

        const newUser = await userModel.create({
            email,
            password: hashPassword
        })

        return newUser
    }


}

export const getAllUsers = async ({ userId }) => {
    try {
        const allUsers = await userModel.find({
            _id: { $ne: userId }
        });
        return allUsers
    } catch (error) {
        throw new Error(error)
    }
}
