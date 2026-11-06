export async function analizarPlanoConIA(file) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Falta la API Key de Gemini en las variables de entorno.");
      return null;
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Data = btoa(binary);

    const promptText = `
      Eres un experto analista de planos de herrería y construcción industrial. 
      Analiza este plano o imagen técnica y extrae TODOS los materiales, perfiles estructurales, láminas o accesorios requeridos.
      
      Devuelve estrictamente un arreglo JSON válido (sin texto adicional ni bloques markdown) con este formato exacto:
      [
        {
          "tipo": "metro",
          "perfil": "Nombre exacto del material",
          "tramos": [2.10, 1.50]
        },
        {
          "tipo": "pieza",
          "perfil": "Nombre del accesorio",
          "cantidad": 8
        }
      ]
    `;

    const body = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: file.type || 'application/pdf',
                data: base64Data
              }
            },
            {
              text: promptText
            }
          ]
        }
      ]
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    let response = null;
    let intentos = 3;

    // Bucle de reintentos por si el servidor presenta saturación temporal (503)
    for (let i = 0; i < intentos; i++) {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) break;

      console.warn(`Intento ${i + 1} falló por alta demanda, reintentando en 1 segundo...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!response || !response.ok) {
      console.error("El servidor sigue saturado tras los reintentos. Intenta de nuevo en unos segundos.");
      return null;
    }

    const data = await response.json();
    const textoRespuesta = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textoRespuesta) {
      console.error("La IA no devolvió texto.");
      return null;
    }

    console.log("Respuesta exitosa de la IA:", textoRespuesta);

    let jsonLimpiado = textoRespuesta.replace(/```json/g, '').replace(/```/g, '').trim();
    const primerCorchete = jsonLimpiado.indexOf('[');
    const ultimoCorchete = jsonLimpiado.lastIndexOf(']');
    if (primerCorchete !== -1 && ultimoCorchete !== -1) {
      jsonLimpiado = jsonLimpiado.substring(primerCorchete, ultimoCorchete + 1);
    }

    return JSON.parse(jsonLimpiado);

  } catch (error) {
    console.error('Error detallado al analizar el plano con la IA:', error);
    return null;
  }
}