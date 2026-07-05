import { Link } from "react-router-dom";
import type { Video } from "../../types";
import { toHumanReadableDuration } from "../../utils/utils";

function VideoItem({ video, isAuthenticated }: { video: Video; isAuthenticated: boolean }) {
    const innerContent = (
        <div className='flex flex-col gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer h-full'>
            <div className='relative aspect-video rounded-md overflow-hidden mb-2'>
                <img
                    src={`https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`}
                    alt={`${video.title} Thumbnail`}
                    className='w-full h-full object-cover'
                />
                <div
                    className={`${video.status !== "past" ? "hidden" : "absolute bottom-1 right-1 bg-gray-700 bg-opacity-70 text-white text-xs px-2 py-0.5 rounded"}`}>
                    {toHumanReadableDuration(video.duration)}
                </div>
            </div>
            <h3 className='text-lg font-semibold line-clamp-2 overflow-hidden' title={video.title}>
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

    if (isAuthenticated) {
        return (
            <Link to={`/video/${video.videoId}`} className="block h-full">
                {innerContent}
            </Link>
        );
    }

    return (
        <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target='_blank'
            rel='noopener noreferrer'
            className="block h-full">
            {innerContent}
        </a>
    );
}

export default VideoItem;