import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import { authStatus } from "../helpers/authStatus";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../stores/user";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const auth = async () => {
        let auth = await authStatus()
        console.log(auth);

        if (!auth.verifyToken) {
            navigate('/login');
        }
    }

    const fetchState = () => {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        dispatch(setUser({ id: decoded.id, username: decoded.username }));
        dispatch(setToken(token));
    }

    useEffect(() => {
        auth();
        fetchState();
    }, [])

    return (

        <div className="dark:bg-background-dark bg-background-light min-h-screen text-text-light dark:text-text-dark">

            <div className="flex flex-col w-full">
                {/* Navbar */}
                <Navbar />

                {/* Main */}
                <div className="mx-auto pb-20 w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default MainLayout