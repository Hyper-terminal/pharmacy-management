import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function TopBarLoader({text}: {text?: string}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate all borders appearing together
      gsap.fromTo(
        '.border-animation',
        {
          scaleX: 0,
          scaleY: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
        }
      );

      // Add subtle pulsing animation
      gsap.to('.border-animation', {
        opacity: 0.7,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Animate text if present
      if (text) {
        gsap.fromTo(
          '.text-animation',
          {
            y: -20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            delay: 0.3,
            ease: 'back.out',
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  return (
    <div ref={containerRef}>
      {/* Top border */}
      <div className="border-animation fixed top-0 right-0 left-0 z-50 h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700" />

      {/* Right border */}
      <div className="border-animation fixed top-3 right-0 bottom-3 z-50 w-3 bg-gradient-to-t from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700" />

      {/* Bottom border */}
      <div className="border-animation fixed bottom-0 right-0 left-0 z-50 h-3 bg-gradient-to-l from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700" />

      {/* Left border */}
      <div className="border-animation fixed top-3 left-0 bottom-3 z-50 w-3 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700" />

      {/* Text container */}
      {text && (
        <div className="text-animation fixed top-1 left-1/2 -translate-x-1/2 z-50 px-4 py-1 text-sm">
          {text}
        </div>
      )}
    </div>
  );
}
