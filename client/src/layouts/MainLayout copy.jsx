import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import { authStatus } from "../helpers/authStatus";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../stores/user";
import { FaBars } from "react-icons/fa";

const MainLayout = () => {

    const { username } = useSelector(state => state.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const auth = async () => {
        let auth = await authStatus()
        console.log(auth);

        if (!auth.verifyToken) {
            navigate('/login');
        }
    }
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchState = () => {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        dispatch(setUser({ id: decoded.id, username: decoded.username }));
        dispatch(setToken(token));
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        localStorage.setItem("sideBarOpen", JSON.stringify(!sidebarOpen));
    };

    const fetchSideBarStatus = () => {
        const sideBarStatus = localStorage.getItem("sideBarOpen");
        console.log(sideBarStatus);
        setSidebarOpen(JSON.parse(sideBarStatus));
    }

    useEffect(() => {
        auth();
        fetchState();
        fetchSideBarStatus();
    }, [])

    return (

        <div className="dark:bg-[#101010] dark:text-[#f1f1f1] min-h-screen flex">

            {/* sidebar */}

            <div className={`fixed inset-y-0 w-64 bg-gray-800 dark:bg-gray-900 p-4 transition-transform transform ${sidebarOpen ? 'translate-x-0 relative' : '-translate-x-full'}  z-10`}>
                <nav className="mt-10">
                    <a href="#" className="block px-4 py-2 text-white">Dashboard</a>
                    <a href="#" className="block px-4 py-2 text-white">Settings</a>
                    <a href="#" className="block px-4 py-2 text-white">Profile</a>
                </nav>
            </div>


            <div className="flex flex-col w-full">
                {/* Navbar */}
                <div className="flex items-center justify-between bg-gray-600 dark:bg-gray-900 p-4">
                    <div className="flex items-center z-20">
                        <FaBars className="cursor-pointer text-white text-xl" onClick={toggleSidebar} />
                    </div>

                    <div className="text-white">
                        <span>{username}</span>
                        <button onClick={() => navigate('/profile')} className="ml-4">Profile</button>
                    </div>
                </div>

                {/* Main */}
                <div className="mx-auto pb-20 w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default MainLayout