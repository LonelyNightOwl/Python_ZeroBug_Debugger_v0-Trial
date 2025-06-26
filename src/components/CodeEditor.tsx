import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { PythonErrorParser, PythonError } from '../utils/pythonErrorParser';
import { ErrorTooltip } from './ErrorTooltip';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  errors: PythonError[];
  onErrorsChange: (errors: PythonError[]) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  errors, 
  onErrorsChange 
}) => {
  const editorRef = useRef<any>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure Python language support
    monaco.languages.setMonarchTokensProvider('python', {
      tokenizer: {
        root: [
          [/[a-zA-Z_]\w*/, { cases: { 
            '@keywords': 'keyword',
            '@builtins': 'builtin',
            '@default': 'identifier' 
          }}],
          [/""".*?"""/, 'string'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string'],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],
          [/'/, 'string', '@string_single'],
          [/#.*$/, 'comment'],
          [/\d+/, 'number'],
          [/[()[\]{}]/, 'bracket'],
          [/[<>]=?|==|!=|[+\-*/%]/, 'operator'],
        ],
        string: [
          [/[^\\"]+/, 'string'],
          [/"/, 'string', '@pop']
        ],
        string_single: [
          [/[^\\']+/, 'string'],
          [/'/, 'string', '@pop']
        ]
      },
      keywords: [
        'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else',
        'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
        'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
      ],
      builtins: [
        'print', 'input', 'len', 'str', 'int', 'float', 'list', 'dict', 'tuple', 'set',
        'range', 'enumerate', 'zip', 'map', 'filter', 'sum', 'max', 'min', 'abs', 'round'
      ]
    });
    
    updateErrorDecorations(editor, monaco, errors);
  };

  const updateErrorDecorations = (editor: any, monaco: any, errors: PythonError[]) => {
    if (!editor || !monaco) return;
    
    const newDecorations = errors.map(error => ({
      range: new monaco.Range(error.line, 1, error.line, 1000),
      options: {
        isWholeLine: true,
        className: 'error-line',
        minimap: { color: '#ff0000', position: 1 },
        glyphMarginClassName: 'error-glyph'
      }
    }));
    
    const decorationIds = editor.deltaDecorations(decorations, newDecorations);
    setDecorations(decorationIds);
  };

  const handleValueChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
      
      // Parse errors
      const detectedErrors = PythonErrorParser.parseCode(newValue);
      onErrorsChange(detectedErrors);
      
      // Update decorations
      if (editorRef.current) {
        updateErrorDecorations(editorRef.current, (window as any).monaco, detectedErrors);
      }
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      updateErrorDecorations(editorRef.current, (window as any).monaco, errors);
    }
  }, [errors]);

  const getErrorsForLine = (lineNumber: number) => {
    return errors.filter(error => error.line === lineNumber);
  };

  return (
    <div className="relative h-full">
      <style jsx>{`
        .error-line {
          background-color: rgba(255, 0, 0, 0.1) !important;
        }
        .error-glyph {
          background-color: rgba(255, 0, 0, 0.3);
        }
      `}</style>
      
      <Editor
        height="100%"
        defaultLanguage="python"
        theme="vs-dark"
        value={value}
        onChange={handleValueChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          glyphMargin: true,
          lineDecorationsWidth: 10,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible'
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          quickSuggestions: true,
          parameterHints: { enabled: true },
          hover: { enabled: true }
        }}
      />
      
      {/* Error indicators overlay */}
      <div className="absolute top-0 right-0 w-6 h-full pointer-events-none z-10">
        {errors.map((error, index) => {
          const lineHeight = 19; // Approximate line height in Monaco
          const topPosition = (error.line - 1) * lineHeight + 5;
          
          return (
            <div
              key={`${error.line}-${index}`}
              className="absolute right-1 pointer-events-auto"
              style={{ top: `${topPosition}px` }}
            >
              {error.errorInfo && (
                <ErrorTooltip 
                  errorInfo={error.errorInfo} 
                  errorType={error.type}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};