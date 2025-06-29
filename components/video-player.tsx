"use client";
import { useEffect, useState } from "react";

export const VideoPlayer = ({ videoKey }: { videoKey: string }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const res = await fetch("/api/s3playback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: videoKey }),
        });
        const data = await res.json();
        setSignedUrl(data.signedUrl);
        console.log('urlget',data.signedUrl)
      } catch (err) {
        console.error("Failed to load signed URL", err);
      }
    };

    fetchSignedUrl();
  }, [videoKey]);

  if (!signedUrl) return <p>Loading video...</p>;

  return (
    <div className="relative aspect-video">
      <video
        src={signedUrl}
        controls
        preload="metadata"
        className="w-full h-full"
      />
    </div>
  );
};




// "use client";

// export const VideoPlayer = ({url}) => {
//   return (
//     <div className="relative aspect-video">
//       <iframe
//         className="w-full h-full"
//        src={url} title="YouTube video player" frameBorder="0" 
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//         referrerPolicy="strict-origin-when-cross-origin"
        
//       ></iframe>
//     </div>
//   );
// };
