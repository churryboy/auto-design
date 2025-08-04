'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { ChevronDown, User, Settings, FileText } from 'lucide-react';
import { Button } from './Button';

export const Header: React.FC = () => {
  const { currentProject, user } = useStore();

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Logo and Title */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">AI Design Review</h1>
        </div>
        
        <div className="h-6 w-px bg-gray-200" />
        
        {/* File Selector */}
        <div className="flex items-center space-x-2">
          <FileText size={18} className="text-gray-500" />
          <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
            <span>{currentProject?.figmaFileName || 'Select a file'}</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <Button variant="secondary" size="sm">
          Connect Figma
        </Button>
        
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={20} />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
};
