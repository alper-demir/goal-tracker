import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Step from '../components/Goal/Step';
import Loading from './../components/Loading/Loading';
import { CiSquarePlus } from "react-icons/ci";
import CreateStepModal from '../modals/Step/CreateStepModal';
import toast from 'react-hot-toast';

const GoalDetail = () => {

    const URL = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem('token');

    const { id } = useParams();

    const [goal, setGoal] = useState(null);
    const [steps, setSteps] = useState([]);
    const [openCreateStepModal, setOpenCreateStepModal] = useState(false);

    useEffect(() => {
        fetchGoal();
    }, [id]);

    const fetchGoal = async () => {
        console.log("fetchgoal çalısıtı");
        //setSteps([])
        try {
            const response = await axios.post(`${URL}/api/goal/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGoal(response.data);
            setSteps(response.data.steps)
            console.log(response.data.steps);

        } catch (error) {
            console.error('Hedef verileri alınırken bir hata oluştu:', error);
        }
    };

    const handleCompleteGoal = async () => {
        try {
            const response = await axios.put(`${URL}/api/complete-goal`, { goalId: id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);

            if (response.status === 200) {
                toast.success(response.data.message);
                await fetchGoal();
            } else {
                console.error('Error completing goal:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };


    if (!goal) return <Loading />;

    return (
        <div className='max-w-5xl mx-auto p-6'>
            <h1 className='text-3xl font-bold mb-4'>{goal.title}</h1>
            <p className='text-lg mb-4'>{goal.description}</p>
            <p className='text-md mb-2'>Başlangıç Tarihi: {new Date(goal.startDate).toLocaleDateString()}</p>
            <p className='text-md mb-4'>Bitiş Tarihi: {new Date(goal.targetDate).toLocaleDateString()}</p>

            <div className='mb-4'>
                <p className='font-semibold mb-1'>Progress: {goal.progress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-[#3f3f3f]">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                </div>
            </div>

            <div className='mb-4'>
                <p className='font-semibold mb-1'>Elapsed Time: {goal.elapsedTime}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-[#3f3f3f]">
                    <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: `${goal.elapsedTime}%` }}></div>
                </div>
            </div>

            <div className='mb-4'>
                <div className='flex justify-between text-xl font-semibold'>
                    <h2>Steps</h2>
                    <div className='text-lg'>
                        <span>({goal.steps?.filter(step => step.completed).length}/{goal.steps.length})</span>
                    </div>
                </div>
                <ul className='list-disc pl-5 pt-3'>
                    {steps.length === 0 && (
                        <p className='text-sm text-gray-500'>Henüz adım eklenmedi.</p>
                    )}
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            step={step}
                            goalId={goal._id}
                            fetchGoal={fetchGoal}
                        />
                    ))}
                </ul>

                <div className='flex justify-end'>
                    <CiSquarePlus className='text-4xl hover:scale-95 cursor-pointer duration-100' onClick={() => setOpenCreateStepModal(true)} />
                </div>

            </div>

            {steps.length === 0 && (
                <button onClick={handleCompleteGoal} className='mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md shadow-sm hover:bg-yellow-700'>
                    {goal.progress == 100 ? "Tamamlanmadı olarak işaretle" : "Tamamlandı olarak işaretle"}
                </button>
            )}

            {
                openCreateStepModal &&
                <CreateStepModal
                    openCreateStepModal={openCreateStepModal}
                    setOpenCreateStepModal={setOpenCreateStepModal}
                    goalId={id}
                    fetchGoal={fetchGoal}
                />
            }

        </div>
    );
}

export default GoalDetail;