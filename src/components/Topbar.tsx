import { useState } from "react";
import { Icon } from "@mdi/react";
import {
    mdiMagnify,
    mdiAccountCircleOutline,
    mdiClose,
    mdiMenu,
} from "@mdi/js";
import { buttonStylesBase } from "../styles/styles";
import { cn } from "../utils/utils";

function Topbar({ toggleSidebar }: { toggleSidebar: () => void }) {
    const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

    return (
        <div className='flex px-4 py-2 gap-4 items-center border-b border-gray-300 w-full'>
            {/* Hidden on mobile when searching, always flex on 'sm' screens and up */}
            <div
                className={`flex items-center gap-2 ${isMobileSearchActive ? "hidden sm:flex" : "flex"}`}>
                <button type='button' className={cn(buttonStylesBase, "sm:hidden")} onClick={toggleSidebar} aria-label='Toggle sidebar'>
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
                {/* Visible if mobile search is active, otherwise hidden on mobile and visible on 'sm' and up */}
                <input
                    className={`w-full sm:max-w-sm md:max-w-md lg:max-w-lg px-3 py-1.5 border border-gray-400 rounded-md focus:outline-none transition-all
                    ${isMobileSearchActive ? "block" : "hidden sm:block"}`}
                    type='text'
                    placeholder='Search...'
                    autoComplete='off'
                />

                {/* Toggles the state when clicked */}
                <button
                    type='button'
                    className={cn(buttonStylesBase, "sm:hidden")}
                    onClick={() =>
                        setIsMobileSearchActive(!isMobileSearchActive)
                    }
                    aria-label='Toggle search'>
                    <Icon
                        path={isMobileSearchActive ? mdiClose : mdiMagnify}
                        size={1.5}
                    />
                </button>

                {/* Desktop static magnify icon (doesn't toggle state) */}
                <button
                    type='button'
                    className={cn(buttonStylesBase, "hidden sm:block")}>
                    <Icon path={mdiMagnify} size={1.5} />
                </button>
            </div>

            {/* Hidden on mobile when searching to give the input field maximum space */}
            <button
                type='button'
                className={cn(
                    buttonStylesBase,
                    isMobileSearchActive ? "hidden sm:block" : "block",
                )}>
                <Icon
                    path={mdiAccountCircleOutline}
                    size={1.5}
                />
            </button>
        </div>
    );
}

export default Topbar;
