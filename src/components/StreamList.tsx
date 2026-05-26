import { useEffect, useState, useRef, useCallback } from "react";
import StreamItem from "./StreamItem";
import type { VideoStream } from "../types";
import { scheduleService } from "../service/scheduleService";

function StreamList({ isAuthenticated }: { isAuthenticated: boolean }) {
    const [liveStreams, setLiveStreams] = useState<VideoStream[]>([]);
    const [upcomingStreams, setUpcomingStreams] = useState<VideoStream[]>([]);
    const [pastStreams, setPastStreams] = useState<VideoStream[]>([]);

    // UI States for the loading spinner/text
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line
    const [_hasMore, setHasMore] = useState(true);

    const observerTarget = useRef<HTMLDivElement>(null);

    // Use refs for pagination logic.
    // This allows the IntersectionObserver to read the latest values
    // without needing to be torn down and recreated on every render.
    const pageRef = useRef(0);
    const isLoadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    // Define the fetch action as a useCallback
    const fetchPastStreams = useCallback(() => {
        // Prevent concurrent fetches or fetching when out of data
        if (isLoadingRef.current || !hasMoreRef.current) return;

        // Sync both the Ref (for immediate logic) and State (for UI updates)
        isLoadingRef.current = true;
        setIsLoading(true);

        scheduleService
            .getSchedule("past", "availableAt", "desc", 25, pageRef.current)
            .then((newStreams) => {
                if (newStreams.length === 0) {
                    hasMoreRef.current = false;
                    setHasMore(false);
                } else {
                    setPastStreams((prev) => [...prev, ...newStreams]);
                    pageRef.current += 1; // Increment page for the next fetch
                }
            })
            .finally(() => {
                isLoadingRef.current = false;
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        scheduleService
            .getSchedule("live", "availableAt", "asc", 100, 0)
            .then((data) => setLiveStreams([...data]));
        scheduleService
            .getSchedule("upcoming", "availableAt", "asc", 100, 0)
            .then((data) => setUpcomingStreams([...data]));

        fetchPastStreams();
    }, [fetchPastStreams]);

    // Set up the Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // The event handler directly triggers the fetch action
                if (entries[0].isIntersecting) {
                    fetchPastStreams();
                }
            },
            { threshold: 0.1 },
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            observer.disconnect(); // Cleanly unmount all targets
        };
    }, [fetchPastStreams]);

    return (
        <div className='p-4'>
            <h2 className='text-2xl font-bold mb-4'>{`Live (${liveStreams.length})`}</h2>
            <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8'>
                {liveStreams.map((stream) => (
                    // 3. Pass it to the StreamItem
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
                {isLoading && (
                    <p className='text-gray-500 font-medium'>
                        Loading more streams...
                    </p>
                )}
            </div>
        </div>
    );
}

export default StreamList;
