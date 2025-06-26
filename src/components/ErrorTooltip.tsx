import React from 'react';
import { Info } from 'lucide-react';
import { ErrorInfo } from '../data/errorKnowledgeBase';

interface ErrorTooltipProps {
  errorInfo: ErrorInfo;
  errorType: string;
}

export const ErrorTooltip: React.FC<ErrorTooltipProps> = ({ errorInfo, errorType }) => {
  return (
    <div className="group relative inline-block">
      <Info className="w-4 h-4 text-red-500 cursor-help" />
      <div className="invisible group-hover:visible absolute left-6 top-0 z-50 w-96 bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700">
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400 font-bold">{errorType}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">📖</span>
              <div>
                <span className="font-semibold text-blue-300">Definition:</span>
                <p className="text-sm text-gray-300 mt-1">{errorInfo.definition}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="text-yellow-400">❓</span>
            <div>
              <span className="font-semibold text-yellow-300">Common Cause:</span>
              <p className="text-sm text-gray-300 mt-1">{errorInfo.cause}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="text-green-400">🛠</span>
            <div>
              <span className="font-semibold text-green-300">Solution:</span>
              <p className="text-sm text-gray-300 mt-1">{errorInfo.solution}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-400">💥</span>
                  <span className="font-semibold text-red-300">Before (Error):</span>
                </div>
                <pre className="bg-red-950 text-red-200 p-2 rounded text-xs overflow-x-auto">
                  <code>{errorInfo.example_before}</code>
                </pre>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400">✅</span>
                  <span className="font-semibold text-green-300">After (Fixed):</span>
                </div>
                <pre className="bg-green-950 text-green-200 p-2 rounded text-xs overflow-x-auto">
                  <code>{errorInfo.example_after}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tooltip arrow */}
        <div className="absolute left-[-6px] top-2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-gray-900"></div>
      </div>
    </div>
  );
};