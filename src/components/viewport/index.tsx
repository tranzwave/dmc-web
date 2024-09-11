"use client"
// components/ViewportMeta.tsx
import { useEffect } from 'react';

const ViewportMeta: React.FC = () => {
  useEffect(() => {
    const viewport = document.querySelector("meta[name=viewport]");

    if (viewport) {
      if (window.innerWidth <= 1366) { // Check if screen width is 1366px or less
        viewport.setAttribute('content', 'width=1920, initial-scale=0.67, user-scalable=0');
        console.log(viewport)
      } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, user-scalable=1'); // Reset for larger screens
      }
    }
  }, []);

  return null; // This component does not render anything
};

export default ViewportMeta;
