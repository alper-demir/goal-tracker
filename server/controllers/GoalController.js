import Goal from '../models/Goal.js'
import Step from '../models/Step.js'
import { calculateElapsedTime, calculateProgress } from '../utils/goalUtils.js';

// Yeni bir hedef oluştur
export const createGoal = async (req, res) => {
    const { userId, title, description, startDate, targetDate, steps } = req.body;
    console.log(userId);

    try {

        const stepIds = await Promise.all(steps.map(async (step) => {
            const newStep = new Step({
                userId,
                description: step.description,
                title: step.title,
                priority: step.priority
            });
            await newStep.save();
            return newStep._id;
        }));

        const goal = new Goal({
            userId,
            title,
            description,
            startDate,
            targetDate,
            steps: stepIds
        });

        await goal.save();
        res.status(201).json({ message: 'Hedef başarıyla oluşturuldu.', goal });
    } catch (err) {
        res.status(500).json({ message: 'Hedef oluşturulamadı.', error: err.message });
    }
};

// Tüm hedefleri getir
export const getGoals = async (req, res) => {
    const { userId } = req.body;
    try {
        const goals = await Goal.find({ userId }).populate('steps');

        const goalsWithProgressAndElapsedTime = goals.map((goal) => {
            const progress = calculateProgress(goal).toFixed(2);
            const elapsedTime = calculateElapsedTime(goal).toFixed(2);

            return {
                ...goal.toObject(),
                progress,
                elapsedTime,
            };
        });

        res.json(goalsWithProgressAndElapsedTime);
    } catch (err) {
        res.status(500).json({ message: 'Hedefler getirilemedi.', error: err.message });
    }
};

// Belirli bir hedefi getir
export const getGoalById = async (req, res) => {
    const userId = req.params.id;
    try {
        const goal = await Goal.findById(userId).populate('steps');
        if (!goal) {
            return res.status(404).json({ message: 'Hedef bulunamadı.' });
        }
        const progress = calculateProgress(goal).toFixed(2);
        const elapsedTime = calculateElapsedTime(goal).toFixed(2);
        return res.json({
            ...goal.toObject(),
            progress,
            elapsedTime
        })
    } catch (err) {
        res.status(500).json({ message: 'Hedef getirilemedi.', error: err.message });
    }
};

// Hedefi güncelle
export const updateGoal = async (req, res) => {
    const { title, description, startDate, targetDate, steps, progress } = req.body;

    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: 'Hedef bulunamadı.' });
        }

        // Hedefin sahibi mi kontrol et
        if (goal.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Hedefi güncelleme yetkiniz yok.' });
        }

        goal.title = title || goal.title;
        goal.description = description || goal.description;
        goal.startDate = startDate || goal.startDate;
        goal.targetDate = targetDate || goal.targetDate;
        goal.steps = steps || goal.steps;
        goal.progress = progress || goal.progress;

        await goal.save();
        res.json({ message: 'Hedef başarıyla güncellendi.', goal });
    } catch (err) {
        res.status(500).json({ message: 'Hedef güncellenemedi.', error: err.message });
    }
};

// Hedefi sil
export const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: 'Hedef bulunamadı.' });
        }

        // Hedefin sahibi mi kontrol et
        if (goal.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Hedefi silme yetkiniz yok.' });
        }

        await goal.remove();
        res.json({ message: 'Hedef başarıyla silindi.' });
    } catch (err) {
        res.status(500).json({ message: 'Hedef silinemedi.', error: err.message });
    }
};

export const getMonthlyStats = async (req, res) => {
    const { userId } = req.body;

    try {
        const stats = [];
        const currentDate = new Date();

        for (let i = 5; i >= 0; i--) {
            const startDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() - i, 1));
            const endDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0, 23, 59, 59));

            const goals = await Goal.find({
                userId,
                createdAt: { $gte: startDate, $lte: endDate }
            }).populate('steps');

            const totalGoals = goals.length;
            const completedGoals = goals.filter(goal => goal.completed).length;
            const totalSteps = goals.reduce((acc, goal) => acc + goal.steps.length, 0);
            const completedSteps = goals.reduce((acc, goal) => acc + goal.steps.filter(step => step.completed).length, 0);

            stats.push({
                month: startDate.toLocaleString('default', { month: 'long' }),
                totalGoals,
                completedGoals,
                totalSteps,
                completedSteps
            });
        }

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Aylık istatistikler getirilemedi.', error: err.message });
    }
};

export const toggleGoalWithoutSteps = async (req, res) => {
    try {
        const { goalId } = req.body;
        console.log("goalId" + goalId);
        
        const goal = await Goal.findById(goalId);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Eğer adımlar yoksa tamamla ya da tamamlamayı iptal et
        if (goal.steps.length === 0 || goal.steps == null) {
            goal.completed = !goal.completed;

            await goal.save();

            return res.status(200).json({ message: `Goal marked as ${goal.completed ? 'completed' : 'uncompleted'}`, goal });
        } else {
            return res.status(400).json({ message: 'Goal cannot be toggled because steps exist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while toggling the goal completion', error });
    }
};