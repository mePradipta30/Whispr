import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'
import { io, Socket } from "socket.io-client"


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" :"/"


export const useAuthStore = create((set, get) => ({
    authUser: null, //frewh person so everything is false
    isLoggingIn: false,
    isSigningUp: false, // for loading animation
    isUpdatingProfile: false,
    onlineUsers: [],
    isCheckingAuth: true, // check every time while the page refresh
    // in backend checkAuth function have to run so to understand the user is authenticated or not??
    socket: null,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
            get().connectSocket()

        } catch (error) {
            console.log("Error in authentication", error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }

    },

    signUp: async (data) => {
        set({ isSigningUp: true });

        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data });
            toast.success("Account created successfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in signup", error)
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data });
            toast.success("Logged in successfully")

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in login", error)
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null })
            toast.success("Logged out successfully")
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/updateProfile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        })
        socket.connect()

        set({ socket:socket})
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds})
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect()
        }
    }

}))