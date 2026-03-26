import React from "react";
import { PlayCircle } from "lucide-react";

export const getVideoType = (url) => {
  if (!url || typeof url !== "string") return "invalid";
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (/(\.mp4|\.webm|\.ogg|\.mov)(\?|#|$)/i.test(lower)) return "file";
  return "unknown";
};

export const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }
    if (parsed.pathname.includes("/embed/")) {
      return url;
    }
  } catch {
    return "";
  }
  return "";
};

export const ModuleVideoPlayer = ({ url, onEnded }) => {
  const type = getVideoType(url);

  if (type === "youtube") {
    const embedUrl = getYouTubeEmbedUrl(url);
    if (!embedUrl) {
      return (
        <div className="text-center text-gray-400">
          <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-60" />
          <p className="text-lg font-semibold">Video unavailable</p>
          <p className="text-sm text-[#6B7280] mt-2">Invalid YouTube link</p>
        </div>
      );
    }
    return (
      <iframe
        className="h-full w-full rounded-2xl border border-gray-200 shadow-sm"
        src={embedUrl}
        title="Module video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (type === "file") {
    return (
      <video
        className="h-full w-full object-contain rounded-2xl border border-gray-200 shadow-sm"
        src={url}
        controls
        onEnded={onEnded}
      />
    );
  }

  return (
    <div className="text-center text-gray-400">
      <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-60" />
      <p className="text-lg font-semibold">Video unavailable</p>
      <p className="text-sm text-[#6B7280] mt-2">Unsupported or missing video link</p>
    </div>
  );
};



