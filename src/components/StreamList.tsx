import { useEffect, useRef } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import StreamItem from "./StreamItem";
import { scheduleService } from "../service/scheduleService";

function StreamList({ isAuthenticated }: { isAuthenticated: boolean }) {
    const observerTarget = useRef<HTMLDivElement>(null);

    const { data: liveStreams = [] } = useQuery({
        queryKey: ["streams", "live"],
        queryFn: () => scheduleService.getSchedule("live", "availableAt", "asc", 50, 0),
    });

    const { data: upcomingStreams = [] } = useQuery({
        queryKey: ["streams", "upcoming"],
        queryFn: () => scheduleService.getSchedule("upcoming", "availableAt", "asc", 50, 0),
    });

    const {
        data: pastStreamsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["streams", "past"],
        queryFn: ({ pageParam }) => 
            scheduleService.getSchedule("past", "availableAt", "desc", 25, pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 25 ? allPages.length : undefined;
        },
    });

    // Flatten the pages array into a single array of streams
    const pastStreams = pastStreamsData?.pages.flat() || [];

    // Set up the Intersection Observer for Infinite Scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // If we hit the bottom, have more pages to fetch, and aren't already fetching...
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
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
            <h2 className='text-2xl font-bold mb-4'>{`Live (${liveStreams.length})`}</h2>
            <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8'>
                {liveStreams.map((stream) => (
                    <StreamItem
                        key={stream.id}
                        video={stream}
                        isAuthenticated={isAuthenticated}
                    />
                ))}
            </div>

            <h2 className='text-2xl font-bold mb-4'>{`Upcoming (${upcomingStreams.length})`}</h2>
            <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8'>
                {upcomingStreams.map((stream) => (
                    <StreamItem
                        key={stream.id}
                        video={stream}
                        isAuthenticated={isAuthenticated}
                    />
                ))}
            </div>

            <h2 className='text-2xl font-bold mb-4'>Past</h2>
            <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
                {pastStreams.map((stream) => (
                    <StreamItem
                        key={stream.id}
                        video={stream}
                        isAuthenticated={isAuthenticated}
                    />
                ))}
            </div>

            <div
                ref={observerTarget}
                className='w-full flex justify-center p-4 mt-4 h-12'>
                {isFetchingNextPage && (
                    <p className='text-gray-500 font-medium'>
                        Loading more streams...
                    </p>
                )}
            </div>
        </div>
    );
}

export default StreamList;