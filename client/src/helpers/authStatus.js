import axios from "axios";

const URL = import.meta.env.VITE_SERVER_URL;

export const authStatus = async () => {
    const TOKEN = localStorage.getItem("token");
    if (TOKEN) {
        try {
            const authValid = await axios.post(`${URL}/api/verify-token`, {}, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            });
            return authValid.data;
        } catch (error) {
            console.error("Token doğrulama hatası:", error);
            return false;
        }
    }
    return false;
};
