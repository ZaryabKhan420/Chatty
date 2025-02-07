import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const useAuthStrore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: "",
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      set({ error: "", user: null, isCheckingAuth: true });
      const result = await axiosInstance.get("/auth/check");
      if (result) {
        set({ error: null, user: result.data.data, isCheckingAuth: false });
      }
      console.log("Checking Auth Successfull.");
      const { connectSocket } = get();

      connectSocket();
    } catch (error) {
      console.log("Error in Checking Authentication", error);
      set({
        error: error.response.data.message,
        user: null,
        isCheckingAuth: false,
      });
    }
  },

  signUp: async ({ fullName, email, password }) => {
    try {
      set({
        isLoading: true,
        error: "",
        user: null,
      });
      const result = await axiosInstance.post("/auth/signup", {
        fullName,
        email,
        password,
      });
      if (result) {
        console.log("SignUp Successfully");
        set({ isLoading: false, error: "", user: result.data.data });
        toast.success("SignUp Successfully");
        const { connectSocket } = get();

        connectSocket();
      }
    } catch (error) {
      console.log("Error in SignUp");
      set({ isLoading: false, error: error.response.data.message, user: null });
      toast.error(error.response.data.message);
    }
  },

  login: async ({ email, password }) => {
    try {
      set({
        isLoading: true,
        error: "",
        user: null,
      });
      const result = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      if (result) {
        console.log("Login Successfully");
        set({ isLoading: false, error: "", user: result.data.data });
        toast.success("Login Successfully");
        const { connectSocket } = get();

        connectSocket();
      }
    } catch (error) {
      console.log("Error in Login");
      set({ isLoading: false, error: error.response.data.message, user: null });
      toast.error(error.response.data.message);
    }
  },

  logout: async () => {
    try {
      set({
        isLoading: true,
        error: "",
      });
      const result = await axiosInstance.post("/auth/logout");
      if (result) {
        console.log("Logout Successfully");
        set({ isLoading: false, error: "", user: null });
        toast.success("Logout Successfully");

        const { disConnectSocket } = get();
        disConnectSocket();
      }
    } catch (error) {
      console.log("Error in Logout");
      set({ isLoading: false, error: error.response.data.message });
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: "" });
    try {
      const result = await axiosInstance.post("/auth/update-profile", data);
      if (result) {
        set({ isLoading: false, error: "", user: result.data.data });
        toast.success("Profile Data Updated Successfully");
      }
    } catch (error) {
      console.log("Error in updating Profile", error);
      set({ isLoading: false, error: error.response.data.message });
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { user } = get();

    if (!user || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: user._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (usersIds) => {
      set({ onlineUsers: usersIds });
    });
  },

  disConnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));

export default useAuthStrore;
