import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import type { VideoStream } from "../types";
import { scheduleService } from "../service/scheduleService";
import { toHumanReadableDuration } from "../utils/utils";
import { summaryService } from "../service/summaryService";

function StreamDetail() {
    const [video, setVideo] = useState<VideoStream | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const { id } = useParams();
    const videoId = id ?? "";

    useEffect(() => {
        if (!videoId) return;
        scheduleService.getVideoById(videoId).then((data) => setVideo(data));
        summaryService.getSummary(videoId).then((data) => setSummary(data));
    }, [videoId]);

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
            <h2 className='text-3xl font-bold mt-4'>{video?.title}</h2>
            <p className='text-lg text-gray-600 mt-2'>{`By ${video.channel.englishName || video.channel.name}`}</p>
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

            {video.status === "past" && summary && (
                <div className='mt-6 p-4 bg-gray-100 rounded-lg'>
                    <h3 className='text-2xl font-semibold mb-2'>Summary</h3>
                    <div className='text-gray-700 whitespace-pre-wrap'>
                        <Markdown>{summary}</Markdown>
                    </div>
                </div>
            )}

            {video.status === "past" && !summary && (
                <div className='mt-6 p-4 bg-gray-100 rounded-lg'>
                    <h3 className='text-2xl font-semibold mb-2'>Summary</h3>
                    <div className='text-gray-700 whitespace-pre-wrap'>
                        <p>Fetching summary...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StreamDetail;
