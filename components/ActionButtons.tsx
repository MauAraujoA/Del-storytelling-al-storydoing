import React from 'react';
import { DownloadIcon, ClearIcon, SpinnerIcon, ShareIcon, CheckIcon } from './icons';

interface ActionButtonsProps {
  onDownloadPdf: () => void;
  onClear: () => void;
  onShare: () => void;
  isDownloading: boolean;
  isLinkCopied: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onDownloadPdf, onClear, onShare, isDownloading, isLinkCopied }) => {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
      <button
        onClick={onShare}
        disabled={isDownloading}
        className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
      >
        {isLinkCopied ? (
            <>
                <CheckIcon />
                <span>Enlace Copiado</span>
            </>
        ) : (
            <>
                <ShareIcon />
                <span>Compartir</span>
            </>
        )}
      </button>
      <button
        onClick={onDownloadPdf}
        disabled={isDownloading}
        className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
      >
        {isDownloading ? (
          <>
            <SpinnerIcon />
            <span>Descargando...</span>
          </>
        ) : (
          <>
            <DownloadIcon />
            <span>Descargar PDF</span>
          </>
        )}
      </button>
      <button
        onClick={onClear}
        disabled={isDownloading}
        className="w-full sm:w-auto px-5 py-2.5 text-slate-400 font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <ClearIcon />
        <span>Borrar y Empezar</span>
      </button>
    </div>
  );
};