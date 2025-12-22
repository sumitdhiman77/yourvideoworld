/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Connection } from "mongoose";
import { Player } from "video.js"; // Import the Player type from video.js
import "videojs-http-source-selector";

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// Augment the 'Player' interface from the video.js package
declare module "video.js" {
  export interface Player {
    httpSourceSelector?: (options?: { default: string }) => void;
    qualityLevels?: () => any;
  }
}
/* Existing mongoose + video.js augmentations above … */

// Tell TS this module exists
// Declare missing module for TS
declare module "videojs-http-source-selector" {
  const plugin: any;
  export default plugin;
}
declare module "videojs-contrib-quality-levels" {
  const plugin: any;
  export default plugin;
}

export interface IVideo {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface FileUploadProps {
  onSuccess: (res: UploadResult) => void;
  onProgress?: (progress: number) => void; // kept for future use
  fileType?: "image" | "video";
}

export {};
