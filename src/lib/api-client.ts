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

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(
      `https://yourvideoworld.vercel.app//${endpoint}`,
      {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos(): Promise<IVideo[]> {
    return this.fetch("videos");
  }

  async createVideo(videoData: VideoFormData): Promise<IVideo> {
    return this.fetch("videos", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
