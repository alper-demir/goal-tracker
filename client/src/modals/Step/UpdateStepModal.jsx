import { Box, Modal, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const UpdateStepModal = ({ openUpdateStepModal, setOpenUpdateStepModal, step, fetchGoal, goalId }) => {

    const URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem('token');

    const [title, setTitle] = useState(step.title);
    const [description, setDescription] = useState(step.description);
    const [priority, setPriority] = useState(step.priority);

    const handleClose = () => setOpenUpdateStepModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${URL}/api/step`, { title, description, priority, stepId: step._id, goalId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                toast.success('Step updated successfully');
                setOpenUpdateStepModal(false);
                await fetchGoal();
            }
            console.log('Step durumu güncellendi:', response.data);
        } catch (error) {
            toast.error(error.message);
            console.error('Step durumu güncellenirken bir hata oluştu:', error);
        }

    }

    if (!open) return null;

    return (

        <Modal
            open={openUpdateStepModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/5 max-xl:w-3/5 max-md:w-4/5 max-sm:w-[95%] max-sm:text-xs p-6 outline-none bg-white dark:bg-[#101010] dark:text-white rounded-md overflow-y-auto max-h-[85%]">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Update Step
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <form className="mb-4 p-4 dark:border-[#3F3F3F] rounded relative" onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="block text-gray-700 dark:text-gray-300">Step Title</label>
                            <input
                                type="text"
                                className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                value={title}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 dark:text-gray-300">Step Description</label>
                            <textarea
                                className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                value={description}
                            ></textarea>
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 dark:text-gray-300">Priority</label>
                            <select
                                className="w-full mt-2 p-2 border border-gray-300 dark:border-[#3F3F3F] rounded"
                                onChange={(e) => setPriority(e.target.value)}
                                required
                                value={priority}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button type="submit" className="py-2 px-4 bg-indigo-600 text-white dark:bg-[#3F3F3F] rounded">
                                Update
                            </button>
                        </div>
                    </form>
                </Typography>
            </Box>
        </Modal>
    );
};

export default UpdateStepModal;
