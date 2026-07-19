import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoggedIn: false,

            // Giriş yapıldığında çalışacak fonksiyon
            loginAction: (userData, authToken) => set({
                user: userData,       // { usersId, usersName, usersRole, userTypeCode, userTypeName, tenantId, tenantSlug, tenantName }
                token: authToken,
                isLoggedIn: true
            }),

            // Çıkış yapıldığında çalışacak fonksiyon
            logoutAction: () => set({
                user: null,
                token: null,
                isLoggedIn: false
            })
        }),
        {
            name: 'auth-storage', // localStorage'da bu isimle tutulacak (Makro Account raporundaki gibi!)
        }
    )
);
