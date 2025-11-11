import React, { useRef, useEffect, useState } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface ResultDisplayProps {
  title: string;
  content: string;
  isLoading: boolean;
  icon: React.ReactNode;
  onChange: (value: string) => void;
}

const SkeletonLoader: React.FC = () => (
  <div className="space-y-4">
    <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
    <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
    <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
    <div className="h-4 bg-slate-700 rounded w-5/6 animate-pulse"></div>
    <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse mt-6"></div>
    <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
  </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ title, content, isLoading, icon, onChange }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [content]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };
    
    const handleCopy = () => {
        if (content) {
            navigator.clipboard.writeText(content).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    };


  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl shadow-lg h-full min-h-[300px] flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <div className="flex items-center gap-2">
            {content && !isLoading && (
                <span className="text-xs font-medium text-teal-400 bg-teal-900/50 px-2 py-1 rounded-full">Editable</span>
            )}
             {content && (
                <button
                    onClick={handleCopy}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                    aria-label="Copy to clipboard"
                >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
            )}
        </div>
      </div>
      <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-200 flex-grow overflow-auto bg-slate-800 p-1">
        {isLoading ? (
          <SkeletonLoader />
        ) : content ? (
            <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                className="w-full h-full bg-transparent border-none focus:ring-0 resize-none p-0 m-0 text-slate-300 whitespace-pre-wrap"
                aria-label={`${title} content`}
            />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Tu historia generada aparecerá aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
};