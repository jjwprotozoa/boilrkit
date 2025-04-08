interface AppState {
    darkMode: boolean;
    toggleDarkMode: () => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    notification: {
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
    };
    showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
    hideNotification: () => void;
}
declare const useAppStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AppState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AppState, {
            darkMode: boolean;
            sidebarOpen: boolean;
            notification: {
                show: boolean;
                message: string;
                type: 'success' | 'error' | 'info' | 'warning';
            };
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AppState) => void) => () => void;
        onFinishHydration: (fn: (state: AppState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AppState, {
            darkMode: boolean;
            sidebarOpen: boolean;
            notification: {
                show: boolean;
                message: string;
                type: 'success' | 'error' | 'info' | 'warning';
            };
        }>>;
    };
}>;
export { useAppStore };
export default useAppStore;
