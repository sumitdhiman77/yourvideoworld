import { authOptions } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";
import Video, { IVideo } from "../../../models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    console.log("VIDEOS IS: ", videos);
    if (!videos) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body: IVideo = await request.json();
    if (
      !body.title ||
      !body.description ||
      // !body.thumbnailUrl ||
      !body.videoUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      // transformation: {
      //   height: 1980,
      //   width: 1080,
      //   quality: body.transformation?.quality ?? 100,
      // },
    };
    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
