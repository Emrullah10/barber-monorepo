import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = 'http://localhost:5001/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const { token, user } = useAuthStore.getState();

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['userid'] = user?.usersId;
            config.headers['userrole'] = user?.usersRole;
            config.headers['usertypecode'] = user?.userTypeCode ?? '';
            config.headers['tenantid'] = user?.tenantId ?? '';
            config.headers['tenantslug'] = user?.tenantSlug ?? '';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            const { logoutAction, isLoggedIn } = useAuthStore.getState();

            if (isLoggedIn) {
                logoutAction();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
