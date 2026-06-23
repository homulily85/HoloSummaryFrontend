import { Icon } from "@mdi/react";
import {
    mdiHomeVariantOutline,
    mdiHeart,
    mdiLogout,
    mdiAccountGroup,
} from "@mdi/js";
import { buttonStylesPrimaryTheme } from "../styles/styles";
import { cn } from "../utils/utils";

interface SidebarProps {
    onHomeClick?: () => void;
    onFavouriteClick?: () => void;
    onChannelsClick?: () => void;
    onLogoutClick?: () => void;
    isAuthenticated?: boolean | null;
}

function Sidebar({
    onHomeClick,
    onFavouriteClick,
    onChannelsClick,
    onLogoutClick,
    isAuthenticated,
}: SidebarProps) {
    return (
        <div className='p-4 border-r border-gray-300 h-full flex flex-col justify-between'>
            <ul className='flex flex-col gap-2 sm:text-base font-medium'>
                <li>
                    <button
                        type='button'
                        onClick={onHomeClick}
                        className={cn(
                            buttonStylesPrimaryTheme,
                            "w-full justify-center sm:justify-start",
                        )}>
                        <Icon path={mdiHomeVariantOutline} size={1} />
                        <p className='hidden sm:block'>Home</p>
                    </button>
                </li>

                {isAuthenticated && (
                    <li>
                        <button
                            type='button'
                            onClick={onFavouriteClick}
                            className={cn(
                                buttonStylesPrimaryTheme,
                                "w-full justify-center sm:justify-start",
                            )}>
                            <Icon path={mdiHeart} size={1} />
                            <p className='hidden sm:block'>Favorites</p>
                        </button>
                    </li>
                )}

                <li>
                    <button
                        type='button'
                        onClick={onChannelsClick}
                        className={cn(
                            buttonStylesPrimaryTheme,
                            "w-full justify-center sm:justify-start",
                        )}>
                        <Icon path={mdiAccountGroup} size={1} />
                        <p className='hidden sm:block'>Channels</p>
                    </button>
                </li>
            </ul>

            {isAuthenticated && (
                <ul className='flex flex-col gap-2 sm:text-base font-medium mb-4'>
                    <li>
                        <button
                            type='button'
                            onClick={onLogoutClick}
                            className={cn(
                                buttonStylesPrimaryTheme,
                                "w-full justify-center sm:justify-start text-red-600 hover:bg-red-50 active:bg-red-100 hover:text-red-700",
                            )}>
                            <Icon path={mdiLogout} size={1} />
                            <p className='hidden sm:block'>Logout</p>
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
}

export default Sidebar;
