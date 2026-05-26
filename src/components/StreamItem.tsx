import { Link } from "react-router-dom";
import type { VideoStream } from "../types";
import { toHumanReadableDuration } from "../utils/utils";

function StreamItem({ video, isAuthenticated }: { video: VideoStream; isAuthenticated: boolean }) {
    const innerContent = (
        <div className='flex flex-col gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer h-full'>
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
            <p className='text-sm text-gray-600 mt-auto'>
                {video.status === "live"
                    ? "Live - Started at " +
                      video.availableAt.toLocaleString()
                    : video.status === "upcoming"
                      ? `Starts at ${video.availableAt.toLocaleString()}`
                      : `Started at ${video.availableAt.toLocaleString()}`}
            </p>
        </div>
    );

    // 3. Conditionally route based on auth status
    if (isAuthenticated) {
        return (
            <Link to={`/stream/${video.id}`} className="block h-full">
                {innerContent}
            </Link>
        );
    }

    return (
        <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target='_blank'
            rel='noopener noreferrer'
            className="block h-full">
            {innerContent}
        </a>
    );
}

export default StreamItem;