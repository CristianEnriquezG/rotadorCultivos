import { useEffect, useMemo, useRef, useState } from "react";
import { SueloModel } from "../Model/sueloModel";
import { RotacionModel } from "../Model/rotacionModel";
import {
  TEXTOS,
  traducirTextoDinamico,
  traducirContextoClimatico,
} from "../Model/textosIdioma";
import { ApiGeo } from "./ApiGeo";
import { obtenerHistorialNasa } from "./apiNasa";

const ANIO_INICIO_NASA = 2015;
const ANIO_FIN_NASA = 2025;

export function useLoteController({ idioma = "es" } = {}) {
  const [coordenadas, setCoordenadas] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [ubicacionNoDeterminada, setUbicacionNoDeterminada] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [diagnostico, setDiagnostico] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [usarHumedadManual, setUsarHumedadManual] = useState(false);
  const [humedadManual, setHumedadManual] = useState({
    arriba: "",
    abajo: "",
    fecha: fechaLocalParaInput(),
    metodo: "sensor",
  });

  // Audio: qué se está leyendo ("diagnostico" | "rotacion" | null)
  const [audioActivo, setAudioActivo] = useState(null);
  const vozActualRef = useRef(null);

  // Cada vez que se reinicia el lote cambia la "sesión". Las respuestas de GPS,
  // geocodificación o análisis que lleguen de una sesión anterior se descartan,
  // así una posición vieja nunca pisa a la nueva.
  const sesionRef = useRef(0);

  // --- Rotación de cultivos ---
  const [cultivoAnterior, setCultivoAnterior] = useState("soja");

  // Se recalcula cada vez que cambia el cultivo anterior o llega un diagnóstico nuevo
  // (así la recomendación se ajusta a la humedad real medida en el lote).
  const evaluacionRotacion = useMemo(
    () => RotacionModel.evaluarRotacion(cultivoAnterior, diagnostico, idioma),
    [cultivoAnterior, diagnostico, idioma],
  );

  const esUbicacionValida = (coords) => {
    const { latitude, longitude, accuracy } = coords;
    const dentroDeArgentina =
      latitude <= -21 &&
      latitude >= -56 &&
      longitude <= -53 &&
      longitude >= -74;

    return dentroDeArgentina && accuracy < 50000;
  };

  const fijarUbicacion = async (lat, lon) => {
    const sesion = sesionRef.current;
    setCoordenadas({ lat, lon });
    setUbicacionNoDeterminada(false);
    setError(null);

    const lugar = await ApiGeo.obtenerNombreLugar(lat, lon);
    if (sesion !== sesionRef.current) return; // llegó tarde: el lote ya se reinició
    setUbicacion(lugar);
  };

  const detectarGPSNavegador = () => {
    const sesion = sesionRef.current;

    if (!navigator.geolocation) {
      setUbicacionNoDeterminada(true);
      setMostrarMapa(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (sesion !== sesionRef.current) return;

        if (esUbicacionValida(pos.coords)) {
          await fijarUbicacion(pos.coords.latitude, pos.coords.longitude);
          setMostrarMapa(false);
          return;
        }

        setUbicacion(null);
        setCoordenadas(null);
        setUbicacionNoDeterminada(true);
        setMostrarMapa(true);
      },
      () => {
        if (sesion !== sesionRef.current) return;
        setUbicacion(null);
        setCoordenadas(null);
        setUbicacionNoDeterminada(true);
        setMostrarMapa(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 0,
      },
    );
  };

  /**
   * Arranca un lote desde cero: borra la posición, el diagnóstico y la
   * medición manual anteriores, y vuelve a pedir la ubicación.
   * Se llama cada vez que el usuario elige "Medición aproximada" o
   * "Medición con instrumentos" en la pantalla de inicio.
   */
  const iniciarNuevoLote = ({ manual = false } = {}) => {
    sesionRef.current += 1;
    detenerAudio();

    setUsarHumedadManual(manual);
    setCoordenadas(null);
    setUbicacion(null);
    setUbicacionNoDeterminada(false);
    setMostrarMapa(false);
    setDiagnostico(null);
    setCargando(false);
    setError(null);
    setHumedadManual({
      arriba: "",
      abajo: "",
      fecha: fechaLocalParaInput(),
      metodo: "sensor",
    });

    detectarGPSNavegador();
  };

  // Corta cualquier lectura en curso si el componente se desmonta
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const seleccionarUbicacionManual = async (lat, lon) => {
    await fijarUbicacion(lat, lon);
    setDiagnostico(null);
  };

  const actualizarHumedadManual = (campo, valor) => {
    setHumedadManual((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const cambiarCultivoAnterior = (id) => {
    setCultivoAnterior(id);
  };

  const analizarLote = async (modo = "SIEMBRA") => {
    if (!coordenadas) {
      setUbicacionNoDeterminada(true);
      setMostrarMapa(true);
      setError(
        "Ubicación no determinada. Por favor seleccioná tu lote en el mapa.",
      );
      return;
    }

    const sesion = sesionRef.current;
    setCargando(true);
    setError(null);

    try {
      const medicionManual = usarHumedadManual
        ? validarHumedadManual(humedadManual)
        : null;

      const consultaSuelo =
        modo === "COSECHA"
          ? SueloModel.obtenerDiagnosticoCosecha(
              coordenadas.lat,
              coordenadas.lon,
            )
          : SueloModel.obtenerDiagnosticoSiembra(
              coordenadas.lat,
              coordenadas.lon,
            );

      const consultaNasa = obtenerHistorialNasa({
        latitud: coordenadas.lat,
        longitud: coordenadas.lon,
        anioInicio: ANIO_INICIO_NASA,
        anioFin: ANIO_FIN_NASA,
        usarCache: true,
      });

      const [resultadoSuelo, resultadoNasa] = await Promise.allSettled([
        consultaSuelo,
        consultaNasa,
      ]);

      if (resultadoSuelo.status === "rejected" && !medicionManual) {
        throw new Error(
          resultadoSuelo.reason?.message ||
            "No fue posible obtener la humedad actual del suelo.",
        );
      }

      const diagnosticoBase =
        resultadoSuelo.status === "fulfilled" ? resultadoSuelo.value : null;
      const nasa =
        resultadoNasa.status === "fulfilled" ? resultadoNasa.value : null;

      const resultadoIntegrado = integrarDiagnostico({
        diagnosticoBase,
        nasa,
        medicionManual,
        modo,
        errorSuelo:
          resultadoSuelo.status === "rejected"
            ? resultadoSuelo.reason?.message
            : null,
        errorNasa:
          resultadoNasa.status === "rejected"
            ? resultadoNasa.reason?.message
            : null,
      });

      if (sesion !== sesionRef.current) return;
      setDiagnostico(resultadoIntegrado);
    } catch (err) {
      if (sesion !== sesionRef.current) return;
      setError(err.message);
    } finally {
      if (sesion === sesionRef.current) setCargando(false);
    }
  };

  const detenerAudio = () => {
    vozActualRef.current = null;
    window.speechSynthesis?.cancel();
    setAudioActivo(null);
  };

  const hablar = (texto, origen) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = idioma === "en" ? "en-US" : "es-AR";

    // Al cancelar una lectura, el navegador dispara "end" de la anterior;
    // solo se limpia el estado si terminó la lectura que sigue vigente.
    const alTerminar = () => {
      if (vozActualRef.current === voz) {
        vozActualRef.current = null;
        setAudioActivo(null);
      }
    };
    voz.onend = alTerminar;
    voz.onerror = alTerminar;

    vozActualRef.current = voz;
    setAudioActivo(origen);
    window.speechSynthesis.speak(voz);
  };

  const reproducirAudio = () => {
    if (!diagnostico) return;

    const t = TEXTOS[idioma] ?? TEXTOS.es;

    const textoLugar = ubicacion
      ? `${t.ubicacionAudio}: ${traducirTextoDinamico(ubicacion.nombreCorto, idioma)}. `
      : "";

    const contexto = diagnostico.contextoClimatico?.explicacion
      ? ` ${traducirContextoClimatico(diagnostico.contextoClimatico.explicacion, idioma)}`
      : "";

    const titulo = traducirTextoDinamico(diagnostico.titulo, idioma);
    const mensaje = traducirTextoDinamico(diagnostico.mensaje, idioma);

    hablar(`${textoLugar}${titulo}. ${mensaje}${contexto}`, "diagnostico");
  };

  const reproducirAudioRotacion = () => {
    if (!evaluacionRotacion) return;

    const r = evaluacionRotacion;
    const alerta = r.alertaNitrato ? ` ${r.alertaNitrato}` : "";

    const texto =
      idioma === "en"
        ? `Previous crop: ${r.nombreAnterior}. ` +
          `Estimated field wear: ${r.desgastePorcentaje} percent. ` +
          `${r.resumenDesgaste}${alerta} ` +
          `${r.condicionHidricaTexto}. ` +
          `Recommended next crop: ${r.recomendacion.cultivo}. ${r.recomendacion.motivo}`
        : `Cultivo anterior: ${r.nombreAnterior}. ` +
          `Desgaste estimado del lote: ${r.desgastePorcentaje} por ciento. ` +
          `${r.resumenDesgaste}${alerta} ` +
          `${r.condicionHidricaTexto}. ` +
          `Se recomienda sembrar ${r.recomendacion.cultivo}. ${r.recomendacion.motivo}`;

    hablar(texto, "rotacion");
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
    usarHumedadManual,
    setUsarHumedadManual,
    humedadManual,
    actualizarHumedadManual,
    // Rotación
    cultivoAnterior,
    cambiarCultivoAnterior,
    evaluacionRotacion,
    reproducirAudioRotacion,
    // Audio
    audioActivo,
    detenerAudio,
    // Reinicio de lote
    iniciarNuevoLote,
  };
}

function integrarDiagnostico({
  diagnosticoBase,
  nasa,
  medicionManual,
  modo,
  errorSuelo,
  errorNasa,
}) {
  const mesActual = new Date().getMonth() + 1;
  const climaMes =
    nasa?.resumenMensual?.find((mes) => mes.numero === mesActual) ?? null;

  const humedadElegida = medicionManual
    ? {
        arriba: medicionManual.arriba,
        abajo: medicionManual.abajo,
        fuente: `Medición manual (${medicionManual.metodo})`,
        fecha: medicionManual.fecha,
      }
    : extraerHumedadDiagnostico(diagnosticoBase);

  const evaluacionManual = medicionManual
    ? evaluarHumedadManual(medicionManual, modo)
    : null;

  const base = evaluacionManual
    ? {
        ...(diagnosticoBase ?? {}),
        ...evaluacionManual,
      }
    : diagnosticoBase ?? {
        tipo: "SIN_DATOS",
        titulo: "Análisis incompleto",
        mensaje: "No se obtuvo una medición válida de humedad del suelo.",
      };

  const alertasClimaticas = [];

  if (climaMes?.temperaturaMaximaMediaC >= 35) {
    alertasClimaticas.push(
      "Históricamente, este mes presenta temperaturas máximas elevadas.",
    );
  }

  if (
    Number.isFinite(climaMes?.precipitacionMediaMensualMm) &&
    climaMes.precipitacionMediaMensualMm < 30
  ) {
    alertasClimaticas.push(
      "Históricamente, este mes presenta precipitaciones bajas.",
    );
  }

  const explicacionClimatica = nasa
    ? construirExplicacionClimatica(climaMes, nasa.resumen)
    : "No se pudo incorporar el historial climático de NASA POWER.";

  return {
    ...base,
    humedadUtilizada: humedadElegida,
    contextoClimatico: {
      disponible: Boolean(nasa),
      periodo: nasa ? `${ANIO_INICIO_NASA}-${ANIO_FIN_NASA}` : null,
      mes: climaMes?.nombre ?? null,
      precipitacionMediaMensualMm:
        climaMes?.precipitacionMediaMensualMm ?? null,
      temperaturaMediaC: climaMes?.temperaturaMediaC ?? null,
      temperaturaMaximaMediaC: climaMes?.temperaturaMaximaMediaC ?? null,
      rachaSecaMaximaDias: nasa?.resumen?.rachaSecaMaximaDias ?? null,
      alertas: alertasClimaticas,
      explicacion: explicacionClimatica,
      fuente: nasa ? "NASA POWER" : null,
    },
    fuentes: [
      ...(humedadElegida?.fuente ? [humedadElegida.fuente] : []),
      ...(nasa ? ["NASA POWER"] : []),
    ],
    advertencias: [
      ...(errorSuelo ? [`Humedad satelital: ${errorSuelo}`] : []),
      ...(errorNasa ? [`NASA POWER: ${errorNasa}`] : []),
      ...alertasClimaticas,
    ],
  };
}

function extraerHumedadDiagnostico(diagnostico) {
  if (!diagnostico) return null;

  const arriba = primerNumeroValido([
    diagnostico.humedadUtilizada?.arriba,
    diagnostico.humedadArriba,
    diagnostico.humedadSuperficial,
    diagnostico.arriba,
    diagnostico.datos?.humedadArriba,
    diagnostico.datos?.humedadSuperficial,
  ]);

  const abajo = primerNumeroValido([
    diagnostico.humedadUtilizada?.abajo,
    diagnostico.humedadAbajo,
    diagnostico.humedadProfunda,
    diagnostico.abajo,
    diagnostico.datos?.humedadAbajo,
    diagnostico.datos?.humedadProfunda,
  ]);

  const fuente = diagnostico.humedadUtilizada?.fuente ?? "OpenWeather";

  if (arriba === null && abajo === null) {
    return {
      arriba: null,
      abajo: null,
      fuente,
      fecha: null,
    };
  }

  return {
    arriba,
    abajo,
    fuente,
    fecha: diagnostico.fecha ?? null,
  };
}

function primerNumeroValido(valores) {
  for (const valor of valores) {
    if (valor === null || valor === undefined || valor === "") continue;

    const numero = Number(valor);

    if (Number.isFinite(numero) && numero !== -999) {
      return numero;
    }
  }

  return null;
}

function validarHumedadManual(medicion) {
  const arriba = Number(medicion.arriba);
  const abajo = Number(medicion.abajo);

  if (!Number.isFinite(arriba) || arriba < 0 || arriba > 100) {
    throw new Error("La humedad superficial debe estar entre 0 y 100 %.");
  }

  if (!Number.isFinite(abajo) || abajo < 0 || abajo > 100) {
    throw new Error("La humedad profunda debe estar entre 0 y 100 %.");
  }

  const fecha = new Date(medicion.fecha);

  if (Number.isNaN(fecha.getTime())) {
    throw new Error("La fecha de la medición manual no es válida.");
  }

  if (fecha.getTime() > Date.now()) {
    throw new Error("La fecha de la medición no puede ser futura.");
  }

  return {
    arriba,
    abajo,
    fecha: fecha.toISOString(),
    metodo: medicion.metodo,
  };
}

function evaluarHumedadManual(medicion, modo) {
  const promedio = (medicion.arriba + medicion.abajo) / 2;

  if (promedio < 20) {
    return {
      tipo: "SECO",
      semaforo: "ROJO",
      color: "#d32f2f",
      titulo:
        modo === "COSECHA"
          ? "Humedad baja: revisar antes de cosechar"
          : "Suelo seco: no arriesgar semilla",
      mensaje: `Medición manual baja (${medicion.arriba.toFixed(1)}% arriba y ${medicion.abajo.toFixed(1)}% abajo).`,
    };
  }

  if (promedio <= 60) {
    return {
      tipo: "FAVORABLE",
      semaforo: "VERDE",
      color: "#2e7d32",
      titulo:
        modo === "COSECHA"
          ? "Humedad intermedia: verificar el cultivo"
          : "Humedad compatible con una evaluación favorable",
      mensaje: `Medición manual intermedia (${medicion.arriba.toFixed(1)}% arriba y ${medicion.abajo.toFixed(1)}% abajo).`,
    };
  }

  return {
    tipo: "HUMEDO",
    semaforo: "AMARILLO",
    color: "#b45309",
    titulo:
      modo === "COSECHA"
        ? "Humedad elevada: posponer la cosecha"
        : "Humedad elevada: revisar drenaje y pronóstico",
    mensaje: `Medición manual elevada (${medicion.arriba.toFixed(1)}% arriba y ${medicion.abajo.toFixed(1)}% abajo).`,
  };
}

function construirExplicacionClimatica(climaMes, resumen) {
  if (!climaMes) {
    return "NASA POWER no devolvió información histórica para el mes actual.";
  }

  const lluvia = Number.isFinite(climaMes.precipitacionMediaMensualMm)
    ? `${climaMes.precipitacionMediaMensualMm.toFixed(1)} mm de precipitación media`
    : "precipitación media no disponible";

  const temperatura = Number.isFinite(climaMes.temperaturaMaximaMediaC)
    ? `${climaMes.temperaturaMaximaMediaC.toFixed(1)} °C de temperatura máxima media`
    : "temperatura máxima media no disponible";

  const racha = Number.isFinite(resumen?.rachaSecaMaximaDias)
    ? ` La mayor racha seca del período fue de ${resumen.rachaSecaMaximaDias} días.`
    : "";

  return `${climaMes.nombre}: ${lluvia} y ${temperatura}.${racha}`;
}

function fechaLocalParaInput() {
  const ahora = new Date();
  const desfase = ahora.getTimezoneOffset() * 60000;
  return new Date(ahora.getTime() - desfase).toISOString().slice(0, 16);
}