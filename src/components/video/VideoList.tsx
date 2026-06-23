import { useEffect, useRef } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import VideoItem from "./VideoItem";
import { scheduleService } from "../../services/scheduleService";
import { channelService } from "../../services/channelService";

function VideoList({
    isAuthenticated,
    isFavourite,
}: {
    isAuthenticated: boolean;
    isFavourite: boolean;
}) {
    const observerTarget = useRef<HTMLDivElement>(null);

    const { data: liveStreams = [] } = useQuery({
        queryKey: ["streams", "live"],
        queryFn: () =>
            scheduleService.getSchedule("live", "availableAt", "asc", 50, 0),
    });

    const { data: upcomingStreams = [] } = useQuery({
        queryKey: ["streams", "upcoming"],
        queryFn: () =>
            scheduleService.getSchedule(
                "upcoming",
                "availableAt",
                "asc",
                50,
                0,
            ),
    });

    const {
        data: pastStreamsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["streams", "past"],
        queryFn: ({ pageParam }) =>
            scheduleService.getSchedule(
                "past",
                "availableAt",
                "desc",
                25,
                pageParam as number,
            ),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 25 ? allPages.length : undefined;
        },
    });

    const pastStreams = pastStreamsData?.pages.flat() || [];

    const groupedPastStreams = pastStreams.reduce(
        (acc, video) => {
            // Format the date to a readable string in the user's local timezone
            const dateStr = video.availableAt
                ? new Date(video.availableAt).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                  })
                : "Unknown Date";

            const lastGroup = acc[acc.length - 1];

            // If the current video's date matches the last group's date, add it to that group
            if (lastGroup && lastGroup.date === dateStr) {
                lastGroup.videos.push(video);
            } else {
                // Otherwise, create a new date group
                acc.push({ date: dateStr, videos: [video] });
            }

            return acc;
        },
        [] as { date: string; videos: typeof pastStreams }[],
    );

    const { data: favoriteChannels = [], isLoading: isFavChannelsLoading } =
        useQuery({
            queryKey: ["channels", "favourite"],
            queryFn: () => channelService.getChannels(true),
            enabled: isFavourite && isAuthenticated,
        });

    // Set up the Intersection Observer for Infinite Scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // If we hit the bottom, have more pages to fetch, and aren't already fetching...
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 },
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <div className='p-4'>
            {isFavourite && isFavChannelsLoading && <p>Loading favorites...</p>}
            {liveStreams.length > 0 && (
                <>
                    <h2 className='text-2xl font-bold mb-4'>{`Live (${liveStreams.length})`}</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8'>
                        {isFavourite
                            ? liveStreams
                                  .filter((video) =>
                                      favoriteChannels.some(
                                          (channel) =>
                                              channel.id === video.channel.id,
                                      ),
                                  )
                                  .map((stream) => (
                                      <VideoItem
                                          key={stream.id}
                                          video={stream}
                                          isAuthenticated={isAuthenticated}
                                      />
                                  ))
                            : liveStreams.map((stream) => (
                                  <VideoItem
                                      key={stream.id}
                                      video={stream}
                                      isAuthenticated={isAuthenticated}
                                  />
                              ))}
                    </div>
                </>
            )}

            {upcomingStreams.length > 0 && (
                <>
                    <h2 className='text-2xl font-bold mb-4'>{`Upcoming (${upcomingStreams.length})`}</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8'>
                        {isFavourite
                            ? upcomingStreams
                                  .filter((video) =>
                                      favoriteChannels.some(
                                          (channel) =>
                                              channel.id === video.channel.id,
                                      ),
                                  )
                                  .map((stream) => (
                                      <VideoItem
                                          key={stream.id}
                                          video={stream}
                                          isAuthenticated={isAuthenticated}
                                      />
                                  ))
                            : upcomingStreams.map((stream) => (
                                  <VideoItem
                                      key={stream.id}
                                      video={stream}
                                      isAuthenticated={isAuthenticated}
                                  />
                              ))}
                    </div>
                </>
            )}

            <h2 className='text-2xl font-bold mb-4'>Past</h2>

            {groupedPastStreams.map((group, index) => (
                <div key={group.date || index} className='mb-8'>
                    <h3 className='text-xl font-semibold mb-4 text-gray-700 border-b pb-2'>
                        {group.date}
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
                        {isFavourite
                            ? group.videos
                                  .filter((video) =>
                                      favoriteChannels.some(
                                          (channel) =>
                                              channel.id === video.channel.id,
                                      ),
                                  )
                                  .map((stream) => (
                                      <VideoItem
                                          key={stream.id}
                                          video={stream}
                                          isAuthenticated={isAuthenticated}
                                      />
                                  ))
                            : group.videos.map((stream) => (
                                  <VideoItem
                                      key={stream.id}
                                      video={stream}
                                      isAuthenticated={isAuthenticated}
                                  />
                              ))}
                    </div>
                </div>
            ))}

            <div
                ref={observerTarget}
                className='w-full flex justify-center p-4 mt-4 h-12'>
                {isFetchingNextPage && (
                    <p className='text-gray-500 font-medium'>
                        Loading more videos...
                    </p>
                )}
            </div>
        </div>
    );
}

export default VideoList;
