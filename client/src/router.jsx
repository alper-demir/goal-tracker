import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from './pages/Register';
import MainLayout from "./layouts/MainLayout";
import Error from "./pages/Error";
import ProfileLayout from "./layouts/ProfileLayout";
import Home from "./pages/Home";
import GoalDetail from "./pages/GoalDetail";

const router = createBrowserRouter([
    {
        path: "", element: <MainLayout />,
        children: [
            { path: "", element: <Home /> },
            { path: "/goal/:id", element: <GoalDetail /> },
            { path: "/profile/:username", element: <ProfileLayout /> }
        ]
    },
    {
        path: "login", element: <Login />
    },
    {
        path: "register", element: <Register />
    },
    {
        path: "/error", element: <Error />
    },
    {
        path: "*", element: <Error />
    }
])

export default router