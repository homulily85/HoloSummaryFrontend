import { useMemo, useState } from "react";
import { channelService } from "../../services/channelService";
import { useQuery } from "@tanstack/react-query";
import ChannelItem from "./ChannelItem";
import type { Channel } from "../../types";

function ChannelList({ isAuthenticated }: { isAuthenticated: boolean }) {
    const [activeTab, setActiveTab] = useState<"all" | "favourite">("all");

    const { data: allChannels = [] } = useQuery({
        queryFn: () => channelService.getChannels(false),
        queryKey: ["channels", "all"],
    });

    const { data: favoriteChannels = [] } = useQuery({
        queryFn: () => channelService.getChannels(true),
        queryKey: ["channels", "favourite"],
    });

    const groupedChannels = useMemo(() => {
        const grouped: { [key: string]: Channel[] } = {};
        for (const channel of allChannels) {
            if (!grouped[channel.group.name]) {
                grouped[channel.group.name] = [channel];
            } else {
                grouped[channel.group.name].push(channel);
            }
        }
        return grouped;
    }, [allChannels]);

    return (
        <div className='flex flex-col'>
            {isAuthenticated && (
                <div className='bg-gray-200 flex gap-4 text-lg font-medium px-3'>
                    <button
                        className={`hover:bg-gray-300 cursor-pointer active:bg-gray-400 shrink-0 focus:outline-none p-2 m-1 ${activeTab === "all" ? "border-b-2 border-blue-600" : ""}`}
                        onClick={() => setActiveTab("all")}>
                        All
                    </button>
                    <button
                        className={`hover:bg-gray-300 cursor-pointer active:bg-gray-400 shrink-0 focus:outline-none p-2 m-1 ${activeTab === "favourite" ? "border-b-2 border-blue-600" : ""}`}
                        onClick={() => setActiveTab("favourite")}>
                        Favourite
                    </button>
                </div>
            )}

            {activeTab == "all" &&
                Object.entries(groupedChannels).map(([groupName, channels]) => (
                    <div key={groupName} className='mb-6'>
                        <h2 className='text-2xl font-bold p-4'>{groupName}</h2>
                        {channels.map((channel) => (
                            <ChannelItem
                                channel={channel}
                                isAuthenticated={isAuthenticated}
                                key={channel.channelId}
                            />
                        ))}
                    </div>
                ))}

            {activeTab == "favourite" &&
                favoriteChannels.map((channel) => (
                    <ChannelItem
                        channel={channel}
                        isAuthenticated={isAuthenticated}
                        key={channel.channelId}
                    />
                ))}
        </div>
    );
}

export default ChannelList;
