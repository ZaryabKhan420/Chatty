import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore.js";

const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  error: "",

  getUsers: async () => {
    set({ isUsersLoading: true, error: "" });
    try {
      const result = await axiosInstance.get("/messages/users");
      if (result) {
        set({ isUsersLoading: false, users: result.data.data, error: "" });
      }
    } catch (error) {
      console.log("Error in fetching all users", error);
      set({ isUsersLoading: false, error: error.response.data.message });
      toast.error(error.response.data.message);
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true, error: "" });
    try {
      const result = await axiosInstance.get(`/messages/${userId}`);
      if (result) {
        set({
          isMessagesLoading: false,
          error: "",
          messages: result.data.data,
        });
      }
    } catch (error) {
      console.log("Error in fetching Messages", error);
      set({ isMessagesLoading: false, error: error.response.data.message });
      toast.error(error.response.data.message);
    }
  },

  setSelectedUser: async (selectedUser) => {
    set({ selectedUser }); // Optimize this logic
  },

  sendMessage: async (data) => {
    set({ error: "" });
    const { selectedUser, messages } = get();
    try {
      const result = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        data
      );
      if (result) {
        set({ error: "" });
        set({ messages: [...messages, result.data.data] });
      }
    } catch (error) {
      console.log("Error in sending message", error);
      set({ error: error.response.data.message });
      toast(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();

    if (!selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));

export default useChatStore;
