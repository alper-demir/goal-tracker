import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const DeleteStepModal = ({ openDeleteStepModal, setOpenDeleteStepModal, fetchGoal, stepId, goalId }) => {

    const URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem('token');

    const handleClose = () => setOpenDeleteStepModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/api/step/delete`, { stepId, goalId }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.status === 201) {
                toast.success('Step deleted successfully');
                setOpenDeleteStepModal(false);
                await fetchGoal();
            }
        } catch (error) {
            toast.error('Failed to delete step');
        }
    };

    return (
        <Modal
            open={openDeleteStepModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/5 max-xl:w-3/5 max-md:w-4/5 max-sm:w-[95%] max-sm:text-xs p-6 outline-none bg-white dark:bg-[#101010] dark:text-white rounded-md overflow-y-auto max-h-[85%]">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Deletion
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <form className="mb-4 p-4 dark:border-[#3F3F3F] rounded relative" onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="block text-gray-700 dark:text-gray-300">Are you sure to delete this step?</label>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="py-2 px-4 bg-rose-600 text-white dark:bg-[#3F3F3F] rounded">
                                Delete
                            </button>
                        </div>
                    </form>
                </Typography>
            </Box>
        </Modal>
    )
}

export default DeleteStepModal