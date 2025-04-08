// src/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the store state type
interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isOffline: boolean;
  setOfflineStatus: (status: boolean) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Dark mode state
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      toggleDarkMode: () => set((state: AppState) => ({ darkMode: !state.darkMode })),
      
      // App connectivity state
      isOffline: !navigator.onLine,
      setOfflineStatus: (status: boolean) => set({ isOffline: status }),
    }),
    {
      name: 'app-storage',
    }
  )
);

// Apply dark mode to document when store initializes
if (typeof window !== 'undefined') {
  const state = useAppStore.getState();
  
  if (state.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Subscribe to changes and update document class
  useAppStore.subscribe((state) => {
    const darkMode = state.darkMode;
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
}

export default useAppStore;