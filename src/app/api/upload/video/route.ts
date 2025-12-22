import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("video");

    // 1. Check if it exists and is a File object
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a valid file" },
        { status: 400 }
      );
    }

    // 2. Now TypeScript knows 'file' is a File object, so .type and .size exist
    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Only video files are allowed" },
        { status: 400 }
      );
    }

    // 3. Optional: Add a server-side size check (e.g., 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File is too large (Max 50MB)" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "video",
            folder: "videos",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      videoUrl: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}

// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";
// import { authOptions } from "@/lib/auth";
// import cloudinary from "@/lib/cloudinary";

// export async function POST(request: NextRequest): Promise<Response> {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: "unauthorized" }, { status: 401 });
//     }
//     const formData = await request.formData();
//     const file = formData.get("video") as File;
//     console.log(file);
//     console.log(file.name, file.type, file.size);

//     if (!file) {
//       return NextResponse.json(
//         { error: "Please upload a valid file" },
//         { status: 400 }
//       );
//     }

//     const maxSize = 50 * 1024 * 1024; // 50MB
//     if (file.size > maxSize) {
//       return NextResponse.json(
//         { error: "File too large than 50 MB" },
//         { status: 400 }
//       );
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const result = cloudinary.uploader.upload_stream(buffer);
//     return NextResponse.json(result);
//   } catch {
//     return NextResponse.json(
//       { error: "Failed to upload video" },
//       { status: 500 }
//     );
//   }
// }
