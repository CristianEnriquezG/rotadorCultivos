import { useEffect, useState } from "react";
import { SueloModel } from "../Model/sueloModel";
import { ApiGeo } from "./ApiGeo";
import { obtenerHistorialNasa } from "./apiNasa";

const ANIO_INICIO_NASA = 2015;
const ANIO_FIN_NASA = 2025;

export function useLoteController() {
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
          return;
        }

        setUbicacion(null);
        setCoordenadas(null);
        setUbicacionNoDeterminada(true);
        setMostrarMapa(true);
      },
      () => {
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

  useEffect(() => {
    detectarGPSNavegador();
  }, []);

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

  const analizarLote = async (modo = "SIEMBRA") => {
    if (!coordenadas) {
      setUbicacionNoDeterminada(true);
      setMostrarMapa(true);
      setError(
        "Ubicación no determinada. Por favor seleccioná tu lote en el mapa.",
      );
      return;
    }

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

      setDiagnostico(resultadoIntegrado);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const reproducirAudio = () => {
    if (!diagnostico || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const textoLugar = ubicacion
      ? `Ubicación: ${ubicacion.nombreCorto}. `
      : "";

    const contexto = diagnostico.contextoClimatico?.explicacion
      ? ` ${diagnostico.contextoClimatico.explicacion}`
      : "";

    const voz = new SpeechSynthesisUtterance(
      `${textoLugar}${diagnostico.titulo}. ${diagnostico.mensaje}.${contexto}`,
    );

    voz.lang = "es-AR";
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
    usarHumedadManual,
    setUsarHumedadManual,
    humedadManual,
    actualizarHumedadManual,
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
    diagnostico.humedadArriba,
    diagnostico.humedadSuperficial,
    diagnostico.arriba,
    diagnostico.datos?.humedadArriba,
    diagnostico.datos?.humedadSuperficial,
  ]);

  const abajo = primerNumeroValido([
    diagnostico.humedadAbajo,
    diagnostico.humedadProfunda,
    diagnostico.abajo,
    diagnostico.datos?.humedadAbajo,
    diagnostico.datos?.humedadProfunda,
  ]);

  if (arriba === null && abajo === null) {
    return {
      arriba: null,
      abajo: null,
      fuente: "CONAE",
      fecha: null,
    };
  }

  return {
    arriba,
    abajo,
    fuente: "CONAE",
    fecha: diagnostico.fecha ?? null,
  };
}

function primerNumeroValido(valores) {
  for (const valor of valores) {
    const numero = Number(valor);

    if (valor !== "" && Number.isFinite(numero) && numero !== -999) {
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
      titulo:
        modo === "COSECHA"
          ? "Humedad intermedia: verificar el cultivo"
          : "Humedad compatible con una evaluación favorable",
      mensaje: `Medición manual intermedia (${medicion.arriba.toFixed(1)}% arriba y ${medicion.abajo.toFixed(1)}% abajo).`,
    };
  }

  return {
    tipo: "HUMEDO",
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
