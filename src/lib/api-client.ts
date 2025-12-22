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
    // Check if we are running on the server (process.env is available there)
    // We use a full URL for the server component fetch,
    // but default to a relative path for client component fetches (like in the Navbar)
    const baseUrl =
      typeof window === "undefined" ? process.env.NEXT_PUBLIC_APP_URL : ""; // Empty string means relative path is used

    const fullUrl = `${baseUrl}/api/${endpoint}`;
    const response = await fetch(fullUrl, {
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
