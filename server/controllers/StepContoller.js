import Goal from "../models/Goal.js";
import Step from "../models/Step.js";

export const updateStep = async (req, res) => {
    try {
        const { stepId, title, description, priority } = req.body;
        console.log(req.body);

        const updatedStep = await Step.findByIdAndUpdate(stepId, { title, description, priority }, { new: true });

        res.status(201).json(updatedStep);

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the step', error });
    }
}

export const stepStatus = async (req, res) => {
    try {
        const { completed, stepId } = req.body;

        // Adımın durumunu güncelle
        const updatedStep = await Step.findByIdAndUpdate(stepId, { completed }, { new: true });

        // Güncellenen adımın ait olduğu hedefi bul
        const goal = await Goal.findOne({ steps: stepId }).populate('steps');

        // Hedefteki tüm adımlar tamamlanmış mı kontrol et
        const allStepsCompleted = goal.steps.every(step => step.completed);

        // Eğer tüm adımlar tamamlanmışsa hedefin tamamlandığını işaretle, aksi durumda false yap
        goal.completed = allStepsCompleted;
        await goal.save();

        res.json({
            message: 'Step updated and goal status checked',
            updatedStep,
            goalCompleted: goal.completed
        });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the step', error });
    }
};

export const createStep = async (req, res) => {
    try {
        const { goalId, description, priority, userId, title } = req.body;

        const newStep = new Step({
            description,
            priority,
            completed: false,
            userId,
            title
        });

        const savedStep = await newStep.save();

        const updatedGoal = await Goal.findByIdAndUpdate(
            goalId,
            { $push: { steps: savedStep._id } },
            { new: true }
        );

        res.status(201).json({
            message: 'Step successfully created and added to the goal',
            step: savedStep,
            goal: updatedGoal
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the step', error });
    }
};

export const deleteStep = async (req, res) => {
    try {
        const { stepId, goalId } = req.body;

        if (!stepId || !goalId) {
            return res.status(400).json({ message: 'Step ID and Goal ID are required' });
        }

        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        goal.steps = goal.steps.filter(step => step._id.toString() !== stepId);

        await goal.save();

        res.status(201).json({ message: 'Step deleted successfully', goal });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the step', error });
    }
}