interface MediaPlayerProps {
  query: string | null;
}

export function MediaPlayer({ query }: MediaPlayerProps) {
  if (!query) return null;

  // The query comes optimized from the AI (including "lyrics" or "audio")
  // So we just encode it directly.
  const encodedQuery = encodeURIComponent(query);

  // Get origin for CORS/Embed security
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // Using YouTube Embed with listType=search to play results for the query
  // This avoids needing a specific video ID or API Key.
  // URL format: https://www.youtube.com/embed?listType=search&list=QUERY
  const src = `https://www.youtube.com/embed?listType=search&list=${encodedQuery}&autoplay=1&origin=${origin}`;

  return (
    <div className="fixed bottom-20 right-4 w-64 h-36 md:w-80 md:h-48 bg-black rounded-xl overflow-hidden shadow-2xl border border-cyan-900 z-50 transition-all duration-500">
      <iframe
        width="100%"
        height="100%"
        src={src}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="JARVIS Music Player"
      />
    </div>
  );
}
