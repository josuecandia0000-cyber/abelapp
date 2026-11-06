'use client';
import { useState, useEffect } from 'react';
import { obtenerMateriales, agregarMaterial } from '@/services/materialService';

export default function PasoCatalogo() {
  const [materiales, setMateriales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      const data = await obtenerMateriales();
      setMateriales(data);
      setCargando(false);
    }
    cargarDatos();
  }, []);

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!nombre || !precio) return;

    const nuevo = await agregarMaterial(nombre, 6.0, parseFloat(precio));
    if (nuevo) {
      setMateriales([...materiales, nuevo]);
      setNombre('');
      setPrecio('');
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#070707] text-zinc-100 p-8 rounded-2xl border border-orange-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* Resplandor industrial sutil de fondo */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Encabezado Vanguardista */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Módulo 01 // Master Core
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white mt-2">
              Catálogo de Aceros & Perfiles
            </h2>
          </div>
          <div className="text-right hidden md:block font-mono text-xs text-zinc-500">
            STATUS: SUPABASE SYNCED <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ml-1 animate-pulse"></span>
          </div>
        </div>

        {/* Formulario Estilizado */}
        <form onSubmit={handleAgregar} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 backdrop-blur-md">
          <div className="md:col-span-6">
            <input
              type="text"
              placeholder="Especificación del perfil (ej. PTR 2x2 Cal. 14)"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 px-4 py-3 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono"
            />
          </div>
          <div className="md:col-span-4">
            <input
              type="number"
              placeholder="Precio por barra ($ MXN)"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 px-4 py-3 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-black font-bold uppercase tracking-wider text-xs py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] active:scale-[0.98]"
            >
              Registrar
            </button>
          </div>
        </form>

        {/* Grid de Materiales Asimétrico y Moderno */}
        {cargando ? (
          <div className="py-16 text-center font-mono text-orange-500 text-sm animate-pulse">
            [ ESTABLECIENDO FLUJO DE DATOS CON SUPABASE... ]
          </div>
        ) : materiales.length === 0 ? (
          <div className="py-12 text-center text-zinc-600 font-mono text-sm border border-dashed border-zinc-800 rounded-xl">
            SIN REGISTROS EN EL NÚCLEO DE DATOS
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materiales.map((m, idx) => (
              <div 
                key={m.id} 
                className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-950 p-5 rounded-xl border border-zinc-800/80 hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_4px_25px_rgba(249,115,22,0.1)] flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full pointer-events-none group-hover:bg-orange-500/10 transition-colors" />
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                      ID-REF // 0{idx + 1}
                    </span>
                    <span className="font-mono text-xs bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-md border border-zinc-700/50">
                      {m.barra_metros}m estándar
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                    {m.nombre}
                  </h3>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-end justify-between">
                  <span className="text-xs font-mono text-zinc-500 uppercase">Costo unitario barra</span>
                  <span className="font-mono text-xl font-black text-orange-500 tracking-tight">
                    ${Number(m.precio_barra).toLocaleString('es-MX')} <span className="text-xs font-normal text-zinc-400">MXN</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}