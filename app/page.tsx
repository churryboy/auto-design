'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/ui/Header';
import { Chat } from '@/components/chat/Chat';

// Dynamically import CanvasViewer to avoid SSR issues with Konva
const CanvasViewer = dynamic(
  () => import('@/components/canvas/CanvasViewer').then(mod => mod.CanvasViewer),
  { 
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading canvas...</p>
      </div>
    )
  }
);

export default function Home() {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <div className="flex w-full h-full p-4 space-x-4">
          {/* Chat Interface - 23% width */}
          <div className="w-[23%] min-w-[300px] h-full">
            <Chat />
          </div>
          
          {/* Canvas Viewer - 77% width */}
          <div className="flex-1 h-full">
            <CanvasViewer />
          </div>
        </div>
      </main>
    </div>
  );
}
