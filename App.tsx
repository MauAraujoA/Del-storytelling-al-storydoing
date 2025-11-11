import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { IdeaInput } from './components/IdeaInput';
import { ResultDisplay } from './components/ResultDisplay';
import { ActionButtons } from './components/ActionButtons';
import { streamNarratives } from './services/geminiService';
import { StoryResults } from './types';

declare global {
  interface Window {
    jspdf: {
      jsPDF: new (orientation?: string, unit?: string, format?: string) => any;
    };
  }
}

const exampleIdeas = [
  "Un faro que guía a barcos entre las estrellas en lugar del mar.",
  "Una biblioteca donde los libros no leídos susurran sus historias por la noche.",
  "El último dragón del mundo trabajando en una cafetería de Tokio.",
  "Un detective que resuelve crímenes hablando con los fantasmas de la ciudad.",
  "Una tienda que vende emociones embotelladas: alegría, nostalgia, coraje.",
];

const App: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [results, setResults] = useState<StoryResults>({ storytelling: '', storydoing: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Read idea from URL on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const ideaFromUrl = urlParams.get('idea');
    if (ideaFromUrl) {
      setIdea(decodeURIComponent(ideaFromUrl));
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!idea.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResults({ storytelling: '', storydoing: '' });

    try {
      await streamNarratives(
        idea,
        (chunk) => setResults(prev => ({ ...prev, storytelling: prev.storytelling + chunk })),
        (chunk) => setResults(prev => ({ ...prev, storydoing: prev.storydoing + chunk }))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to generate stories. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [idea, isLoading]);
  
  const handleResultChange = (field: keyof StoryResults, value: string) => {
    setResults(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setIdea('');
    setResults({ storytelling: '', storydoing: '' });
    setError(null);
    // Clear URL params
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    setError(null);
    try {
      const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
      const margin = 15;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pdfWidth - margin * 2;
      let yPos = margin;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor('#000000');
      pdf.text('Generador de Historias IA', pdfWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Idea Central:', margin, yPos);
      
      pdf.setFont('helvetica', 'normal');
      const ideaXPos = margin + pdf.getTextWidth('Idea Central: ') + 2;
      const splitIdea = pdf.splitTextToSize(idea, contentWidth - (ideaXPos - margin));
      pdf.text(splitIdea, ideaXPos, yPos);
      yPos += (pdf.getTextDimensions(splitIdea).h) + 8;
      
      pdf.setDrawColor(150, 150, 150);
      pdf.line(margin, yPos, pdfWidth - margin, yPos);
      yPos += 10;
      
      const addContentToPdf = (title: string, content: string) => {
        if (yPos > pdfHeight - 40) {
          pdf.addPage();
          yPos = margin;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text(title, margin, yPos);
        yPos += 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        const splitContent = pdf.splitTextToSize(content, contentWidth);
        
        for (const line of splitContent) {
            if (yPos > pdfHeight - margin) {
                pdf.addPage();
                yPos = margin;
            }
            pdf.text(line, margin, yPos);
            yPos += 6;
        }
        yPos += 10;
      };

      addContentToPdf('Storytelling', results.storytelling);
      addContentToPdf('Storydoing', results.storydoing);

      pdf.save(`historia-ia-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF Download Error:', err);
      setError('Could not generate PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };
  
  const handleInspireMe = () => {
    const randomIndex = Math.floor(Math.random() * exampleIdeas.length);
    setIdea(exampleIdeas[randomIndex]);
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?idea=${encodeURIComponent(idea)}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main>
          <IdeaInput
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onSubmit={handleGenerate}
            onInspireMe={handleInspireMe}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {results.storytelling && !isLoading && (
            <ActionButtons
              onDownloadPdf={handleDownloadPdf}
              onClear={handleClear}
              onShare={handleShare}
              isDownloading={isDownloadingPdf}
              isLinkCopied={isLinkCopied}
            />
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResultDisplay
              title="Storytelling"
              content={results.storytelling}
              isLoading={isLoading && !results.storytelling}
              onChange={(value) => handleResultChange('storytelling', value)}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />
            <ResultDisplay
              title="Storydoing"
              content={results.storydoing}
              isLoading={isLoading && !results.storydoing}
              onChange={(value) => handleResultChange('storydoing', value)}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;