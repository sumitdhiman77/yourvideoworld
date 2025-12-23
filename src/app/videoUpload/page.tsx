"use client";
import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Add this state to track the "version" of the uploader
  const [resetKey, setResetKey] = useState(0);

  const videoData = { title, description, videoUrl, thumbnailUrl };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!videoUrl) return toast.error("Please upload a video first");

    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await apiClient.createVideo(videoData);

      // RESET LOGIC
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");

      // 2. Increment the key to force the FileUpload component to wipe clean
      setResetKey((prev) => prev + 1);

      toast.success("Video uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to save video data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 3. Pass the resetKey as a key prop */}
      <FileUpload
        key={resetKey}
        fileType="video"
        onSuccess={(res) => {
          setVideoUrl(res.videoUrl);
        }}
      />

      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Upload Video</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Upload Video"}
          </button>
        </form>
      </div>
    </>
  );
}

export default VideoUploadForm;
