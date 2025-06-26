import React, { useState, useCallback } from 'react';
import { Toolbar } from './components/Toolbar';
import { CodeEditor } from './components/CodeEditor';
import { OutputConsole } from './components/OutputConsole';
import { PythonError } from './utils/pythonErrorParser';
import { PythonExecutor } from './utils/pythonExecutor';

const defaultCode = `# Welcome to Python IDE
# Write your Python code here and click "Run Code" to execute

print("Hello, World!")

# Try some examples:
name = "Python Developer"
age = 25
print(f"Hello, {name}! You are {age} years old.")

# Example with potential errors (uncomment to test error detection):
# print("Age: " + age)  # TypeError: string + int
# if True  # SyntaxError: missing colon
#     print("Missing colon")

# Math operations
result = 10 + 5 * 2
print(f"10 + 5 * 2 = {result}")
`;

function App() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState<PythonError[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = useCallback(async () => {
    if (errors.length > 0) {
      // If there are errors, just focus on them
      return;
    }
    
    setIsRunning(true);
    setOutput('');
    
    try {
      const result = await PythonExecutor.executeCode(code);
      setOutput(result.output);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, errors]);

  const handleSave = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python_code.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code]);

  const handleNew = useCallback(() => {
    setCode('# New Python file\n\n');
    setOutput('');
    setErrors([]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Toolbar
        onRun={handleRunCode}
        onSave={handleSave}
        onNew={handleNew}
        isRunning={isRunning}
        hasErrors={errors.length > 0}
      />
      
      <div className="flex-1 flex">
        {/* Editor Panel */}
        <div className="flex-1 border-r border-gray-700">
          <div className="h-full">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-sm font-medium">Editor</span>
              {errors.length > 0 && (
                <span className="ml-2 text-xs text-red-400">
                  {errors.length} error{errors.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="h-[calc(100%-40px)]">
              <CodeEditor
                value={code}
                onChange={setCode}
                errors={errors}
                onErrorsChange={setErrors}
              />
            </div>
          </div>
        </div>
        
        {/* Output Panel */}
        <div className="w-96 flex flex-col">
          <OutputConsole
            output={output}
            errors={errors}
            isRunning={isRunning}
          />
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="px-4 py-1 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>Python IDE</span>
          <span>Lines: {code.split('\n').length}</span>
          <span>Characters: {code.length}</span>
        </div>
        <div className="flex items-center gap-2">
          {errors.length > 0 && (
            <span className="text-red-400">
              {errors.length} error{errors.length > 1 ? 's' : ''}
            </span>
          )}
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}

export default App;