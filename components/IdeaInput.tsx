import React from 'react';
import { MagicWandIcon, SpinnerIcon, LightbulbIcon } from './icons';

interface IdeaInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onInspireMe: () => void;
  isLoading: boolean;
}

export const IdeaInput: React.FC<IdeaInputProps> = ({ value, onChange, onSubmit, onInspireMe, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-4 sm:p-6 rounded-xl shadow-lg">
      <label htmlFor="idea-input" className="block text-sm font-medium text-slate-300 mb-2">
        Introduce tu idea central o déjate inspirar
      </label>
      <div className="relative">
        <textarea
          id="idea-input"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Ej: Una civilización que vive en las nubes y cosecha estrellas..."
          className="w-full h-28 p-3 bg-slate-900 border border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-slate-200 placeholder-slate-500"
          disabled={isLoading}
        />
        <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Ctrl+Enter para generar</span>
             <button
              onClick={onInspireMe}
              disabled={isLoading}
              className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 disabled:opacity-50 transition-all duration-200"
              aria-label="Inspire me"
            >
              <LightbulbIcon />
            </button>
            <button
              onClick={onSubmit}
              disabled={isLoading || !value.trim()}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <MagicWandIcon />
                  <span>Generar</span>
                </>
              )}
            </button>
        </div>
      </div>
    </div>
  );
};