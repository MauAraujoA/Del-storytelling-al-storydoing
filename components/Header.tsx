import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400 pb-2">
        Generador de Historias IA
      </h1>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        Transforma una idea central en un "storytelling" cautivador y un "storydoing" interactivo.
      </p>
    </header>
  );
};
