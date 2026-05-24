import { useState } from "react";
import Sidebar from "./components/Sidebar";
import StreamList from "./components/StreamList";
import Topbar from "./components/Topbar";
import { cn } from "./utils/utils";

function App() {
    const [showSidebarOnMobile, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar((prev) => !prev);
    };

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
