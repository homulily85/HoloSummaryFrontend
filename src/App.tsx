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
        <div
            className={cn(
                "grid grid-rows-[auto_1fr] h-screen grid-cols-[1fr_6fr] overflow-hidden",
            )}>
            <div className='col-span-2 z-50'>
                <Topbar toggleSidebar={toggleSidebar} />
            </div>
            <div
                className={cn(
                    showSidebarOnMobile ? "block" : "hidden",
                    "sm:block overflow-y-auto",
                )}>
                <Sidebar />
            </div>
            <div
                className={`${showSidebarOnMobile ? "col-span-1" : "col-span-2 sm:col-span-1"} overflow-y-auto`}>
                <StreamList />
            </div>
        </div>
    );
}
export default App;