import { Icon } from "@mdi/react";
import { mdiHomeVariantOutline, mdiHeart } from "@mdi/js";
import { buttonStylesBase } from "../styles/styles";
import { cn } from "../utils/utils";

function Sidebar() {
    return (
        <div className='p-4 border-r border-gray-300 h-full'>
            <ul className='flex flex-col gap-2 sm:text-base font-medium'>
                <li>
                    <button
                        type='button'
                        className={cn(
                            buttonStylesBase,
                            "w-full justify-center sm:justify-start",
                        )}>
                        <Icon path={mdiHomeVariantOutline} size={1} />
                        <p className='hidden sm:block'>Home</p>
                    </button>
                </li>
                <li>
                    <button
                        type='button'
                        className={cn(
                            buttonStylesBase,
                            "w-full justify-center sm:justify-start",
                        )}>
                        <Icon path={mdiHeart} size={1} />
                        <p className='hidden sm:block'>Favorites</p>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
