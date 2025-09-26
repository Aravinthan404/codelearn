import React, { useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language?: 'html' | 'css' | 'javascript';
  onChange?: (code: string) => void;
  onRun?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'html',
  onChange,
  onRun
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange?.(newCode);
    
    // Live preview for HTML/CSS
    if (language === 'html' || language === 'css') {
      setOutput(newCode);
    }
  };

  const handleRun = () => {
    onRun?.(code);
    if (language === 'javascript') {
      try {
        // Simple JavaScript execution (in real app, use iframe for security)
        const result = eval(code);
        setOutput(String(result));
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
    } else {
      setOutput(code);
    }
  };

  const reset = () => {
    setCode(initialCode);
    setOutput('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
            {language.toUpperCase()} Editor
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={reset}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Reset"
          >
            <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleRun}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 h-96">
        <div className="relative">
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none"
            placeholder={`Write your ${language} code here...`}
            spellCheck={false}
          />
        </div>
        
        <div className="border-l border-gray-200 dark:border-gray-600">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</span>
          </div>
          <div className="p-4 h-full overflow-auto">
            {language === 'html' ? (
              <div 
                className="text-sm text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            ) : (
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {output || 'Click "Run" to see output...'}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;