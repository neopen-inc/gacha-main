'use client';
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AnimePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) {
      return 
    }

    containerRef.current.children[0] && containerRef.current.children[0].addEventListener("ended", (event) => {
      router.push('/result');
    });
    /*
    containerRef.current.addEventListener("ended", (event) => {
      router.push('/result');
    });
    */
  }, [containerRef]);
  return <div className="w-screen h-screen" ref={containerRef} dangerouslySetInnerHTML={{ __html: `
  <video
    class="absolute z-1000 w-screen h-screen object-cover"
    
    muted
    autoplay
    playsinline
    src="/result.mp4"
  />,
` }}></div>
  
}


/*

  <video autoPlay muted playsInline className="absolute z-1000 w-full h-full object-contain" ref={videoRef}>
  <source src="/result.mp4" type="video/mp4" />
</video>
*/