import React from 'react';
import { Play, Save, FileText, Settings, Code } from 'lucide-react';

interface ToolbarProps {
  onRun: () => void;
  onSave: () => void;
  onNew: () => void;
  isRunning: boolean;
  hasErrors: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  onRun, 
  onSave, 
  onNew, 
  isRunning, 
  hasErrors 
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-4">
          <Code className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-white">Python IDE</span>
        </div>
        
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
        >
          <FileText className="w-4 h-4" />
          New
        </button>
        
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            hasErrors
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Play className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
          {isRunning ? 'Running...' : hasErrors ? 'Check Code' : 'Run Code'}
        </button>
        
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};