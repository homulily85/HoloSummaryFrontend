import { useState } from "react";
import { Icon } from "@mdi/react";
import { mdiMagnify, mdiAccountCircleOutline, mdiClose } from "@mdi/js";

function Topbar() {
    const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

    return (
        <div className='flex px-4 py-2 gap-4 items-center'>
            {/* Hidden on mobile when searching, always flex on 'sm' screens and up */}
            <div
                className={`items-center gap-2 ${isMobileSearchActive ? "hidden sm:flex" : "flex"}`}>
                <p className='text-md sm:text-xl md:text-2xl font-bold whitespace-nowrap tracking-tight'>
                    HoloSummary
                </p>
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
                    className='hover:bg-gray-200 rounded-md cursor-pointer active:bg-gray-300 shrink-0 sm:hidden focus:outline-none flex items-center justify-center p-1'
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
                <Icon
                    className='hover:bg-gray-200 rounded-md cursor-pointer active:bg-gray-300 shrink-0 hidden sm:block'
                    path={mdiMagnify}
                    size={1.5}
                />
            </div>

            {/* Hidden on mobile when searching to give the input field maximum space */}
            <Icon
                className={`hover:bg-gray-200 rounded-md cursor-pointer active:bg-gray-300 shrink-0 
                ${isMobileSearchActive ? "hidden sm:block" : "block"}`}
                path={mdiAccountCircleOutline}
                size={1.5}
            />
        </div>
    );
}

export default Topbar;
