import express from "express"
import generateToken from "../utils/generateToken.js";
import auth from "../middlewares/auth.js";
import { getUserStats, login, register, verifyToken } from "../controllers/UserController.js";
import { createGoal, deleteGoal, getGoalById, getGoals, getMonthlyStats, updateGoal, toggleGoalWithoutSteps } from "../controllers/GoalController.js";
import { createStep, deleteStep, stepStatus, updateStep } from "../controllers/StepContoller.js";

const router = express.Router();

router.get("/", (req, res) => {
    const token = generateToken({ email: "alper@gmail.com", password: "alper123" });
    return res.send(token);
})

router.post("/protected", auth, (req, res) => {
    return res.send("token");
})

router.post("/register", register)
router.post("/login", login)

router.post("/verify-token", auth, verifyToken)

router.post("/goals/stats", auth, getUserStats)

// Goal Operations

router.post('/goal/create', auth, createGoal);

// Users all goals
router.post('/goals', auth, getGoals);

router.post('/goal/:id', auth, getGoalById);

router.put('/goal/:id', auth, updateGoal);

router.delete('/goal/:id', auth, deleteGoal);

router.post("/goals/monthly-stats", auth, getMonthlyStats)

router.put('/complete-goal', auth, toggleGoalWithoutSteps);

router.post("/step", auth, createStep)

router.put('/step', auth, updateStep);

router.post('/step/delete', auth, deleteStep);

router.put('/step-status', auth, stepStatus)

export default router;