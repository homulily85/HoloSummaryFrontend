function StreamItem() {
    return (
        <div className='flex flex-col gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer'>
            <img
                src='https://i.ytimg.com/vi/B-7iTjtpqrQ/mqdefault.jpg'
                alt='Stream Thumbnail'
                className='w-full aspect-video object-cover rounded-md mb-2'
            />
            <h3 className='text-lg font-semibold line-clamp-2 overflow-hidden'>
                Very Very very very very Very Very very very very Very Very very
                very very long title
            </h3>
            <p className='text-sm text-gray-600'>Streamer Name</p>
            <p className='text-sm text-gray-600'>Status</p>
        </div>
    );
}
export default StreamItem;
