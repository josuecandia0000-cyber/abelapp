import React, { useState } from 'react';

export default function PasoCotizacion({ materialesIniciales = [] }) {
  // Estado para manejar los materiales, costos unitarios y mano de obra
  const [items, setItems] = useState(
    materialesIniciales.map(item => ({
      ...item,
      costoUnitario: 0,
      cantidadTotal: item.tramos ? item.tramos.reduce((a, b) => a + b, 0) : (item.cantidad || 1)
    }))
  );

  const [manoObra, setManoObra] = useState({
    descripcion: 'Fabricación e instalación de estructura metálica',
    costo: 0
  });

  const [clienteInfo, setClienteInfo] = useState({
    nombre: 'Cliente General',
    proyecto: 'Estructura Metálica / Herrería',
    fecha: new Date().toLocaleDateString()
  });

  // Actualizar precio unitario de un material
  const handleCambioPrecio = (index, nuevoPrecio) => {
    const nuevosItems = [...items];
    nuevosItems[index].costoUnitario = parseFloat(nuevoPrecio) || 0;
    setItems(nuevosItems);
  };

  // Calcular subtotal de materiales
  const subtotalMateriales = items.reduce((acc, item) => {
    return acc + (item.cantidadTotal * item.costoUnitario);
  }, 0);

  const totalGeneral = subtotalMateriales + (parseFloat(manoObra.costo) || 0);

  // Función para exportar la cotización a PDF
  const generarPDFCotizacion = () => {
    window.print();
  };

  return (
    <div className="bg-zinc-900 text-zinc-100 p-6 rounded-xl border border-zinc-800 shadow-2xl max-w-4xl mx-auto mt-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-orange-500">COTIZACIÓN DE HERRERÍA</h2>
          <p className="text-xs text-zinc-400">Herrería M&V - Panel de Presupuestos</p>
        </div>
        <div className="text-right">
          <input 
            type="text" 
            value={clienteInfo.nombre} 
            onChange={(e) => setClienteInfo({...clienteInfo, nombre: e.target.value})}
            className="bg-zinc-800 text-sm p-1 rounded border border-zinc-700 text-right font-medium text-white"
            placeholder="Nombre del Cliente"
          />
        </div>
      </div>

      {/* Tabla de Materiales y Consumibles */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-xs text-zinc-400 uppercase">
              <th className="py-2 px-3">Tipo</th>
              <th className="py-2 px-3">Perfil / Material / Consumible</th>
              <th className="py-2 px-3 text-center">Cant. / Metros</th>
              <th className="py-2 px-3">Costo Unitario ($)</th>
              <th className="py-2 px-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-sm">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-zinc-800/50">
                <td className="py-3 px-3 uppercase text-xs font-semibold text-orange-400">{item.tipo}</td>
                <td className="py-3 px-3 font-medium">{item.perfil}</td>
                <td className="py-3 px-3 text-center text-zinc-300">
                  {item.cantidadTotal.toFixed(2)} {item.tipo === 'metro' ? 'm' : 'pzas'}
                </td>
                <td className="py-3 px-3">
                  <input 
                    type="number" 
                    value={item.costoUnitario || ''} 
                    onChange={(e) => handleCambioPrecio(index, e.target.value)}
                    placeholder="0.00"
                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 w-28 text-white focus:outline-none focus:border-orange-500"
                  />
                </td>
                <td className="py-3 px-3 text-right font-semibold text-zinc-200">
                  ${(item.cantidadTotal * (item.costoUnitario || 0)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apartado de Mano de Obra */}
      <div className="bg-zinc-800/40 p-4 rounded-lg border border-zinc-800 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-2/3">
          <label className="block text-xs text-zinc-400 mb-1 font-semibold uppercase">Concepto de Mano de Obra</label>
          <input 
            type="text" 
            value={manoObra.descripcion}
            onChange={(e) => setManoObra({...manoObra, descripcion: e.target.value})}
            className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 w-full text-sm text-white"
          />
        </div>
        <div className="w-full sm:w-1/3">
          <label className="block text-xs text-zinc-400 mb-1 font-semibold uppercase">Costo Total Mano de Obra ($)</label>
          <input 
            type="number" 
            value={manoObra.costo || ''}
            onChange={(e) => setManoObra({...manoObra, costo: e.target.value})}
            placeholder="0.00"
            className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 w-full text-sm text-white font-bold text-orange-400"
          />
        </div>
      </div>

      {/* Totales y Botón de PDF */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-zinc-800 pt-6 gap-4">
        <div className="text-zinc-400 text-sm">
          <p>Subtotal Materiales: <span className="text-white font-medium">${subtotalMateriales.toFixed(2)}</span></p>
          <p>Mano de Obra: <span className="text-white font-medium">${(parseFloat(manoObra.costo) || 0).toFixed(2)}</span></p>
          <p className="text-lg font-bold text-white mt-1">Total General: <span className="text-orange-500">${totalGeneral.toFixed(2)} MXN</span></p>
        </div>

        <button 
          onClick={generarPDFCotizacion}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition duration-200 flex items-center gap-2 cursor-pointer"
        >
          <span>Generar PDF para Cliente</span>
        </button>
      </div>
    </div>
  );
}