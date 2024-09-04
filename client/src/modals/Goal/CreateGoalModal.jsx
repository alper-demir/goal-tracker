import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import axios from 'axios';

const CreateGoalModal = ({ openCreateGoalModal, setOpenCreateGoalModal }) => { // Goal oluşturulduktan sonra fetchGoal eklenebilir anasayfada güncellemek için.

    const userId = useSelector(state => state.user.user.id);
    const URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem('token');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [steps, setSteps] = useState([{ title: "", description: "", priority: "medium", startDate: "", targetDate: "" }]);

    const handleStepChange = (index, field, value) => {
        const updatedSteps = [...steps];
        updatedSteps[index][field] = value;
        setSteps(updatedSteps);
    };

    const addStep = () => {
        setSteps([...steps, { title: "", description: "", priority: "medium", startDate: "", targetDate: "" }]);
    };

    const removeStep = (index) => {
        const updatedSteps = steps.filter((_, i) => i !== index);
        setSteps(updatedSteps);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${URL}/api/goal/create`,
                { userId, title, description, startDate, targetDate, steps },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 201) {
                toast.success('Goal created successfully');
                setOpenCreateGoalModal(false);
            }
        } catch (error) {
            toast.error('Failed to create goal');
        }
    };

    const handleClose = () => setOpenCreateGoalModal(false);

    return (
        <Modal
            open={openCreateGoalModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/5 max-xl:w-3/5 max-md:w-4/5 max-sm:w-[95%] max-sm:text-xs p-6 outline-none bg-white dark:bg-[#101010] dark:text-white rounded-md overflow-y-auto max-h-[85%]">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Create Goal
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300">Title</label>
                            <input
                                type="text"
                                className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300">Start Date</label>
                            <input
                                type="date"
                                className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300">Target Date</label>
                            <input
                                type="date"
                                className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Steps</h3>
                            {steps.map((step, index) => (
                                <div key={index} className="mb-4 p-4 border border-gray-300 dark:border-[#3F3F3F] rounded relative">
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 text-red-500"
                                        onClick={() => removeStep(index)}
                                    >
                                        <IoClose size={20} />
                                    </button>
                                    <div className="mb-2">
                                        <label className="block text-gray-700 dark:text-gray-300">Step Title</label>
                                        <input
                                            type="text"
                                            className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                            value={step.title}
                                            onChange={(e) => handleStepChange(index, 'title', e.target.value)}

                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-gray-700 dark:text-gray-300">Step Description</label>
                                        <textarea
                                            className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                            value={step.description}
                                            onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-gray-700 dark:text-gray-300">Priority</label>
                                        <select
                                            className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                            value={step.priority}
                                            onChange={(e) => handleStepChange(index, 'priority', e.target.value)}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-4 mb-2">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 dark:text-gray-300">Start Date</label>
                                            <input
                                                type="date"
                                                className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                                value={step.startDate}
                                                onChange={(e) => handleStepChange(index, 'startDate', e.target.value)}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 dark:text-gray-300">End Date</label>
                                            <input
                                                type="date"
                                                className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                                value={step.targetDate}
                                                onChange={(e) => handleStepChange(index, 'targetDate', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="w-full py-2 bg-indigo-600 text-white dark:bg-[#3F3F3F] rounded mt-2"
                                onClick={addStep}
                            >
                                Add Step
                            </button>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="py-2 px-4 border border-gray-300 dark:border-[#3F3F3F] rounded mr-2"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="py-2 px-4 bg-indigo-600 text-white dark:bg-[#3F3F3F] rounded">
                                Create Goal
                            </button>
                        </div>
                    </form>
                </Typography>
            </Box>
        </Modal>
    );
};

export default CreateGoalModal;