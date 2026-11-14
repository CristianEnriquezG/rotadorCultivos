import { useState } from 'react';
import { SueloModel } from '../models/SueloModel';

export function useLoteController() {
  const [diagnostico, setDiagnostico] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Acción 1: Analizar coordenadas específicas (ej. Fernández, Santiago del Estero)
  const analizarCoordenadas = async (lat, lon) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await SueloModel.obtenerDiagnostico(lat, lon);
      setDiagnostico(resultado);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Acción 2: Usar el GPS real del celular del productor en el campo
  const analizarUbicacionGPS = () => {
    if (!navigator.geolocation) {
      setError('Tu teléfono no soporta ubicación GPS.');
      return;
    }

    setCargando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => analizarCoordenadas(pos.coords.latitude, pos.coords.longitude),
      () => {
        setError('No pudimos obtener tu ubicación. Activa el GPS del teléfono.');
        setCargando(false);
      }
    );
  };

  // Acción 3: Leer la recomendación en voz alta
  const reproducirAudio = () => {
    if (!diagnostico || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(
      `${diagnostico.titulo}. ${diagnostico.mensaje}`
    );
    voz.lang = 'es-AR';
    window.speechSynthesis.speak(voz);
  };

  return {
    diagnostico,
    cargando,
    error,
    analizarCoordenadas,
    analizarUbicacionGPS,
    reproducirAudio,
  };
}