import { supabase } from '@/lib/supabase';

export async function obtenerMateriales() {
  const { data, error } = await supabase
    .from('materiales')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error obteniendo materiales:', error);
    return [];
  }
  return data;
}

export async function agregarMaterial(nombre, barraMetros = 6.0, precioBarra, unidadMedida = 'metro') {
  const { data, error } = await supabase
    .from('materiales')
    .insert([
      { 
        nombre, 
        barra_metros: parseFloat(barraMetros), 
        precio_barra: parseFloat(precioBarra),
        unidad_medida: unidadMedida 
      }
    ])
    .select();

  if (error) {
    console.error('Error al agregar material:', error);
    return null;
  }
  return data[0];
}