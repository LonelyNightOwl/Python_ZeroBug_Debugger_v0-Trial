import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { PythonError } from '../utils/pythonErrorParser';

interface OutputConsoleProps {
  output: string;
  errors: PythonError[];
  isRunning: boolean;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({ output, errors, isRunning }) => {
  const hasErrors = errors.length > 0;
  
  const getStatusIcon = () => {
    if (isRunning) {
      return <AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" />;
    }
    if (hasErrors) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };
  
  const getStatusText = () => {
    if (isRunning) return 'Running...';
    if (hasErrors) return `${errors.length} error${errors.length > 1 ? 's' : ''} found`;
    return 'Ready';
  };
  
  const getStatusColor = () => {
    if (isRunning) return 'text-yellow-500';
    if (hasErrors) return 'text-red-500';
    return 'text-green-500';
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Output</span>
          {getStatusIcon()}
          <span className={`text-xs ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {hasErrors && (
          <div className="text-xs text-gray-400">
            Hover over the 🛈 icons for help
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 overflow-auto font-mono text-sm">
        {hasErrors ? (
          <div className="space-y-3">
            <div className="text-red-400 font-semibold mb-3">
              ❌ Errors detected in your code:
            </div>
            {errors.map((error, index) => (
              <div key={index} className="bg-red-950 border border-red-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">Line {error.line}:</span>
                  <div>
                    <div className="text-red-300 font-semibold">{error.type}</div>
                    <div className="text-red-200 text-sm mt-1">{error.message}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 bg-blue-950 border border-blue-800 rounded-lg">
              <div className="text-blue-300 text-sm">
                💡 <strong>Tip:</strong> Look for the 🛈 icons next to error lines in the editor. 
                Hover over them to see detailed explanations and examples!
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {output ? (
              <div>
                <div className="text-green-400 font-semibold mb-2">✅ Output:</div>
                <pre className="whitespace-pre-wrap text-gray-200 bg-gray-800 p-3 rounded-lg">
                  {output}
                </pre>
              </div>
            ) : (
              <div className="text-gray-400 italic">
                {isRunning ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    Executing your Python code...
                  </div>
                ) : (
                  "Click 'Run Code' to execute your Python program"
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};