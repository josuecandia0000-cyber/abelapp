'use client';
import { useState } from 'react';
import { Upload, Trash2, ArrowRight, Cpu, Store, Edit3, Check, Plus, Search } from 'lucide-react';

export default function HerrerAppProDinamico() {
  const [paso, setPaso] = useState(1);
  const [analizando, setAnalizando] = useState(false);

  // 1. CATÁLOGO DINÁMICO DE MATERIALES (El herrero puede agregar todos los que quiera)
  const [catalogoPrecios, setCatalogoPrecios] = useState([
    { id: 'ptr-14', nombre: 'PTR 1½" x 1½" Cal. 14', barraMetros: 6.0, precioBarra: 380 },
    { id: 'solera-1', nombre: 'Solera 1" x 1/4"', barraMetros: 6.0, precioBarra: 210 },
    { id: 'angulo-2', nombre: 'Ángulo de Hierro 2" x 1/4"', barraMetros: 6.0, precioBarra: 450 },
    { id: 'tubo-12', nombre: 'Tubo Cedula 40 1½"', barraMetros: 6.0, precioBarra: 520 },
  ]);

  // Formulario para agregar un material nuevo al catálogo
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');

  // 2. PIEZAS DETECTADAS/AGREGADAS (Relacionadas dinámicamente con el catálogo)
  const [piezas, setPiezas] = useState([
    { id: 1, perfilId: 'ptr-14', largo: 0.70, cantidad: 4 },
    { id: 2, perfilId: 'ptr-14', largo: 0.60, cantidad: 2 },
    { id: 3, perfilId: 'solera-1', largo: 0.82, cantidad: 10 },
  ]);

  // Formulario para agregar una pieza manual si la IA omitió algo
  const [nuevaPiezaPerfil, setNuevaPiezaPerfil] = useState('ptr-14');
  const [nuevaPiezaLargo, setNuevaPiezaLargo] = useState('');
  const [nuevaPiezaCant, setNuevaPiezaCant] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [precioTemporal, setPrecioTemporal] = useState(0);
  const [manoDeObra, setManoDeObra] = useState(3500);

  const simularAnalisisIA = () => {
    setAnalizando(true);
    setTimeout(() => {
      setAnalizando(false);
      setPaso(2);
    }, 1200);
  };

  // Función para registrar un nuevo perfil en la base de datos local
  const agregarAlCatalogo = (e) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoPrecio) return;
    
    const nuevoId = `custom-${Date.now()}`;
    const nuevoElemento = {
      id: nuevoId,
      nombre: nuevoNombre,
      barraMetros: 6.0,
      precioBarra: Number(nuevoPrecio)
    };

    setCatalogoPrecios([...catalogoPrecios, nuevoElemento]);
    setNuevoNombre('');
    setNuevoPrecio('');
  };

  // Función para agregar pieza manual a la tabla de despiece
  const agregarPiezaManual = (e) => {
    e.preventDefault();
    if (!nuevaPiezaLargo || !nuevaPiezaCant) return;

    const nueva = {
      id: Date.now(),
      perfilId: nuevaPiezaPerfil,
      largo: Number(nuevaPiezaLargo),
      cantidad: Number(nuevaPiezaCant)
    };

    setPiezas([...piezas, nueva]);
    setNuevaPiezaLargo('');
    setNuevaPiezaCant('');
  };

  // Cálculo matemático exacto de barras y costos
  const calcularMateriales = () => {
    let costoTotalMateriales = 0;
    const resumenCompra = {};

    piezas.forEach(pieza => {
      const perfil = catalogoPrecios.find(p => p.id === pieza.perfilId);
      if (!perfil) return;

      const metrosTotales = pieza.largo * pieza.cantidad * 1.10; // +10% merma
      const barrasNecesarias = Math.ceil(metrosTotales / perfil.barraMetros);
      const costoSubtotal = barrasNecesarias * perfil.precioBarra;

      costoTotalMateriales += costoSubtotal;

      if (!resumenCompra[perfil.id]) {
        resumenCompra[perfil.id] = {
          nombre: perfil.nombre,
          barras: 0,
          subtotal: 0
        };
      }
      resumenCompra[perfil.id].barras += barrasNecesarias;
      resumenCompra[perfil.id].subtotal += costoSubtotal;
    });

    return { costoTotalMateriales, resumenCompra };
  };

  const { costoTotalMateriales, resumenCompra } = calcularMateriales();

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-mono relative overflow-hidden selection:bg-orange-500 selection:text-black">
      
      {/* Fondo Malla CAD */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-[#080808]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-orange-500 text-black font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-white uppercase">HEMISFERIO</span>
                <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 font-bold">HERRERAPP // v1.0</span>
              </div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Cubicación & Catálogo Multimaterial</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs">
            {[
              { num: '01', title: 'SCAN / UPLOAD' },
              { num: '02', title: 'MEDIDAS & DESPIECE' },
              { num: '03', title: 'CATÁLOGO MATERIALES' },
              { num: '04', title: 'COTIZACIÓN FINAL' }
            ].map((st, i) => (
              <div 
                key={st.num} 
                onClick={() => setPaso(i + 1)}
                className={`flex items-center gap-2 cursor-pointer transition ${paso === i + 1 ? 'text-orange-400 font-bold' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <span className={`px-1.5 py-0.5 text-[10px] ${paso === i + 1 ? 'bg-orange-500 text-black font-extrabold' : 'bg-zinc-900 border border-zinc-800'}`}>
                  {st.num}
                </span>
                <span className="tracking-wider">{st.title}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">

        {/* ================= PASO 1: VISUAL SCANNER ================= */}
        {paso === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 bg-[#0a0a0a] border-l-2 border-orange-500 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Vision Engine
                </span>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight font-sans">
                  PROCESAMIENTO DE PLANOS
                </h1>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Sube la foto del croquis o plano. La IA identificará los perfiles y los asociará con el catálogo completo de materiales de tu taller.
                </p>
              </div>
              <div className="border-t border-zinc-900 pt-4 text-[11px] text-zinc-500 flex justify-between">
                <span>Materiales Registrados:</span>
                <span className="text-orange-400 font-bold">{catalogoPrecios.length} Perfiles Activos</span>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0a0a0a] border border-zinc-800/80 p-6 relative group flex flex-col justify-center items-center text-center min-h-[380px]">
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-orange-500" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-orange-500" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-orange-500" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-orange-500" />

              {analizando ? (
                <div className="space-y-4 py-12">
                  <div className="w-16 h-16 border-2 border-orange-500/30 border-t-orange-500 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-orange-400 tracking-widest animate-pulse uppercase">
                    PROCESANDO LÍNEAS DE CORTE Y COTAS...
                  </p>
                </div>
              ) : (
                <div className="space-y-6 max-w-md">
                  <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-orange-500 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 font-sans">
                      CARGAR PLANO ESTRUCTURAL
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-sans">
                      Arrastra la imagen aquí o pulsa el botón
                    </p>
                  </div>
                  <button 
                    onClick={simularAnalisisIA}
                    className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black py-3.5 px-6 transition uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(249,115,22,0.25)]"
                  >
                    INICIAR ESCANEO DE PLANO <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= PASO 2: MEDIDAS Y DESPIECE DINÁMICO ================= */}
        {paso === 2 && (
          <div className="space-y-6">
            <div className="bg-[#0a0a0a] border-l-2 border-orange-500 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">PASO 02 // AUDITORÍA</span>
                <h2 className="text-lg font-bold text-white font-sans">LISTADO DE CORTES / ELEMENTOS</h2>
              </div>
              <button 
                onClick={() => setPaso(3)}
                className="bg-orange-500 hover:bg-orange-400 text-black font-black px-5 py-2.5 text-xs uppercase tracking-wider transition flex items-center gap-2"
              >
                GESTIONAR PRECIOS DEL CATÁLOGO <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario rápido para agregar corte manual */}
            <form onSubmit={agregarPiezaManual} className="bg-[#0a0a0a] border border-zinc-800 p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <label className="text-[10px] text-zinc-400 block mb-1">Seleccionar Perfil del Catálogo:</label>
                <select 
                  value={nuevaPiezaPerfil}
                  onChange={(e) => setNuevaPiezaPerfil(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs p-2 focus:outline-none focus:border-orange-500"
                >
                  {catalogoPrecios.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] text-zinc-400 block mb-1">Largo Unitario (m):</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Ej: 1.25"
                  value={nuevaPiezaLargo}
                  onChange={(e) => setNuevaPiezaLargo(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs p-2 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-zinc-400 block mb-1">Cantidad:</label>
                <input 
                  type="number" 
                  placeholder="Ej: 4"
                  value={nuevaPiezaCant}
                  onChange={(e) => setNuevaPiezaCant(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs p-2 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <button type="submit" className="w-full bg-zinc-800 hover:bg-orange-500 hover:text-black text-white text-xs font-bold py-2 px-3 transition flex items-center justify-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
            </form>

            {/* Tabla de piezas */}
            <div className="bg-[#0a0a0a] border border-zinc-800 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-500 uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">PERFIL SELECCIONADO</th>
                    <th className="py-3 px-4 font-bold">LONGITUD (M)</th>
                    <th className="py-3 px-4 font-bold">CANTIDAD</th>
                    <th className="py-3 px-4 text-right font-bold">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {piezas.map((p) => {
                    const perfilObj = catalogoPrecios.find(cat => cat.id === p.perfilId);
                    return (
                      <tr key={p.id} className="hover:bg-zinc-900/40 transition">
                        <td className="py-3.5 px-4 text-orange-400 font-bold">{perfilObj ? perfilObj.nombre : 'Perfil no encontrado'}</td>
                        <td className="py-3.5 px-4 text-zinc-300">{p.largo.toFixed(2)} m</td>
                        <td className="py-3.5 px-4 text-zinc-300">{p.cantidad} pzas</td>
                        <td className="py-3.5 px-4 text-right">
                          <button onClick={() => setPiezas(piezas.filter(item => item.id !== p.id))} className="text-zinc-600 hover:text-red-400 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= PASO 3: AÑADIR/EDITAR MATERIALES EN EL CATÁLOGO ================= */}
        {paso === 3 && (
          <div className="space-y-6">
            <div className="bg-[#0a0a0a] border-l-2 border-orange-500 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> PASO 03 // CATÁLOGO DE PROVEEDORES</span>
                <h2 className="text-lg font-bold text-white font-sans">ADMINISTRAR PRECIOS Y MATERIALES</h2>
              </div>
              <button 
                onClick={() => setPaso(4)}
                className="bg-orange-500 hover:bg-orange-400 text-black font-black px-5 py-2.5 text-xs uppercase tracking-wider transition flex items-center gap-2"
              >
                GENERAR COTIZACIÓN <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario para agregar nuevo tipo de material */}
            <form onSubmit={agregarAlCatalogo} className="bg-[#0a0a0a] border border-orange-500/30 p-4 space-y-3">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">¿Falta algún material en tu inventario? Agrégalo aquí:</span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input 
                  type="text" 
                  placeholder="Nombre del perfil (Ej: Viga IPR 4x4, Lámina Cal. 18, etc.)" 
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="sm:col-span-7 bg-zinc-950 border border-zinc-800 text-white text-xs p-2.5 focus:outline-none focus:border-orange-500"
                />
                <input 
                  type="number" 
                  placeholder="Precio por barra de 6m ($ MXN)" 
                  value={nuevoPrecio}
                  onChange={(e) => setNuevoPrecio(e.target.value)}
                  className="sm:col-span-3 bg-zinc-950 border border-zinc-800 text-white text-xs p-2.5 focus:outline-none focus:border-orange-500"
                />
                <button type="submit" className="sm:col-span-2 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase transition flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" /> Guardar
                </button>
              </div>
            </form>

            {/* Lista del Catálogo */}
            <div className="bg-[#0a0a0a] border border-zinc-800 p-6 space-y-3">
              <p className="text-xs text-zinc-400 mb-4">Lista completa de materiales disponibles para tus cotizaciones ({catalogoPrecios.length}):</p>
              
              {catalogoPrecios.map((item) => (
                <div key={item.id} className="bg-zinc-950 border border-zinc-900 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-sm font-bold text-white block">{item.nombre}</span>
                    <span className="text-[10px] text-zinc-500">Barra comercial estándar de {item.barraMetros}m</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {editandoId === item.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500 font-bold">$</span>
                        <input 
                          type="number"
                          value={precioTemporal}
                          onChange={(e) => setPrecioTemporal(Number(e.target.value))}
                          className="bg-zinc-900 border border-orange-500 px-3 py-1 text-white font-bold w-28 text-sm focus:outline-none"
                        />
                        <button 
                          onClick={() => {
                            item.precioBarra = precioTemporal;
                            setEditandoId(null);
                          }}
                          className="bg-orange-500 text-black px-3 py-1 text-xs font-bold"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className="text-base font-bold text-orange-400 font-mono">${item.precioBarra}.00 <span className="text-xs text-zinc-500">MXN</span></span>
                        <button 
                          onClick={() => {
                            setEditandoId(item.id);
                            setPrecioTemporal(item.precioBarra);
                          }}
                          className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-3 py-1.5 flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-orange-500" /> Editar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PASO 4: COTIZACIÓN FINAL DINÁMICA ================= */}
        {paso === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-7 bg-[#0a0a0a] border border-zinc-800 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <span className="text-xs font-bold text-orange-500 tracking-wider uppercase">MATERIALES REQUERIDOS DENTRO DEL PROYECTO</span>
                <button onClick={() => setPaso(3)} className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1 hover:text-white">EDITAR CATÁLOGO</button>
              </div>

              <div className="space-y-2">
                {Object.keys(resumenCompra).length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No has agregado ninguna pieza aún.</p>
                ) : (
                  Object.keys(resumenCompra).map((key) => {
                    const data = resumenCompra[key];
                    return (
                      <div key={key} className="bg-zinc-950 p-3.5 border border-zinc-900 flex justify-between items-center">
                        <div>
                          <span className="block text-xs text-white font-bold">{data.nombre}</span>
                          <span className="text-[10px] text-zinc-500">Cálculo con merma estándar (10%)</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-orange-400 block">{data.barras} BARRAS (6M)</span>
                          <span className="text-[11px] text-zinc-400">${data.subtotal}.00 MXN</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0a0a0a] border-l-2 border-orange-500 p-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-4">TOTALES DEL PROYECTO</span>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-zinc-400 pb-2 border-b border-zinc-900">
                    <span>Costo Materiales Acero:</span>
                    <span className="font-bold text-white">${costoTotalMateriales}.00 MXN</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 block">Mano de Obra & Fabricación:</label>
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-2">
                      <span className="text-orange-500 font-bold text-sm">$</span>
                      <input 
                        type="number"
                        value={manoDeObra}
                        onChange={(e) => setManoDeObra(Number(e.target.value))}
                        className="bg-transparent text-white font-bold w-full text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 space-y-4">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">PRECIO TOTAL AL CLIENTE</span>
                  <span className="text-3xl font-black text-white font-mono tracking-tight">${costoTotalMateriales + manoDeObra}.00 <span className="text-xs text-zinc-500">MXN</span></span>
                </div>

                <button 
                  onClick={() => alert('¡Cotización generada correctamente!')}
                  className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black py-4 transition uppercase text-xs tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                >
                  ENVIAR COTIZACIÓN POR WHATSAPP
                </button>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}