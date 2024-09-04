import { useEffect, useState } from "react";
import Goals from "../components/Home/Goals/Goals"
import axios from "axios";
import { useSelector } from 'react-redux';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import NoData from "../components/Home/Goals/NoData";

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const Home = () => {
    const URL = import.meta.env.VITE_SERVER_URL;
    const userId = useSelector(state => state.user.user.id);

    const [stats, setStats] = useState({
        totalGoals: 0,
        completedGoals: 0,
        totalSteps: 0,
        completedSteps: 0,
        activeGoals: 0,
        activeSteps: 0
    });

    const [monthlyStats, setMonthlyStats] = useState([]);

    const fetchStats = async () => {
        if (userId === 0) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${URL}/api/goals/stats`, { userId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStats(response.data);
            console.log(response.data);

            const monthlyResponse = await axios.post(`${URL}/api/goals/monthly-stats`, { userId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMonthlyStats(monthlyResponse.data);
            console.log(monthlyResponse.data);

        } catch (error) {
            console.error('İstatistikler getirilemedi.', error);
        }
    };

    const pieData = {
        labels: ['Completed Goals', 'Active Goals'],
        datasets: [
            {
                data: [stats.completedGoals, stats.activeGoals],
                backgroundColor: ['#223f59', '#4277a6'],
                hoverBackgroundColor: ['#223f59', '#4277a6']
            }
        ]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    const lineData = {
        labels: monthlyStats.map(stat => stat.month),
        datasets: [
            {
                label: 'Completed Goals',
                data: monthlyStats.map(stat => stat.completedGoals),
                borderColor: '#223f59',
                fill: false
            },
            {
                label: 'Total Goals',
                data: monthlyStats.map(stat => stat.totalGoals),
                borderColor: '#4277a6',
                fill: false
            },
            {
                label: 'Completed Steps',
                data: monthlyStats.map(stat => stat.completedSteps),
                borderColor: '#ff6384',
                fill: false
            },
            {
                label: 'Total Steps',
                data: monthlyStats.map(stat => stat.totalSteps),
                borderColor: '#36a2eb',
                fill: false
            }
        ]
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Count'
                }
            }
        }
    };

    useEffect(() => {
        fetchStats();
    }, [userId]);

    return (
        <div className="p-6 flex flex-col gap-y-3">
            <div className="flex gap-x-3 max-lg:flex-col max-lg:gap-y-3">
                <div className="w-1/3 max-lg:w-full rounded-md h-40 border-2 border-border-light dark:border-border-dark shadow-sm">
                    <div className="p-5">
                        <p>Şu ana kadar toplam {stats.totalGoals} hedef belirledin.</p>
                        <p>Bu hedeflerin {stats.completedGoals} tanesini tamamladın.</p>
                    </div>
                </div>
                <div className="w-1/3 max-lg:w-full rounded-md h-40 border-2 border-border-light dark:border-border-dark shadow-sm">
                    <div className="p-5">
                        <p>Şu ana kadar toplam {stats.totalSteps} adım belirledin.</p>
                        <p>Bu adımların {stats.completedSteps} tanesini tamamladın.</p>
                    </div>
                </div>
                <div className="w-1/3 max-lg:w-full rounded-md h-40 border-2 border-border-light dark:border-border-dark shadow-sm">
                    <div className="p-5">
                        <p>Aktif {stats.activeGoals} hedef ve {stats.activeSteps} adımın var.</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-x-3 max-lg:flex-col max-lg:gap-y-3">
                <div className="w-1/2 max-lg:w-full rounded-md h-96 border-2 border-border-light dark:border-border-dark p-5 flex items-center justify-center">
                    {stats.completedGoals === 0 || stats.activeGoals === 0 ? (
                        <NoData title={"Henüz hedef belirlemedin veya tamamlamadın."} content={"Hedeflerini belirleyip tamamladığında burada grafikleri görebileceksin."} />
                    ) : (
                        <Pie data={pieData} options={pieOptions} />
                    )}
                </div>

                <div className="w-1/2 max-lg:w-full rounded-md flex flex-col gap-y-2 border-2 border-border-light dark:border-border-dark p-2 h-96">
                    <Goals />
                </div>
            </div>

            <div className="w-full rounded-md h-96 border-2 border-border-light dark:border-border-dark shadow-sm p-10">
                {stats.completedGoals === 0 || stats.activeGoals === 0 ? (
                    <NoData title={"Henüz hedef belirlemedin veya tamamlamadın."} content={"Hedeflerini belirleyip tamamladığında burada grafikleri görebileceksin."} />
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-3">Son 6 Ayın İstatistikleri</h2>
                        <Line data={lineData} options={lineOptions} />
                    </>
                )}

            </div>
        </div>
    );
}

export default Home;