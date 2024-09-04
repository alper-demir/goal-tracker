import User from "../models/User.js";
import Goal from "../models/Goal.js";
import Step from "../models/Step.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    const { email, password, username } = req.body;
    try {

        const user = await User.find({ email });
        const usernameExists = await User.find({ username });
        if (user.length > 0) return res.status(401).json({ message: 'Email alread used.' });
        if (usernameExists.length > 0) return res.status(401).json({ message: 'Username alread used.' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const registerUser = await User.create({ email, password: hashedPassword, username });
        if (registerUser) {
            return res.json({ message: "User created", registerUser }).status(201);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Register failed.', error });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log(user);

        const compare = await bcrypt.compare(password, user.password);
        if (compare && user) {
            const token = generateToken({ id: user._id, username: user.username });
            console.log(token);

            return res.json({ user, token, message: "Logged in" });
        }
        return res.status(401).json({ message: 'Login error.' });
    } catch (err) {
        return res.status(500).json({ message: 'Login failed.' });
    }
};

export const verifyToken = async (req, res) => {
    return res.json({ message: "Token is valid", verifyToken: true });
}

export const getUserStats = async (req, res) => {
    try {
        const { userId } = req.body;

        // Kullanıcının tüm hedeflerini al ve adımları popule et
        const goals = await Goal.find({ userId }).populate('steps');
        const totalGoals = goals.length;

        // Tamamlanmış hedefleri kontrol et (completed: true)
        const completedGoals = goals.filter(goal => goal.completed === true).length;

        // Kullanıcının tüm adımlarını al
        const steps = goals.flatMap(goal => goal.steps);
        const totalSteps = steps.length;
        const completedSteps = steps.filter(step => step.completed).length;

        // Aktif hedefleri kontrol et (completed: false)
        const activeGoals = goals.filter(goal => goal.completed === false).length;

        // Tamamlanmamış adımları kontrol et
        const activeSteps = steps.filter(step => !step.completed).length;

        return res.json({
            totalGoals,
            completedGoals,
            totalSteps,
            completedSteps,
            activeGoals,
            activeSteps
        });
    } catch (err) {
        res.status(500).json({ message: 'User stat error.', error: err.message });
    }
}