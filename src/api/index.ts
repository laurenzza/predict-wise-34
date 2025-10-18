import axios from 'axios';

interface User {
    user_id: number;
    email: string;
    nama_lengkap: string;
    nama_toko: string;
    role: string;
}

export const login = async (email: string | undefined, password: string | undefined): Promise<User> => {
    try {
        const user = <User>{
            user_id: 1,
            email: email,
            nama_lengkap: "udin",
            nama_toko: "udin bahagia",
            role: "Admin"
        }
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}