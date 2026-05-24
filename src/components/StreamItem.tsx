import { useCallback } from "react";
import type { VideoStream } from "../types";

function StreamItem({ video }: { video: VideoStream }) {
    const toHumanReadableDuration = useCallback((duration: number) => {
        if (duration === 0) return "0s";

        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor(duration / 60) % 60;
        const seconds = duration % 60;

        const hStr = hours > 0 ? `${hours}h ` : "";
        const mStr = minutes > 0 ? `${minutes}m ` : "";
        const sStr = seconds > 0 ? `${seconds}s` : "";

        return `${hStr}${mStr}${sStr}`.trim();
    }, []);

    return (
        <div className='flex flex-col gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer'>
            <div className='relative aspect-video rounded-md overflow-hidden mb-2'>
                <img
                    src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                    alt={`${video.title} Thumbnail`}
                    className='w-full h-full object-cover'
                />
                <div
                    className={`${video.status !== "past" ? "hidden" : "absolute bottom-1 right-1 bg-gray-700 bg-opacity-70 text-white text-xs px-2 py-0.5 rounded"}`}>
                    {toHumanReadableDuration(video.duration)}
                </div>
            </div>
            <h3 className='text-lg font-semibold line-clamp-2 overflow-hidden'>
                {video.title}
            </h3>
            <p className='text-sm font-semibold text-gray-600'>
                {`${video.channel.englishName || video.channel.name}`}
            </p>
            <p className='text-sm text-gray-600'>
                {video.status === "live"
                    ? "Live - Started at " + video.availableAt.toLocaleString()
                    : video.status === "upcoming"
                      ? `Starts at ${video.availableAt.toLocaleString()}`
                      : `Started at ${video.availableAt.toLocaleString()}`}
            </p>
        </div>
    );
}
export default StreamItem;
