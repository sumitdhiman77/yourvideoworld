import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextResponse } from "next/server";

/**
 * Uses MongoDB, Mongoose, NextAuth
 * Must run in Node.js runtime
 */
export const runtime = "nodejs";

type videoData = {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  controls?: boolean;
};

export async function GET() {
  try {
    await connectToDatabase();

    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(videos);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as videoData;

    if (!body.title || !body.description || !body.videoUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newVideo = await Video.create({
      title: body.title,
      description: body.description,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl,
      controls: body.controls ?? true,
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
