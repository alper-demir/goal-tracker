import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useSelector } from "react-redux";
import Loading from "../../Loading/Loading";
import NoData from "./NoData";
import GoalTableRow from "./GoalTableRow";

const Goals = () => {

    const URL = import.meta.env.VITE_SERVER_URL
    const userId = useSelector(state => state.user.user.id);
    const token = localStorage.getItem('token');

    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true);

    const fetchGoals = async () => {
        if (userId == 0) return;
        try {
            const goals = await axios.post(`${URL}/api/goals`, { userId }, { headers: { Authorization: `Bearer ${token}` } })
            setGoals(goals.data);
            setLoading(false);
            console.log(goals.data);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchGoals();
    }, [userId])

    if (loading) {
        return <Loading />
    }

    return goals.length > 0 ? (
        <div className="relative overflow-y-auto h-full">
            <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-background-dark sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            #
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Goal Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Progress
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Elapsed
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        goals && goals.map((goal, index) => {
                            return (
                                <GoalTableRow goal={goal} index={index} key={index} />
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    ) : (
        <NoData title={"Henüz hedef belirlemedin."} content={"Hedef belirlediğin zaman burada görebileceksin."} />
    )
}

export default Goals