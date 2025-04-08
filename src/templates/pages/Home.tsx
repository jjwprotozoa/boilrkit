import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// For now, we'll create a simple mock auth helper until we have the real one
// This will be replaced once we have the actual auth implementation
const useAuth = () => {
    // Mock implementation
    return {
        user: null // assume logged out initially
    };
};
export default function Home() {
    const { user } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        // Simulate content loading
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "text-center max-w-3xl mx-auto", children: [_jsx("h1", { className: "text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4", children: "Welcome to BoilrKit" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-300 mb-8", children: "Your modern React application starting point with built-in authentication, styling, and essential components." }), _jsx("div", { className: "flex justify-center space-x-4 mb-12", children: !user ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/register", className: "px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-colors", children: "Get Started" }), _jsx(Link, { to: "/login", className: "px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors", children: "Sign In" })] })) : (_jsx(Link, { to: "/dashboard", className: "px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-colors", children: "Go to Dashboard" })) })] }), _jsxs("div", { className: `transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`, children: [_jsx("h2", { className: "text-2xl font-semibold text-center mb-8", children: "Features" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md", children: [_jsx("div", { className: "text-primary-600 dark:text-primary-400 text-3xl mb-3", children: "\uD83D\uDD12" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "Authentication" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "Ready-to-use login, registration, and account management with Firebase." })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md", children: [_jsx("div", { className: "text-primary-600 dark:text-primary-400 text-3xl mb-3", children: "\uD83D\uDCB0" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "Payments" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "Integrated payment processing for subscriptions and one-time transactions." })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md", children: [_jsx("div", { className: "text-primary-600 dark:text-primary-400 text-3xl mb-3", children: "\uD83C\uDFA8" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "Styled UI" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "Beautiful, responsive UI components built with Tailwind CSS." })] })] })] })] }));
}
