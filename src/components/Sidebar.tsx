import { Icon } from "@mdi/react";
import { mdiHomeVariantOutline } from "@mdi/js";
import { mdiHeart } from "@mdi/js";

function Sidebar() {
    return (
        <div className='p-4 border-r border-gray-300'>
            <ul className='flex flex-col gap-2 font-medium'>
                <li className='hover:bg-gray-200 cursor-pointer rounded py-2 flex items-center gap-2 active:bg-gray-300'>
                    <Icon
                        path={mdiHomeVariantOutline}
                        size={1}
                    />
                    <p>Home</p>
                </li>
                <li className='hover:bg-gray-200 cursor-pointer rounded py-2 flex items-center gap-2 active:bg-gray-300'>
                    <Icon
                        path={mdiHeart}
                        size={1}
                    />
                    <p>Favorites</p>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
