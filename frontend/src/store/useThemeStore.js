import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "dark",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme: theme });
    document.getElementById("html").setAttribute("data-theme", theme);
  },
}));

export default useThemeStore;
