import { useState } from 'react';
import { SueloModel } from '../Model/sueloModel';

export function useLoteController() {
  const [diagnostico, setDiagnostico] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const analizarCoordenadas = async (lat, lon, modo = 'SIEMBRA') => {
    setCargando(true);
    setError(null);
    try {
      const resultado =
        modo === 'COSECHA'
          ? await SueloModel.obtenerDiagnosticoCosecha(lat, lon)
          : await SueloModel.obtenerDiagnosticoSiembra(lat, lon);
      setDiagnostico(resultado);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const analizarUbicacionGPS = (modo = 'SIEMBRA') => {
    if (!navigator.geolocation) {
      setError('Tu teléfono no soporta ubicación GPS.');
      return;
    }

    setCargando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => analizarCoordenadas(pos.coords.latitude, pos.coords.longitude, modo),
      () => {
        setError('No pudimos obtener tu ubicación. Activa el GPS.');
        setCargando(false);
      }
    );
  };

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