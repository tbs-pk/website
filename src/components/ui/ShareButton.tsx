"use client";

import React, { useState, useEffect } from "react";

type ShareButtonProps = {
  title: string;
  url?: string;
  description?: string;
  className?: string;
  showLabel?: boolean;
};

export default function ShareButton({
  title,
  url,
  description,
  className = "",
  showLabel = true,
}: ShareButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [computedUrl, setComputedUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let u = url || window.location.href;
    if (u.startsWith("/")) {
      u = `${window.location.origin}${u}`;
    }
    setComputedUrl(u);
  }, [url]);

  // Close when clicking outside (optional, but good UX)
  useEffect(() => {
    const handleClickOutside = () => setShow(false);
    if (show) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [show]);

  if (!isClient) return null;

  const encodedUrl = encodeURIComponent(computedUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || "");

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(computedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Toggle visibility on click
  const toggleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShow(!show);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button 
        onClick={toggleShare}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        aria-label="Share"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>

      {show && (
        <div className="absolute top-full right-0 mt-2 grid grid-cols-3 md:flex md:items-center gap-2 bg-white p-2 rounded-lg shadow-lg border border-gray-100 z-50 animate-in fade-in slide-in-from-top-1 w-max max-w-[calc(100vw-2rem)]">
          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity"
            aria-label="Share on WhatsApp"
            title="Share on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>

          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
            aria-label="Share on Facebook"
            title="Share on Facebook"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 2.87v1.12h5.306l-1 3.667h-4.306v7.98H9.101Z"/>
            </svg>
          </a>

          {/* Twitter / X */}
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:opacity-90 transition-opacity"
            aria-label="Share on X (Twitter)"
            title="Share on X (Twitter)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A66C2] text-white hover:opacity-90 transition-opacity"
            aria-label="Share on LinkedIn"
            title="Share on LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* Copy Link */}
          <button
            type="button"
            onClick={copyToClipboard}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors relative"
            aria-label="Copy Link"
            title="Copy Link"
          >
            {copied ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                 <polyline points="20 6 9 17 4 12"></polyline>
               </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
            {copied && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-90 whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
