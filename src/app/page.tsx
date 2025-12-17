import { apiClient } from "@/lib/api-client";
import VideoPlayer from "./components/VideoPlayer";

export default async function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let videos: any[] = [];

  try {
    videos = await apiClient.getVideos();
  } catch (err) {
    console.error(err);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <VideoPlayer
                videoUrl={video.videoUrl}
                poster={video.thumbnailUrl}
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {video.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-20">
          No videos uploaded yet 🎬
        </p>
      )}
    </main>
  );
}
