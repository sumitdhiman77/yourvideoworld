import { env } from "process";
import { IVideo } from "../models/Video";

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const appUrl = env.NEXT_PUBLIC_APP_URL;
    const response = await fetch(`${appUrl}/api/videos`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include", // 🔒 required for NextAuth
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  // GET /api/videos
  async getVideos(): Promise<IVideo[]> {
    return this.fetch("videos");
  }

  // POST /api/videos
  async createVideo(videoData: VideoFormData): Promise<IVideo> {
    return this.fetch("videos", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
