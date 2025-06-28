'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Banner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('banner-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Download className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              <span className="hidden sm:inline">New: </span>
              Download our new MCP for Claude Desktop
            </p>
            <Link href="/mcp" className="inline-flex">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Learn More
              </Button>
            </Link>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-md transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
