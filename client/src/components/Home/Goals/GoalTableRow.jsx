import { Link } from 'react-router-dom';

const GoalTableRow = ({ goal, index }) => {
    return (
        <tr className="bg-background-light border-b border-border-light dark:bg-background-dark dark:border-border-dark w-full last:border-0">
            <th scope="row" className="px-6 py-4 font-medium dark:text-white break-words w-1">
                {index + 1}
            </th>
            <th scope="row" className="px-6 py-4 font-medium dark:text-white max-w-40 break-words">
                <Link to={`/goal/${goal._id}`}>{goal.title}</Link>
            </th>
            <td className="px-6 py-4">
                <div className="w-full bg-progressBg-light rounded-full h-2.5 mb-4 dark:bg-progressBg-dark">
                    <div className="bg-[#D8005A] h-2.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                    <span>{goal.progress}%</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="w-full bg-progressBg-light rounded-full h-2.5 mb-4 dark:bg-progressBg-dark">
                    <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: `${goal.elapsedTime}%` }}></div>
                    <span>{goal.elapsedTime}%</span>
                </div>
            </td>
        </tr>
    )
}

export default GoalTableRow