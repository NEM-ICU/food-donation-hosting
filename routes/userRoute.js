import * as user from "../controllers/userController.js";
import { Router } from "express";
import { protect } from "../middlewares/protect.js";

const router = Router();

//register user route
router.post("/register", user.createUser);

//login user route
router.post("/login", user.loginUser);

//update user route
router.put("/:id", protect, user.updateUser);

//update user password user route
router.put("/updatepassword/:id", protect, user.updateUserPassword);

//get a user route
router.get("/get-user", user.getUser);

//delete user route
router.delete("/delete/:id", protect, user.deleteUser);

export default router;
