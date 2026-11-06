'use client';
import { useState } from 'react';
import { analizarPlanoConIA } from '@/services/aiService';

export default function PasoUpload({ onPlanoProcesado }) {
  const [dragOver, setDragOver] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [analizando, setAnalizando] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setArchivo(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const procesarPlanoReal = async () => {
    if (!archivo) return;
    setAnalizando(true);

    try {
      const resultadoLectura = await analizarPlanoConIA(archivo);
      
      if (resultadoLectura && resultadoLectura.length > 0) {
        if (onPlanoProcesado) {
          onPlanoProcesado(resultadoLectura);
        }
      } else {
        alert('No se pudieron extraer materiales legibles del plano. Intenta con una imagen más clara.');
      }
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al procesar el plano con la IA.');
    } finally {
      setAnalizando(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#070707] text-zinc-100 p-8 rounded-2xl border border-orange-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl mb-8">
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Módulo 02 // Gemini Vision AI Parser
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white mt-2">
              Carga y Lectura Real de Planos
            </h2>
          </div>
          <div className="font-mono text-xs text-zinc-500 text-right">
            MOTOR: <span className="text-zinc-300">GEMINI 2.5 FLASH</span>
          </div>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] ${
            dragOver
              ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
              : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
          }`}
        >
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-orange-500 mb-4 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>

          {archivo ? (
            <div className="font-mono">
              <span className="text-orange-400 font-bold text-lg block mb-1">
                {archivo.name}
              </span>
              <span className="text-xs text-zinc-500 uppercase">
                {(archivo.size / (1024 * 1024)).toFixed(2)} MB — LISTO PARA ESCANEAR CON IA
              </span>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-zinc-200">
                Sube la foto de tu croquis, plano PDF o diseño estructural
              </p>
              <p className="text-xs font-mono text-zinc-500 mt-2">
                LA IA DETECTARÁ AUTOMÁTICAMENTE LAS COTAS Y PERFILES
              </p>
            </div>
          )}
        </div>

        {archivo && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={procesarPlanoReal}
              disabled={analizando}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-black font-black uppercase tracking-wider text-xs px-8 py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(234,88,12,0.4)] active:scale-95 disabled:opacity-50"
            >
              {analizando ? (
                <span className="flex items-center gap-2 font-mono">
                  <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ANALIZANDO IMAGEN CON GEMINI AI...
                </span>
              ) : (
                'EJECUTAR ESCANEO INTELIGENTE'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}