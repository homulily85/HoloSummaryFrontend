import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import type { Video, Channel } from "../../types";
import { scheduleService } from "../../services/scheduleService";
import { cn, toHumanReadableDuration } from "../../utils/utils";
import { summaryService } from "../../services/summaryService";
import {
    buttonStylesBase,
    buttonStylesPrimaryTheme,
} from "../../styles/styles";
import { Icon } from "@mdi/react";
import { mdiHeart, mdiHeartOutline } from "@mdi/js";
import { userService } from "../../services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";

function VideoDetail() {
    const queryClient = useQueryClient();

    const [video, setVideo] = useState<Video | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const favoriteChannels: Channel[] | undefined = queryClient.getQueryData([
        "channels",
        "favourite",
    ]);

    const [isFavorite, setIsFavorite] = useState(
        favoriteChannels?.some((c) => c.id === video?.channel.id) ?? false,
    );

    const { id } = useParams();
    const videoId = id ?? "";

    const fetchInProgress = useRef(false);

    const onToogleShowSummary = async () => {
        setShowSummary((prev) => !prev);

        if (summary || fetchInProgress.current) return;

        fetchInProgress.current = true;
        setIsFetching(true);

        try {
            const data = await summaryService.getSummary(videoId);
            setSummary(data);
        } catch (error) {
            console.error("Failed to fetch summary:", error);
        } finally {
            fetchInProgress.current = false;
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (!videoId) return;

        let isMounted = true;
        scheduleService.getVideoById(videoId).then((data) => {
            if (isMounted) setVideo(data);
        });

        return () => {
            isMounted = false;
        };
    }, [videoId]);

    useEffect(() => {
        if (video && favoriteChannels) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsFavorite(
                favoriteChannels.some((c) => c.id === video.channel.id),
            );
        }
    }, [video, favoriteChannels]);

    const { mutate } = useMutation({
        mutationFn: async (newFavoriteStatus: boolean) => {
            if (!video) throw new Error("No video loaded");
            if (newFavoriteStatus) {
                return userService.addToFavorites(video.channel.id);
            } else {
                return userService.removeFromFavorites(video.channel.id);
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
                        return [...old, video?.channel];
                    } else {
                        return old.filter((c) => c.id !== video?.channel.id);
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
        if (!video) return;
        const newStatus = !isFavorite;

        setIsFavorite(newStatus);

        debouncedToggle(newStatus);
    }, [video, isFavorite, debouncedToggle]);

    useEffect(() => {
        return () => {
            debouncedToggle.cancel();
        };
    }, [debouncedToggle]);

    if (!videoId) {
        return (
            <div className='flex h-screen items-center justify-center'>
                Video not found.
            </div>
        );
    }

    if (!video) {
        return (
            <div className='flex h-screen items-center justify-center'>
                Loading...
            </div>
        );
    }

    return (
        <div className='p-4 grid grid-cols-1 w-full max-w-screen-xl mx-auto'>
            <iframe
                className='w-full aspect-video rounded-xl shadow-md bg-gray-900'
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title='YouTube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen></iframe>
            <h2 className='text-3xl font-bold mt-4 gap-4'>{video?.title}</h2>

            <div className='flex items-center gap-2'>
                <a
                    href={`https://www.youtube.com/channel/${video.channel.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`${cn("inline-flex w-fit items-center gap-2 p-1.5 text-gray-600", buttonStylesBase)}`}>
                    <img
                        className='w-10 h-10 rounded-full mr-2'
                        src={video.channel.photo}
                        alt={video.channel.englishName || video.channel.name}
                    />
                    <p className='text-lg text-gray-600 font-bold'>{`${video.channel.englishName || video.channel.name}`}</p>
                </a>

                <button
                    className={`${cn(buttonStylesBase, "shrink-0")}`}
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
            </div>

            <p className='text-sm text-gray-500 mt-1'>
                {`${
                    video.status === "live"
                        ? "Live - Started at " +
                          new Date(video.availableAt).toLocaleString()
                        : video.status === "past"
                          ? `${new Date(video.availableAt).toLocaleString()} (${toHumanReadableDuration(video.duration)})`
                          : "Starts at " +
                            new Date(video.availableAt).toLocaleString()
                }`}
            </p>

            {video.status === "past" && (
                <div className='mt-6 p-4 bg-gray-100 rounded-lg'>
                    <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-2xl font-semibold'>Summary</h3>
                        <button
                            className={`${cn(buttonStylesPrimaryTheme, "shrink-0")}`}
                            onClick={onToogleShowSummary}>
                            {showSummary ? "Hide" : "Show"}
                        </button>
                    </div>

                    {showSummary && (
                        <div className='text-gray-700 whitespace-pre-wrap mt-4'>
                            {isFetching ? (
                                <p className='animate-pulse'>
                                    Fetching summary...
                                </p>
                            ) : summary ? (
                                <Markdown>{summary}</Markdown>
                            ) : (
                                <p>No summary available.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default VideoDetail;
