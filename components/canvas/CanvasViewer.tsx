'use client';

import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useStore } from '@/lib/store';
import { ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const CanvasViewer: React.FC = () => {
  const { overlays, diagnostics, selectedDiagnostic } = useStore();
  const [zoom, setZoom] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [stageSize, setStageSize] = React.useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '#DC2626';
      case 'WARNING': return '#F59E0B';
      case 'INFO': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-sm">
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Design Canvas</h2>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" onClick={handleZoomOut}>
            <ZoomOut size={18} />
          </Button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button size="sm" variant="ghost" onClick={handleZoomIn}>
            <ZoomIn size={18} />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleResetZoom}>
            <Maximize2 size={18} />
          </Button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <Button size="sm" variant="ghost">
            <Layers size={18} />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          scaleX={zoom}
          scaleY={zoom}
          x={position.x}
          y={position.y}
          draggable
          onDragEnd={(e) => {
            setPosition({
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        >
          <Layer>
            {/* Placeholder design */}
            <Rect
              x={100}
              y={100}
              width={600}
              height={400}
              fill="#ffffff"
              stroke="#e5e7eb"
              strokeWidth={1}
              cornerRadius={8}
            />
            <Text
              x={400}
              y={280}
              text="Figma Design Preview"
              fontSize={24}
              fill="#9ca3af"
              align="center"
              verticalAlign="middle"
              offsetX={100}
            />

            {/* Diagnostic overlays */}
            {diagnostics.map((diagnostic) => (
              <React.Fragment key={diagnostic.id}>
                <Rect
                  x={diagnostic.position.x}
                  y={diagnostic.position.y}
                  width={diagnostic.position.width}
                  height={diagnostic.position.height}
                  stroke={getSeverityColor(diagnostic.severity)}
                  strokeWidth={2}
                  fill={`${getSeverityColor(diagnostic.severity)}20`}
                  dash={[5, 5]}
                  opacity={selectedDiagnostic?.id === diagnostic.id ? 1 : 0.7}
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Diagnostics Panel */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {diagnostics.length > 0 ? (
              <>
                <span className="font-medium">{diagnostics.length} issues found</span>
                <span className="ml-3">
                  {diagnostics.filter(d => d.severity === 'CRITICAL').length} Critical,{' '}
                  {diagnostics.filter(d => d.severity === 'WARNING').length} Warnings,{' '}
                  {diagnostics.filter(d => d.severity === 'INFO').length} Suggestions
                </span>
              </>
            ) : (
              <span>No issues detected</span>
            )}
          </div>
          {diagnostics.length > 0 && (
            <Button size="sm" variant="primary">
              Apply All Fixes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
