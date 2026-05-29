import { useState } from "react";
import { Icon } from "@mdi/react";
import {
    mdiMagnify,
    mdiAccountCircleOutline,
    mdiClose,
    mdiMenu,
} from "@mdi/js";
import { buttonStylesPrimaryTheme } from "../styles/styles";
import { cn } from "../utils/utils";

interface TopbarProps {
    toggleSidebar: () => void;
    onProfileClick?: () => void;
    isAuthenticated: boolean | null;
    avatarUrl?: string | null;
}

function Topbar({ toggleSidebar, onProfileClick, isAuthenticated, avatarUrl }: TopbarProps) {
    const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

    return (
        <div className='flex px-4 py-2 gap-4 items-center border-b border-gray-300 w-full'>
            <div
                className={`flex items-center gap-2 ${isMobileSearchActive ? "hidden sm:flex" : "flex"}`}>
                <button type='button' className={cn(buttonStylesPrimaryTheme, "sm:hidden")} onClick={toggleSidebar} aria-label='Toggle sidebar'>
                    <Icon path={mdiMenu} size={1} />
                </button>
                <div
                    className={`items-center gap-2 ${isMobileSearchActive ? "hidden sm:flex" : "flex"}`}>
                    <p className='text-md sm:text-xl sm:pl-1.5 md:text-2xl font-bold whitespace-nowrap tracking-tight'>
                        HoloSummary
                    </p>
                </div>
            </div>

            <div className='flex-1 flex justify-end sm:justify-center gap-2'>
                <input
                    className={`w-full sm:max-w-sm md:max-w-md lg:max-w-lg px-3 py-1.5 border border-gray-400 rounded-md focus:outline-none transition-all
                    ${isMobileSearchActive ? "block" : "hidden sm:block"}`}
                    type='text'
                    placeholder='Search...'
                    autoComplete='off'
                />

                <button
                    type='button'
                    className={cn(buttonStylesPrimaryTheme, "sm:hidden")}
                    onClick={() =>
                        setIsMobileSearchActive(!isMobileSearchActive)
                    }
                    aria-label='Toggle search'>
                    <Icon
                        path={isMobileSearchActive ? mdiClose : mdiMagnify}
                        size={1.5}
                    />
                </button>

                <button
                    type='button'
                    className={cn(buttonStylesPrimaryTheme, "hidden sm:block")}>
                    <Icon path={mdiMagnify} size={1.5} />
                </button>
            </div>

            <button
                type='button'
                // Disable click behavior if logged in
                onClick={isAuthenticated ? undefined : onProfileClick}
                className={cn(
                    buttonStylesPrimaryTheme,
                    isMobileSearchActive ? "hidden sm:block" : "block",
                    isAuthenticated ? "cursor-default hover:bg-transparent active:bg-transparent text-gray-800" : ""
                )}>
                {isAuthenticated && avatarUrl ? (
                    <img 
                        src={avatarUrl} 
                        alt="Profile" 
                        className="w-[24px] h-[24px] rounded-full object-cover" 
                    />
                ) : (
                    <Icon
                        path={mdiAccountCircleOutline}
                        size={1.5}
                    />
                )}
            </button>
        </div>
    );
}

export default Topbar;