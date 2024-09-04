import { FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { useEffect, useState } from 'react';
import UpdateStepModal from '../../modals/Step/UpdateStepModal';
import toast from 'react-hot-toast';
import DeleteStepModal from '../../modals/Step/DeleteStepModal';

const Step = ({ step, goalId, fetchGoal }) => {

    const URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem('token');

    const [openUpdateStepModal, setOpenUpdateStepModal] = useState(false);
    const [openDeleteStepModal, setOpenDeleteStepModal] = useState(false);

    const [currentStep, setStep] = useState({
        completed: null,
        description: "",
        priority: "",
        createdAt: "",
    })

    useEffect(() => {
        setStep(step)
    }, [step]) // Orijinal diziyi bağımlılık olarak ekleyerek güncellenmesini sağladık.

    const handleStepStatus = async (e) => {
        const updatedCompleted = e.target.checked;

        try {
            const response = await axios.put(`${URL}/api/step-status`, { completed: updatedCompleted, stepId: step._id, goalId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await fetchGoal()
            setStep(prevState => ({
                ...prevState,
                completed: updatedCompleted,
            }));
            console.log('Step durumu güncellendi:', response.data);
        } catch (error) {
            toast.error(error.message);
            console.error('Step durumu güncellenirken bir hata oluştu:', error);
        }
    };

    return (
        <li className='list-decimal'>
            <div className={`flex justify-between items-center p-4 mb-3 ${currentStep.completed ? 'bg-green-200 dark:bg-green-950' : 'bg-transparent'} rounded-lg shadow`}>
                <div>
                    <h3
                        className={`text-lg font-semibold ${currentStep.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`} style={{ cursor: 'pointer' }}>
                        {currentStep.description}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Priority: <span className="font-medium">{currentStep.priority}</span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Created on: {new Date(currentStep.createdAt).toLocaleDateString()} {new Date(currentStep.createdAt).toLocaleTimeString()}
                    </p>
                </div>
                <div className='flex flex-col gap-y-2 text-center'>
                    <div className="flex items-center">
                        <label htmlFor="default-checkbox" className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">Completed</label>
                        <input id="default-checkbox" type="checkbox" checked={currentStep.completed} onChange={handleStepStatus} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="flex space-x-2 justify-center">
                        <button
                            onClick={() => setOpenDeleteStepModal(true)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-700"
                        >
                            <FaTrash size={18} />
                        </button>
                        <button
                            onClick={() => setOpenUpdateStepModal(true)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
                        >
                            <FaEdit size={18} />
                        </button>
                    </div>
                </div>


                {
                    openUpdateStepModal &&
                    <UpdateStepModal
                        openUpdateStepModal={openUpdateStepModal}
                        setOpenUpdateStepModal={setOpenUpdateStepModal}
                        fetchGoal={fetchGoal}
                        step={currentStep}
                        goalId={goalId}
                    />
                }

                {
                    openDeleteStepModal &&
                    <DeleteStepModal
                        openDeleteStepModal={openDeleteStepModal}
                        setOpenDeleteStepModal={setOpenDeleteStepModal}
                        fetchGoal={fetchGoal}
                        stepId={currentStep._id}
                        goalId={goalId}
                    />
                }

            </div>
        </li>

    );
};

export default Step;