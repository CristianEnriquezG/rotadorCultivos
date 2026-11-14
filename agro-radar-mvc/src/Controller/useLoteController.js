import { useState, useEffect } from 'react';
import { SueloModel } from '../Model/sueloModel';
import { ApiGeo } from './ApiGeo';

export function useLoteController() {
  const [coordenadas, setCoordenadas] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [ubicacionNoDeterminada, setUbicacionNoDeterminada] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [diagnostico, setDiagnostico] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Verifica si la coordenada viene de un GPS real o si falló por IP (ej. Ohio en PC)
  const esUbicacionValida = (coords) => {
    const { latitude, longitude, accuracy } = coords;
    const dentroDeRegion =
      latitude <= -21 && latitude >= -56 && longitude <= -53 && longitude >= -74;
    // Si está fuera del país o el margen de error supera 50 km, la ubicación del navegador no es confiable
    return dentroDeRegion && accuracy < 50000;
  };

  const fijarUbicacion = async (lat, lon) => {
    setCoordenadas({ lat, lon });
    setUbicacionNoDeterminada(false);
    setError(null);
    const lugar = await ApiGeo.obtenerNombreLugar(lat, lon);
    setUbicacion(lugar);
  };

  const detectarGPSNavegador = () => {
    if (!navigator.geolocation) {
      setUbicacionNoDeterminada(true);
      setMostrarMapa(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (esUbicacionValida(pos.coords)) {
          await fijarUbicacion(pos.coords.latitude, pos.coords.longitude);
          setMostrarMapa(false);
        } else {
          // El navegador devolvió una IP lejana (ej. Ohio) en vez de GPS real
          setUbicacion(null);
          setCoordenadas(null);
          setUbicacionNoDeterminada(true);
          setMostrarMapa(true);
        }
      },
      () => {
        // Error de hardware GPS o permiso denegado
        setUbicacion(null);
        setCoordenadas(null);
        setUbicacionNoDeterminada(true);
        setMostrarMapa(true);
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    detectarGPSNavegador();
  }, []);

  // Cuando el usuario selecciona manualmente su lote en el mapa
  const seleccionarUbicacionManual = async (lat, lon) => {
    await fijarUbicacion(lat, lon);
    setDiagnostico(null);
  };

  const analizarLote = async (modo = 'SIEMBRA') => {
    if (!coordenadas) {
      setUbicacionNoDeterminada(true);
      setMostrarMapa(true);
      setError('Ubicación no determinada. Por favor seleccioná tu lote en el mapa.');
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const resultado =
        modo === 'COSECHA'
          ? await SueloModel.obtenerDiagnosticoCosecha(coordenadas.lat, coordenadas.lon)
          : await SueloModel.obtenerDiagnosticoSiembra(coordenadas.lat, coordenadas.lon);
      setDiagnostico(resultado);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const reproducirAudio = () => {
    if (!diagnostico || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const textoLugar = ubicacion ? `Ubicación: ${ubicacion.nombreCorto}. ` : '';
    const voz = new SpeechSynthesisUtterance(
      `${textoLugar}${diagnostico.titulo}. ${diagnostico.mensaje}`
    );
    voz.lang = 'es-AR';
    window.speechSynthesis.speak(voz);
  };

  return {
    ubicacion,
    ubicacionNoDeterminada,
    mostrarMapa,
    setMostrarMapa,
    diagnostico,
    cargando,
    error,
    detectarGPSNavegador,
    seleccionarUbicacionManual,
    analizarLote,
    reproducirAudio,
  };
}