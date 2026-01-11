import { useState, useEffect } from "react";

interface MediaPlayerProps {
  query: string | null;
}

export function MediaPlayer({ query }: MediaPlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchVideoId = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/music', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        const data = await res.json();
        if (data.videoId) {
          setVideoId(data.videoId);
        }
      } catch (e) {
        console.error("Failed to fetch video ID", e);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoId();
  }, [query]);

  if (!query && !videoId) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // Fallback to Search List if direct ID fails, otherwise use direct embed
  const src = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${origin}`
    : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query || "")}&autoplay=1&origin=${origin}`;

  return (
    <div className="fixed bottom-20 right-4 w-64 h-36 md:w-80 md:h-48 bg-black rounded-xl overflow-hidden shadow-2xl border border-cyan-900 z-50 transition-all duration-500">
      {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-cyan-500 text-xs">
              Buscando...
          </div>
      )}
      <iframe
        width="100%"
        height="100%"
        src={src}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="no-referrer"
        title="JARVIS Music Player"
      />
    </div>
  );
}
