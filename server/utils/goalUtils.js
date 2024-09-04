export const calculateProgress = (goal) => {
    const totalSteps = goal.steps.length;
    if(totalSteps == 0 && goal.completed){ // Herhangi bir step belirlenmediği durumda.
        return 100;
    }
    const completedSteps = goal.steps.filter(step => step.completed).length;
    return totalSteps === 0 ? 0 : (completedSteps / totalSteps) * 100;
};

export const calculateElapsedTime = (goal) => {
    const now = new Date();
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.targetDate);
    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
};