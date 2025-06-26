import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,


    getUsers: async () => {
        set({ isUserLoading: true })
        try {
            const res = await axiosInstance.get("/messages/users");

            // console.log("Raw Response:", res);
            // console.log("Data:", res.data);
            // console.log("Users:", res.data.users);
            set({ users: res.data.users })  // as users is an array


        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async (userId) => {
        if (!userId) {
            console.log("User ID is missing");
            return;
        }
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);


            set({ messages: res.data.messages })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessageLoading: false });
        }
    },
    sendMessages: async (messageData) => {
        const { selectedUser } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            const newMessage = res?.data?.newMessage;

            console.log("New message received:", newMessage);

            if (!newMessage) return;

            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending message");
        }
    },


    subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
        if(newMessage.senderId !== selectedUser._id) return 
        if (!newMessage || typeof newMessage !== 'object') return;



        set((state) => ({
            messages: [...state.messages, newMessage]
        }));
    });
},


    unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
},


    
    setSelectedUser: (selectedUser) => {
        set({ selectedUser, messages: [] }); // clears old messages
    },



}))