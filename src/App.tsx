import { useCallback, useState, useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import VideoList from "./components/video/VideoList";
import Topbar from "./components/Topbar";
import Login from "./components/Login";
import { setAccessToken } from "./utils/apiClient";
import { cn } from "./utils/utils";
import axios from "axios";
import VideoDetail from "./components/video/VideoDetail";
import ChannelList from "./components/channel/ChannelList";

function App() {
    const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null,
    );
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const navigate = useNavigate();

    const toggleSidebar = useCallback(() => {
        setShowSidebarOnMobile((prev) => !prev);
    }, []);

    useEffect(() => {
        axios
            .post("/api/auth/refresh", {}, { withCredentials: true })
            .then((response) => {
                setAccessToken(response.data.accessToken);
                setIsAuthenticated(true);
                setAvatarUrl(response.data.pictureUrl);
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    const handleLogout = useCallback(() => {
        setAccessToken(null);
        setIsAuthenticated(false);
        navigate("/login");
        setShowSidebarOnMobile(false);
        axios.post("/api/auth/logout", {}, { withCredentials: true });
    }, [navigate]);

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
                <Topbar
                    toggleSidebar={toggleSidebar}
                    onProfileClick={() => navigate("/login")}
                    isAuthenticated={isAuthenticated}
                    avatarUrl={avatarUrl}
                />
            </div>

            <div className='flex flex-1 relative overflow-hidden'>
                <div
                    className={cn(
                        "absolute sm:relative z-40 h-full bg-white transition-transform duration-200 border-r border-gray-300",
                        showSidebarOnMobile
                            ? "translate-x-0 shadow-2xl"
                            : "-translate-x-full sm:translate-x-0",
                    )}>
                    <Sidebar
                        onHomeClick={() => {
                            navigate("/home");
                            setShowSidebarOnMobile(false);
                        }}
                        onChannelsClick={() => {
                            navigate("/channels");
                            setShowSidebarOnMobile(false);
                        }}
                        onLogoutClick={() => {
                            handleLogout();
                            setShowSidebarOnMobile(false);
                            navigate("/home");
                        }}
                        isAuthenticated={isAuthenticated}
                    />
                </div>

                {showSidebarOnMobile && (
                    <div
                        className='absolute inset-0 bg-black/20 z-30 sm:hidden'
                        onClick={toggleSidebar}
                    />
                )}

                <div className='flex-1 overflow-y-auto w-full'>
                    <Routes>
                        <Route
                            path='/home'
                            element={
                                <VideoList isAuthenticated={isAuthenticated} />
                            }
                        />

                        {isAuthenticated ? (
                            <Route
                                path='/login'
                                element={<Navigate to='/home' />}
                            />
                        ) : (
                            <Route path='/login' element={<Login />} />
                        )}

                        {isAuthenticated && (
                            <Route
                                path='/video/:id'
                                element={<VideoDetail />}
                            />
                        )}

                        <Route
                            path='*'
                            element={<Navigate to='/home' replace />}
                        />

                        <Route
                            path='/channels'
                            element={
                                <ChannelList
                                    isAuthenticated={
                                        isAuthenticated
                                    }></ChannelList>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
