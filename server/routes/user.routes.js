import { Router } from "express";
import * as userController from "../controllers/user.controller.js"
import { body } from "express-validator";
import * as authMiddleware from "../middleware/auth.middleware.js"

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage("Email must be a valid email address"),
    body('password').isLength({ min: 6 }).withMessage('Password must be a least 6 characters long')
    , userController.createUser)

router.post('/login',
    body('email').isEmail().withMessage("Email must be a valid email address"),
    body('password').isLength({ min: 6 }).withMessage('Password must be a least 6 characters long')
    , userController.login)

router.get("/profile", authMiddleware.authUser, userController.getProfile)
router.get("/logout", userController.logout)

router.get("/all", authMiddleware.authUser, userController.getAllUsers)


export default router