import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import StreamList from "./components/StreamList";
import Topbar from "./components/Topbar";
import { setAccessToken } from "./utils/apiClient";
import { cn } from "./utils/utils";

function App() {
    const [showSidebarOnMobile, setShowSidebar] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null,
    );
    const navigate = useNavigate();

    const toggleSidebar = useCallback(() => {
        setShowSidebar((prev) => !prev);
    }, []);

    useEffect(() => {
        // Use base axios to bypass the interceptor's retry logic
        axios
            .post("/api/auth/refresh", {}, { withCredentials: true })
            .then((response) => {
                setAccessToken(response.data.accessToken);
                setIsAuthenticated(true);
            })
            .catch(() => {
                setIsAuthenticated(false);
                navigate("/login", { replace: true }); // This safely handles the redirect!
            });
    }, [navigate]);

    // Show a blank or loading screen while checking auth status
    if (isAuthenticated === null) {
        return (
            <div className='flex h-screen items-center justify-center'>
                Loading...
            </div>
        );
    }

    return (
        <div className='flex flex-col h-screen overflow-hidden'>
            <div className='z-50 bg-white shrink-0'>
                <Topbar toggleSidebar={toggleSidebar} />
            </div>

            <div className='flex flex-1 relative overflow-hidden'>
                <div
                    className={cn(
                        "absolute sm:relative z-40 h-full bg-white transition-transform duration-200 border-r border-gray-300",
                        showSidebarOnMobile
                            ? "translate-x-0 shadow-2xl"
                            : "-translate-x-full sm:translate-x-0",
                    )}>
                    <Sidebar />
                </div>

                {showSidebarOnMobile && (
                    <div
                        className='absolute inset-0 bg-black/20 z-30 sm:hidden'
                        onClick={toggleSidebar}
                    />
                )}

                <div className='flex-1 overflow-y-auto w-full'>
                    <StreamList />
                </div>
            </div>
        </div>
    );
}
export default App;
