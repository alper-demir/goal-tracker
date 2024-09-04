import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdLightMode } from "react-icons/md";
import { GoGoal } from "react-icons/go";
import CreateGoalModal from "../../modals/Goal/CreateGoalModal";
import useOutsideClick from "../../hooks/useOutsideClick";

const Navbar = () => {

    const { username } = useSelector(state => state.user.user);

    //const navigate = useNavigate();
    const menuRef = useRef(null);
    const triggerRef = useRef(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState("light");
    const [openCreateGoalModal, setOpenCreateGoalModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useOutsideClick(menuRef, () => setIsOpen(false), triggerRef);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        localStorage.setItem("sideBarOpen", JSON.stringify(!sidebarOpen));
    };

    const fetchTheme = () => {
        const theme = localStorage.getItem("theme") || "light";
        setTheme(theme);
        document.querySelector("html").classList.toggle("dark", theme === "dark");
    };

    const changeTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.querySelector("html").classList.toggle("dark", newTheme === "dark");
    };

    const logout = async () => {
        console.log("LOGOUT");
    }

    useEffect(() => {
        fetchTheme();
    }, []);

    return (
        <div className="flex items-center justify-between py-3 px-6 max-h-16">
            <div className="flex items-center">
                <FaBars className="cursor-pointer text-xl" onClick={toggleSidebar} />
            </div>
            <div className="flex items-center gap-x-6">
                <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-hover-light dark:hover:bg-hover-dark transition-colors cursor-pointer" onClick={() => setOpenCreateGoalModal(true)}>
                    <GoGoal
                        className="text-2xl"
                    />
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-hover-light dark:hover:bg-hover-dark transition-colors cursor-pointer" onClick={changeTheme}>
                    <MdLightMode
                        className="text-2xl"
                    />
                </div>
                <div>
                    <span>{username}</span>
                </div>
                <div className="relative hover:bg-border-light dark:hover:bg-border-dark transition-colors duration-300 ease-in-out p-[2px] rounded-full">
                    <img src="/defaultAvatar.jpg" alt="" className="w-9 h-9 object-cover rounded-full cursor-pointer" onClick={toggleMenu} ref={triggerRef} />
                    {
                        isOpen &&
                        <div id='settings' ref={menuRef} className='absolute top-10 -left-[8.5rem] border-[1px] border-gray-100 rounded-xl w-[174px] font-semibold text-[15px] bg-white dark:bg-[#181818] dark:text-white dark:border-[#777777] dark:border-opacity-20'>
                            <ul className='flex flex-col'>
                                <Link to="/profile" className='p-3 border-b-[1px] dark:border-[#777777] dark:border-opacity-40'>Profile</Link>
                                <Link to="/about" className='p-3 border-b-[1px] dark:border-[#777777] dark:border-opacity-40'>About</Link>
                                <Link to="/support" className='p-3 border-b-[1px] dark:border-[#777777] dark:border-opacity-40'>Destek</Link>
                                <li className='p-3 cursor-pointer' onClick={logout} >Logout</li>
                            </ul>
                        </div>
                    }
                </div>
            </div>

            {
                openCreateGoalModal &&
                <CreateGoalModal
                    openCreateGoalModal={openCreateGoalModal}
                    setOpenCreateGoalModal={setOpenCreateGoalModal}
                />
            }

        </div>
    )
}

export default Navbar