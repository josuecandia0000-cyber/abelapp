'use client';

export default function PasoDespiece({ datosExtraidos, catalogoSupabase }) {
  if (!datosExtraidos || datosExtraidos.length === 0) return null;

  // Algoritmo de optimización de corte lineal para perfiles
  const calcularOptimizacion = (tramos) => {
    const BARRA_LARGO = 6.0;
    let barras = [];
    const tramosOrdenados = [...tramos].sort((a, b) => b - a);

    tramosOrdenados.forEach((tramo) => {
      let ubicado = false;
      for (let i = 0; i < barras.length; i++) {
        const sumaActual = barras[i].reduce((acc, val) => acc + val, 0);
        if (sumaActual + tramo <= BARRA_LARGO) {
          barras[i].push(tramo);
          ubicado = true;
          break;
        }
      }
      if (!ubicado) {
        barras.push([tramo]);
      }
    });

    return barras;
  };

  // Calcular Gran Total de la cotización completa
  let granTotal = 0;

  return (
    <div className="relative overflow-hidden bg-[#070707] text-zinc-100 p-4 sm:p-6 md:p-8 rounded-2xl border border-orange-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl mb-8">
      <div className="absolute -top-24 -left-24 w-72 md:w-96 h-72 md:h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-zinc-800">
          <div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Módulo 03 // Universal Parsing & Despiece Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
              Desglose de Materiales & Insumos
            </h2>
          </div>
          <div className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg self-start md:self-auto">
            STATUS: AI MULTI-ITEM MATCHED
          </div>
        </div>

        {/* Listado Dinámico de Materiales */}
        <div className="space-y-6">
          {datosExtraidos.map((item, idx) => {
            const matInfo = catalogoSupabase?.find(
              (m) => m.nombre.toLowerCase().trim() === item.perfil.toLowerCase().trim()
            );
            const precioUnitario = matInfo ? Number(matInfo.precio_barra) : 0;
            const esPerfilMetro = item.tipo === 'metro' || item.tramos;

            let subtotal = 0;
            let barrasOptimizadas = [];

            if (esPerfilMetro) {
              barrasOptimizadas = calcularOptimizacion(item.tramos || []);
              subtotal = barrasOptimizadas.length * precioUnitario;
            } else {
              subtotal = (item.cantidad || 1) * precioUnitario;
            }

            granTotal += subtotal;

            return (
              <div 
                key={idx} 
                className="bg-zinc-900/60 border border-zinc-800/80 p-4 sm:p-6 rounded-xl backdrop-blur-md"
              >
                {/* Cabecera del Ítem */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500 font-mono text-xs font-bold">#{idx + 1}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {esPerfilMetro ? 'PERFIL / CORTE LINEAL' : 'ACCESORIO / PIEZA'}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                      {item.perfil}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right font-mono mt-2 sm:mt-0">
                    <span className="text-[11px] text-zinc-500 block uppercase">
                      {esPerfilMetro ? 'Barras Requeridas (6m)' : 'Cantidad Requerida'}
                    </span>
                    <span className="text-lg font-black text-orange-400">
                      {esPerfilMetro ? `${barrasOptimizadas.length} barras` : `${item.cantidad} unidades`}
                    </span>
                  </div>
                </div>

                {/* Render Condicional: Esquema de Cortes para Metros vs Info para Piezas */}
                {esPerfilMetro ? (
                  <div className="space-y-3 my-4">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Esquema de aprovechamiento por barra (6.00m):
                    </span>
                    
                    {barrasOptimizadas.map((barra, bIdx) => {
                      const ocupado = barra.reduce((a, b) => a + b, 0);
                      const sobrante = (6.0 - ocupado).toFixed(2);

                      return (
                        <div key={bIdx} className="bg-black/60 p-3 rounded-lg border border-zinc-800/80">
                          <div className="flex justify-between items-center text-xs font-mono mb-2 text-zinc-400">
                            <span>Barra #{bIdx + 1}</span>
                            <span className={sobrante > 0 ? "text-amber-500/90" : "text-emerald-400"}>
                              Sobrante / Scrap: {sobrante}m
                            </span>
                          </div>

                          <div className="w-full h-7 bg-zinc-800 rounded-md overflow-hidden flex gap-0.5 p-0.5">
                            {barra.map((tramo, tIdx) => {
                              const porcentaje = (tramo / 6.0) * 100;
                              return (
                                <div
                                  key={tIdx}
                                  style={{ width: `${porcentaje}%` }}
                                  className="h-full bg-gradient-to-r from-orange-600 to-amber-500 flex items-center justify-center text-[10px] font-mono font-bold text-black truncate px-1"
                                >
                                  {tramo}m
                                </div>
                              );
                            })}
                            {sobrante > 0 && (
                              <div
                                style={{ width: `${(sobrante / 6.0) * 100}%` }}
                                className="h-full bg-zinc-900 border border-dashed border-zinc-700 flex items-center justify-center text-[10px] font-mono text-zinc-600 truncate"
                              >
                                {sobrante}m
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="my-4 p-4 bg-black/40 rounded-lg border border-zinc-800/60 font-mono text-xs text-zinc-400 flex justify-between items-center">
                    <span>Insumo por unidad de catálogo</span>
                    <span className="text-zinc-200">{item.cantidad} x ${precioUnitario.toLocaleString('es-MX')} MXN</span>
                  </div>
                )}

                {/* Subtotal del Ítem */}
                <div className="flex justify-between items-center pt-3 border-t border-zinc-800/60 font-mono text-xs sm:text-sm">
                  <span className="text-zinc-400">
                    Precio Catálogo: ${precioUnitario.toLocaleString('es-MX')} MXN
                  </span>
                  <span className="font-bold text-white">
                    Subtotal: <span className="text-orange-400">${subtotal.toLocaleString('es-MX')} MXN</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen Total Financiero de la Cotización */}
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-950/40 via-zinc-900 to-zinc-950 rounded-xl border border-orange-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-orange-400 uppercase tracking-widest block">
              TOTAL ESTIMADO DE MATERIALES & INSUMOS
            </span>
            <p className="text-xs text-zinc-500 mt-0.5">
              Cruzado contra precios de catálogo en Supabase
            </p>
          </div>
          <div className="text-left sm:text-right font-mono">
            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
              ${granTotal.toLocaleString('es-MX')} <span className="text-sm font-normal text-zinc-400">MXN</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}