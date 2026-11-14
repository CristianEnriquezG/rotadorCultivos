import { useState, useEffect } from 'react';
import { SueloModel } from '../Model/sueloModel';
import { ApiGeo } from './ApiGeo';

// Coordenada de respaldo en Santiago del Estero cuando la PC no tiene chip GPS físico
const LAT_DEFAULT_SDE = -27.7834;
const LON_DEFAULT_SDE = -64.2642;

function normalizarCoordenadas(lat, lon) {
  // Si la PC devuelve hemisferio norte (lat > 0, ej. Ohio) por falta de GPS físico, usamos Sgo. del Estero
  if (lat > -20 || lat < -56 || lon > -53 || lon < -74) {
    return { lat: LAT_DEFAULT_SDE, lon: LON_DEFAULT_SDE };
  }
  return { lat, lon };
}

export function useLoteController() {
  const [diagnostico, setDiagnostico] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { lat, lon } = normalizarCoordenadas(
          pos.coords.latitude,
          pos.coords.longitude
        );
        const lugar = await ApiGeo.obtenerNombreLugar(lat, lon);
        setUbicacion(lugar);
      },
      async () => {
        const lugar = await ApiGeo.obtenerNombreLugar(LAT_DEFAULT_SDE, LON_DEFAULT_SDE);
        setUbicacion(lugar);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const analizarUbicacionGPS = (modo = 'SIEMBRA') => {
    setCargando(true);
    setError(null);

    const ejecutarAnalisis = async (latCruda, lonCruda) => {
      try {
        const { lat, lon } = normalizarCoordenadas(latCruda, lonCruda);

        const [resultadoSuelo, datosLugar] = await Promise.all([
          modo === 'COSECHA'
            ? SueloModel.obtenerDiagnosticoCosecha(lat, lon)
            : SueloModel.obtenerDiagnosticoSiembra(lat, lon),
          ApiGeo.obtenerNombreLugar(lat, lon),
        ]);

        setUbicacion(datosLugar);
        setDiagnostico(resultadoSuelo);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    if (!navigator.geolocation) {
      ejecutarAnalisis(LAT_DEFAULT_SDE, LON_DEFAULT_SDE);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => ejecutarAnalisis(pos.coords.latitude, pos.coords.longitude),
      () => ejecutarAnalisis(LAT_DEFAULT_SDE, LON_DEFAULT_SDE),
      { enableHighAccuracy: true }
    );
  };

  const reproducirAudio = () => {
    if (!diagnostico || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const textoLugar = ubicacion ? `Estás en ${ubicacion.nombreCorto}. ` : '';
    const voz = new SpeechSynthesisUtterance(
      `${textoLugar}${diagnostico.titulo}. ${diagnostico.mensaje}`
    );
    voz.lang = 'es-AR';
    window.speechSynthesis.speak(voz);
  };

  return {
    diagnostico,
    ubicacion,
    cargando,
    error,
    analizarUbicacionGPS,
    reproducirAudio,
  };
}