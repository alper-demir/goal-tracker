import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import { authStatus } from '../helpers/authStatus';
const Register = () => {
    const URL = import.meta.env.VITE_CLIENT_URL
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const registerUser = async (e) => {
        e.preventDefault();
        const user = await axios.post(`${URL}/api/login`, { email, password, username });

        const uid = user.user.uid;
        const createUserToMongo = await axios.post(`${import.meta.env.VITE_SERVER_URL}/register`, { email, username, _id: uid });
        console.log(createUserToMongo);
        if (user.user) {
            navigate("/login")
        }
    }

    const auth = async () => {
        let auth = await authStatus()
        console.log(auth);

        if (auth.verifyToken) {
            navigate('/');
        }
    }
    useEffect(() => {
        auth();
    }, [])

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 mt-20">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Üyelik oluştur</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={registerUser}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 text-start">Email adresi</label>
                        <div className="mt-2">
                            <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Parola</label>
                        </div>
                        <div className="mt-2">
                            <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2" onChange={(e) => setPassword(e.target.value)} />
                        </div>

                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-start">Kullanıcı adı</label>
                        <div className="mt-2">
                            <input id="username" name="username" type="text" autoComplete="username" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                    </div>
                    <div className="text-sm mt-4 text-center">
                        Zaten üye misin? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Oturum aç</Link>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Kayıt ol</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register