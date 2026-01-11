"use client";

import { X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicSelectorProps {
  query: string | null;
  onClose: () => void;
}

export function MusicSelector({ query, onClose }: MusicSelectorProps) {
  if (!query) return null;

  const handleOpenYoutube = () => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const handleOpenSpotify = () => {
    // Spotify Web Search URL
    const url = `https://open.spotify.com/search/${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-24 right-4 md:right-8 w-80 bg-zinc-900/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-2xl p-4 z-50"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider">Mídia Detectada</h3>
            <p className="text-white text-lg font-medium truncate max-w-[200px]">{query}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* YouTube Button */}
          <button
            onClick={handleOpenYoutube}
            className="flex items-center justify-center gap-2 bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border border-[#FF0000]/50 text-red-500 hover:text-red-400 py-3 rounded-xl transition-all group"
          >
            <span className="font-bold">YouTube</span>
            <ExternalLink size={16} className="opacity-50 group-hover:opacity-100" />
          </button>

          {/* Spotify Button */}
          <button
            onClick={handleOpenSpotify}
            className="flex items-center justify-center gap-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border border-[#1DB954]/50 text-[#1DB954] hover:text-[#1ed760] py-3 rounded-xl transition-all group"
          >
            <span className="font-bold">Spotify</span>
            <ExternalLink size={16} className="opacity-50 group-hover:opacity-100" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
