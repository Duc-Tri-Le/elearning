import { Router } from "express";
import { UserGoalController } from "../controllers/user.goal.controller";
import  Authentication  from "../middleware/authentication"

export const UserGoalRoute = Router();

UserGoalRoute.get(
    "/",
    Authentication.AuthenticateToken,
    UserGoalController.getAll
);

UserGoalRoute.post(
    "/create",
    Authentication.AuthenticateToken,
    UserGoalController.create
);

UserGoalRoute.delete(
    "/delete/:id",
    Authentication.AuthenticateToken,
    UserGoalController.delete
);
