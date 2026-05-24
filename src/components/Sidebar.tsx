import { Icon } from "@mdi/react";
import { mdiHomeVariantOutline } from "@mdi/js";
import { mdiHeart } from "@mdi/js";
import { buttonStylesBase } from "./styles/styles";
import { cn } from "../utils/utils";

function Sidebar() {
    return (
        <div className='p-4 border-r border-gray-300'>
            <ul className='flex flex-col gap-2 sm:text-base font-medium'>
                <li>
                    <button type='button' className={cn(buttonStylesBase, "w-full")}>
                        <Icon path={mdiHomeVariantOutline} size={1} />
                        <p>Home</p>
                    </button>
                </li>
                <li>
                    <button type='button' className={cn(buttonStylesBase, "w-full")}>
                        <Icon path={mdiHeart} size={1} />
                        <p>Favorites</p>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
