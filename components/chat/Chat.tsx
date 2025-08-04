'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { Send, Paperclip } from 'lucide-react';

export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, isAnalyzing } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;

    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      status: 'delivered',
    });

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll analyze your design based on: "${input}". Let me examine the Figma file for you.`,
        timestamp: new Date(),
        status: 'delivered',
      });
    }, 1000);

    setInput('');
  };

  const templates = [
    { label: 'Check spacing', prompt: 'Review the spacing and padding consistency' },
    { label: 'Review colors', prompt: 'Analyze color usage and contrast ratios' },
    { label: 'Check accessibility', prompt: 'Perform accessibility audit for WCAG compliance' },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">AI Design Assistant</h2>
        <p className="text-sm text-gray-500">Powered by Claude Opus 4</p>
      </div>

      {/* Previous chats / Templates */}
      {messages.length === 0 && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick actions:</p>
          <div className="space-y-1">
            {templates.map((template) => (
              <button
                key={template.label}
                onClick={() => setInput(template.prompt)}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[80%] px-4 py-2 rounded-2xl',
                message.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              )}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to review your design..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isAnalyzing}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isAnalyzing}
            isLoading={isAnalyzing}
          >
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};
