import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux";
import axios from "axios";


const ProfileLayout = () => {

    const username = useParams().username;
    const currentUsername = useSelector(state => state.user.user.displayName || "");

    const [posts, setPosts] = useState([])
    const [user, setUser] = useState({})
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const user = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user-data/${username}`);
            setUser(user.data);
            setPosts(user.data.posts);
            console.log(user);
        }
        catch (error) { // Eğer kullanıcı profili yoksa hata sayfasına yönlendir
            navigate("/error")
        }
    }

    const getPosts = async () => {
        try {
            const posts = await axios.get(`${import.meta.env.VITE_SERVER_URL}/posts/${username}`)
            if (posts) {
                setPosts(posts.data.posts)
                console.log(posts.data.posts);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
        getPosts();
    }, [])

    return (
        <div>
            Profile {username} {user && user.firstName} {currentUsername}

            {
                username === currentUsername ? (
                    <p>Kendi profilindesin {username}</p>
                ) : (
                    <p>Başkasının profili</p>
                )
            }

            <div className="flex flex-col w-full">
                <div className='flex justify-between items-center w-full mt-2 max-sm:px-2'>
                    <div className="flex flex-col">
                        <div className="text-2xl font-bold max-sm:text-lg">{user.firstName + " " + user.lastName}</div>
                        <div className="my-1">
                            <div>@{user.username}</div>
                        </div>
                        {user.about && <div className='my-1'>
                            {user.about}
                        </div>}
                    </div>
                    <div className='w-1/5 flex justify-end'><img src={`${user.profileUrl}`} alt="" className="w-[84px] h-[84px] rounded-full object-cover max-sm:w-16 max-sm:h-16 active:scale-90 transition-transform duration-200 cursor-pointer border-2 border-indigo-500" /></div>
                </div>
            </div>

            <div className="flex justify-between my-2 max-sm:px-2 text-xs">
                <div className="flex gap-x-2 items-center">
                    <div className="hover:underline cursor-pointer">{posts.length} posts</div>
                    <div>-</div>
                    <div className="hover:underline cursor-pointer"> followers</div>
                    <div>-</div>
                    <div className="hover:underline cursor-pointer"> followings</div>
                </div>
            </div>

            {
                username !== currentUsername &&
                <div className="text-sm">
                    <div className='border text-center my-2 rounded-xl py-2 font-semibold cursor-pointer dark:border-[#777777]'>
                        <button>Profili Güncelle</button>
                    </div>
                    <div className='flex justify-around text-3xl max-sm:text-2xl items-center mt-5 text-gray-500'>
                        {/* <div className='cursor-pointer hover:scale-125 duration-200'><IoIosCreate /></div>
                        <div className='cursor-pointer hover:scale-125 duration-200'><IoIosCreate /></div> */}
                    </div>
                </div>
            }

        </div>
    )
}

export default ProfileLayout