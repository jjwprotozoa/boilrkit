import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export default function NotFound() {
    return (_jsx("div", { className: "flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "text-center p-8 max-w-md", children: [_jsx("h1", { className: "text-6xl font-bold text-primary-600 dark:text-primary-400 mb-6", children: "404" }), _jsx("h2", { className: "text-2xl font-semibold text-gray-800 dark:text-white mb-4", children: "Page Not Found" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-8", children: "The page you are looking for doesn't exist or has been moved." }), _jsx(Link, { to: "/", className: "px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-colors", children: "Go Home" })] }) }));
}
