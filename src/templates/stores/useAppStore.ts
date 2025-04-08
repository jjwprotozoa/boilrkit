import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

type NotificationType = 'info' | 'success' | 'error' | 'warning';

interface Notification {
  show: boolean;
  message: string;
  type: NotificationType;
}

interface AppStore {
  darkMode: boolean;
  toggleDarkMode: () => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  notification: Notification;
  showNotification: (message: string, type: NotificationType) => void;
  hideNotification: () => void;
}

// Only persist this slice (no functions)
type PersistedAppSlice = Pick<AppStore, 'darkMode' | 'sidebarOpen' | 'notification'>;

// Zustand-compatible storage wrapper
const zustandStorage: PersistStorage<PersistedAppSlice> = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      darkMode:
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches,

      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.darkMode;
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newDarkMode);
          }
          return { darkMode: newDarkMode };
        }),

      sidebarOpen: false,
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      notification: {
        show: false,
        message: '',
        type: 'info',
      },
      showNotification: (message: string, type: NotificationType) =>
        set({
          notification: {
            show: true,
            message,
            type,
          },
        }),
      hideNotification: () =>
        set({
          notification: {
            show: false,
            message: '',
            type: 'info',
          },
        }),
    }),
    {
      name: 'app-storage',
      storage: typeof window !== 'undefined' ? zustandStorage : undefined,
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarOpen: state.sidebarOpen,
        notification: state.notification,
      }),
    }
  )
);

// Immediately apply dark mode on load
if (typeof window !== 'undefined') {
  const darkMode = useAppStore.getState().darkMode;
  document.documentElement.classList.toggle('dark', darkMode);
}

export { useAppStore };
export default useAppStore;
