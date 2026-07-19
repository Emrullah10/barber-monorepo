import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';

/**
 * Giriş (Login) işleminin arkasındaki "Beyin".
 * UI (View) kısmı sadece bu hook'u bağlar, iş mantığı burada kalır.
 */
export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Zustand Global Deposundan Fonksiyonumuzu alıyoruz
    const loginAction = useAuthStore((state) => state.loginAction);

    // İş Yapan Fonksiyon
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            // 1. Merkezi axios'umuz (Gateway) ile bizim meşhur Backend rotamıza (routeBase) istek atıyoruz
            const response = await api.post('/login', {
                usersEmail: email,
                usersPassword: password
            });

            // 2. Gateway'den gelen başarılı veriler (Geriye JWT ve JS objesi dönmüştük)
            const { token, user } = response.data;

            // 3. Zustand'ın hafızasına yaz, uygulama boyunca herkes tanısın
            loginAction(user, token);

            return true; // Başarılı

        } catch (err) {
            // 4. CustomError'dan fırlatılan o okyanus ötesi mesajı Hook üzerinden UI yakalıyor
            const errorMessage = err.response?.data?.message || 'Giriş işlemi sırasında bir hata oluştu.';
            setError(errorMessage);
            return false; // Başarısız
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};
