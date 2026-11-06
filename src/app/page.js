'use client';
import { useState, useEffect } from 'react';
import PasoCatalogo from '../components/ui/PasoCatalogo';
import PasoUpload from '../components/ui/PasoUpload';
import PasoDespiece from '../components/ui/PasoDespiece';
import { obtenerMateriales } from '@/services/materialService';

export default function Home() {
  const [materialesExtraidos, setMaterialesExtraidos] = useState(null);
  const [catalogo, setCatalogo] = useState([]);

  useEffect(() => {
    async function cargarCatalogo() {
      const data = await obtenerMateriales();
      setCatalogo(data);
    }
    cargarCatalogo();
  }, []);

  const handlePlanoProcesado = (datos) => {
    setMaterialesExtraidos(datos);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-orange-500 selection:text-black">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f1f1f12_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header Dashboard Responsivo */}
      <header className="relative z-20 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              M&V
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-orange-500 uppercase">
                  CORE SYSTEM v1.0
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                HERRERÍA <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">M&V</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 text-xs font-mono text-zinc-400">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-zinc-600">ENGINE:</span>
              <span className="text-zinc-300 font-semibold">CUT OPTIMIZER AI v2.4</span>
            </div>
            <div className="h-8 w-px bg-zinc-800 hidden lg:block" />
            <div className="flex items-center space-x-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-zinc-300 uppercase tracking-wider text-[10px] sm:text-[11px]">
                AUTOCAD / PLANO PARSER ACTIVE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        <PasoUpload onPlanoProcesado={handlePlanoProcesado} />
        
        {materialesExtraidos && (
          <PasoDespiece 
            datosExtraidos={materialesExtraidos} 
            catalogoSupabase={catalogo} 
          />
        )}

        <PasoCatalogo />
      </div>
    </main>
  );
}