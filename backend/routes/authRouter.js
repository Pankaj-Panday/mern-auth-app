import { Router } from "express";
import { login, signup } from "../controllers/authController.js";
import validate from "../middlewares/validationMiddleware.js";
import { signupSchema, loginSchema } from "../schema/authSchema.js";

const router = Router();

router.post("/signup", validate(signupSchema, "body"), signup);

router.post("/login", validate(loginSchema, "body"), login);

export default router;
