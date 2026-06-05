'use client';

import { useEffect } from 'react';

export default function ScrollToResults({ category }: { category: string }) {
  useEffect(() => {
    // Skip scrolling for initial 'All' load if desired, but user might want it if they clicked 'All' explicitly.
    // However, on first page load (All), we usually stay at top.
    // We can check if URL actually has the query param.
    const hasCategoryParam = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('category');
    
    if (hasCategoryParam) {
      const element = document.getElementById('tips-results');
      if (element) {
        // simple scrollIntoView might put it at the very top
        // element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Calculate position with some offset to "scroll a little down" but leave some headroom
        const headerOffset = 100; // Adjust to leave space for navbar or breathing room
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [category]);

  return null;
}
