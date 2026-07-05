import { Icon } from "@mdi/react";
import type { Channel } from "../../types";
import { mdiHeart, mdiHeartOutline } from "@mdi/js";
import { useCallback, useState, useEffect, useMemo } from "react";
import { userService } from "../../services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";

function ChannelItem({
    channel,
    isAuthenticated,
}: {
    channel: Channel;
    isAuthenticated: boolean;
}) {
    const queryClient = useQueryClient();

    const favoriteChannels: Channel[] | undefined = queryClient.getQueryData([
        "channels",
        "favourite",
    ]);

    const [isFavorite, setIsFavorite] = useState(
        favoriteChannels?.some((c) => c.channelId === channel.channelId) ?? false,
    );

    const { mutate } = useMutation({
        mutationFn: async (newFavoriteStatus: boolean) => {
            if (newFavoriteStatus) {
                return userService.addToFavorites(channel.channelId);
            } else {
                return userService.removeFromFavorites(channel.channelId);
            }
        },
        onMutate: async (newFavoriteStatus) => {
            await queryClient.cancelQueries({
                queryKey: ["channels", "favourite"],
            });

            queryClient.setQueryData(
                ["channels", "favourite"],
                (old: Channel[] = []) => {
                    if (newFavoriteStatus) {
                        return [...old, channel];
                    } else {
                        return old.filter((c) => c.channelId !== channel.channelId);
                    }
                },
            );

            return { favoriteChannels };
        },
        onError: (_, newFavoriteStatus, context) => {
            if (context?.favoriteChannels) {
                queryClient.setQueryData(
                    ["channels"],
                    context.favoriteChannels,
                );
            }
            setIsFavorite(!newFavoriteStatus);
        },
    });

    const debouncedToggle = useMemo(
        () =>
            debounce((status: boolean) => {
                mutate(status);
            }, 500),
        [mutate],
    );

    const handleFavoriteToggle = useCallback(() => {
        const newStatus = !isFavorite;
        setIsFavorite(newStatus);
        debouncedToggle(newStatus);
    }, [isFavorite, debouncedToggle]);

    useEffect(() => {
        return () => {
            debouncedToggle.cancel();
        };
    }, [debouncedToggle]);

    return (
        <div className='flex m-2 p-2 justify-between'>
            <div className='flex items-center'>
                <img
                    src={channel.photo}
                    alt={channel.name}
                    className='w-12 h-12 rounded-full mr-4'
                />
                <div className='flex flex-col justify-center'>
                    <a
                        href={`https://youtube.com/channel/${channel.channelId}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-lg font-medium'>
                        {channel.name}
                    </a>
                    {channel.englishName && (
                        <span className='text-sm text-gray-500'>
                            {channel.englishName}
                        </span>
                    )}
                </div>
            </div>

            {isAuthenticated && (
                <button
                    className='focus:outline-none hover:bg-gray-200 active:bg-gray-300 p-2'
                    onClick={handleFavoriteToggle}>
                    {isFavorite ? (
                        <Icon
                            path={mdiHeart}
                            size={1}
                            className='text-red-500'
                        />
                    ) : (
                        <Icon
                            path={mdiHeartOutline}
                            size={1}
                            className='text-red-500'
                        />
                    )}
                </button>
            )}
        </div>
    );
}

export default ChannelItem;
