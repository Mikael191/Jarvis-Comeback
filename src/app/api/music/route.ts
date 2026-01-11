import { NextResponse } from 'next/server';

const INVIDIOUS_INSTANCES = [
  "https://vid.puffyan.us",
  "https://inv.tux.pizza",
  "https://invidious.jing.rocks",
  "https://yt.artemislena.eu",
  "https://invidious.nerdvpn.de"
];

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    let videoId = null;

    // Try instances until one works
    for (const instance of INVIDIOUS_INSTANCES) {
      try {
        const res = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`, {
          signal: AbortSignal.timeout(3000) // 3s timeout per instance
        });

        if (res.ok) {
          const data = await res.json();
          // Find first result that is a video
          const firstVideo = data.find((item: any) => item.type === 'video');
          if (firstVideo && firstVideo.videoId) {
            videoId = firstVideo.videoId;
            break; // Found it!
          }
        }
      } catch (e) {
        // Continue to next instance
        console.warn(`Instance ${instance} failed`);
      }
    }

    if (videoId) {
      return NextResponse.json({ videoId });
    } else {
      return NextResponse.json({ error: "No video found" }, { status: 404 });
    }

  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
