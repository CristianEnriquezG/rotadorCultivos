const URL_NASA_POWER =
  "https://power.larc.nasa.gov/api/temporal/daily/point";

const PARAMETROS_NASA = [
  "PRECTOTCORR",
  "T2M",
  "T2M_MAX",
  "T2M_MIN",
  "RH2M",
  "WS2M",
  "ALLSKY_SFC_SW_DWN",
  "GWETTOP",
];

const DURACION_CACHE_MS = 24 * 60 * 60 * 1000;
const VALOR_FALTANTE_NASA = -999;

/**
 * Obtiene y resume datos historicos diarios de NASA POWER.
 *
 * @param {Object} opciones
 * @param {number|string} opciones.latitud
 * @param {number|string} opciones.longitud
 * @param {number} [opciones.anioInicio=2015]
 * @param {number} [opciones.anioFin=2025]
 * @param {boolean} [opciones.usarCache=true]
 * @param {AbortSignal} [opciones.signal]
 * @returns {Promise<Object>}
 */
export async function obtenerHistorialNasa({
  latitud,
  longitud,
  anioInicio = 2015,
  anioFin = 2025,
  usarCache = true,
  signal,
}) {
  const lat = Number(latitud);
  const lon = Number(longitud);

  validarCoordenadas(lat, lon);
  validarAnios(anioInicio, anioFin);

  const claveCache = crearClaveCache({
    latitud: lat,
    longitud: lon,
    anioInicio,
    anioFin,
  });

  if (usarCache) {
    const datosGuardados = leerCache(claveCache);

    if (datosGuardados) {
      return {
        ...datosGuardados,
        origenRespuesta: "cache",
      };
    }
  }

  const fechaInicio = `${anioInicio}0101`;
  const fechaFin = `${anioFin}1231`;

  const consulta = new URLSearchParams({
    parameters: PARAMETROS_NASA.join(","),
    community: "AG",
    latitude: String(lat),
    longitude: String(lon),
    start: fechaInicio,
    end: fechaFin,
    format: "JSON",
    "time-standard": "LST",
  });

  const url = `${URL_NASA_POWER}?${consulta.toString()}`;

  let respuesta;

  try {
    respuesta = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("La consulta a NASA POWER fue cancelada.");
    }

    throw new Error(
      "No fue posible conectarse con NASA POWER. Verifique la conexion a Internet.",
    );
  }

  if (!respuesta.ok) {
    throw new Error(crearMensajeHttp(respuesta.status));
  }

  const datos = await respuesta.json();
  const parametros = datos?.properties?.parameter;

  if (!parametros || typeof parametros !== "object") {
    throw new Error(
      "NASA POWER respondio, pero no devolvio parametros climaticos.",
    );
  }

  const registros = convertirEnRegistros(parametros);

  if (registros.length === 0) {
    throw new Error(
      "No existen registros climaticos validos para la ubicacion seleccionada.",
    );
  }

  const resultado = {
    fuente: "NASA POWER",
    origenRespuesta: "api",
    ubicacion: {
      latitud: limpiarNumero(datos.geometry?.coordinates?.[1]) ?? lat,
      longitud: limpiarNumero(datos.geometry?.coordinates?.[0]) ?? lon,
      elevacionMetros:
        limpiarNumero(datos.geometry?.coordinates?.[2]) ?? null,
    },
    periodo: {
      anioInicio,
      anioFin,
      inicio: fechaInicio,
      fin: fechaFin,
      cantidadDias: registros.length,
    },
    resumen: calcularResumenHistorico(registros),
    resumenMensual: calcularResumenMensual(registros),
    registros,
    metadatos: {
      parametrosSolicitados: [...PARAMETROS_NASA],
      timeStandard: datos?.header?.time_standard ?? "LST",
      fillValue: datos?.header?.fill_value ?? VALOR_FALTANTE_NASA,
      apiVersion: datos?.header?.api?.version ?? null,
    },
  };

  if (usarCache) {
    guardarCache(claveCache, resultado);
  }

  return resultado;
}

/**
 * Elimina de localStorage todas las entradas creadas por este modulo.
 */
export function limpiarCacheNasa() {
  if (!cacheDisponible()) {
    return;
  }

  const claves = [];

  for (let indice = 0; indice < localStorage.length; indice += 1) {
    const clave = localStorage.key(indice);

    if (clave?.startsWith("nasa-power-")) {
      claves.push(clave);
    }
  }

  claves.forEach((clave) => localStorage.removeItem(clave));
}

function crearClaveCache({
  latitud,
  longitud,
  anioInicio,
  anioFin,
}) {
  return [
    "nasa-power",
    Number(latitud).toFixed(2),
    Number(longitud).toFixed(2),
    anioInicio,
    anioFin,
  ].join("-");
}

function cacheDisponible() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function leerCache(clave) {
  if (!cacheDisponible()) {
    return null;
  }

  try {
    const texto = localStorage.getItem(clave);

    if (!texto) {
      return null;
    }

    const cache = JSON.parse(texto);
    const guardadoEn = Number(cache?.guardadoEn);

    if (
      !Number.isFinite(guardadoEn) ||
      Date.now() - guardadoEn > DURACION_CACHE_MS
    ) {
      localStorage.removeItem(clave);
      return null;
    }

    return rehidratarResultado(cache.datos);
  } catch {
    localStorage.removeItem(clave);
    return null;
  }
}

function guardarCache(clave, datos) {
  if (!cacheDisponible()) {
    return;
  }

  try {
    localStorage.setItem(
      clave,
      JSON.stringify({
        guardadoEn: Date.now(),
        datos,
      }),
    );
  } catch {
    // La aplicacion puede continuar aunque localStorage este lleno o bloqueado.
  }
}

function rehidratarResultado(datos) {
  if (!datos || typeof datos !== "object") {
    return null;
  }

  return {
    ...datos,
    registros: Array.isArray(datos.registros)
      ? datos.registros.map((registro) => ({
          ...registro,
          fecha: new Date(`${registro.fechaNasa.slice(0, 4)}-${registro.fechaNasa.slice(4, 6)}-${registro.fechaNasa.slice(6, 8)}T00:00:00`),
        }))
      : [],
  };
}

function convertirEnRegistros(parametros) {
  const fechas = obtenerFechasDisponibles(parametros);

  return fechas.map((fechaNasa) => ({
    fecha: convertirFecha(fechaNasa),
    fechaNasa,
    precipitacionMm: limpiarValor(parametros.PRECTOTCORR?.[fechaNasa]),
    temperaturaMediaC: limpiarValor(parametros.T2M?.[fechaNasa]),
    temperaturaMaximaC: limpiarValor(parametros.T2M_MAX?.[fechaNasa]),
    temperaturaMinimaC: limpiarValor(parametros.T2M_MIN?.[fechaNasa]),
    humedadRelativaPorcentaje: limpiarValor(parametros.RH2M?.[fechaNasa]),
    velocidadVientoMs: limpiarValor(parametros.WS2M?.[fechaNasa]),
    radiacionMjM2Dia: limpiarValor(
      parametros.ALLSKY_SFC_SW_DWN?.[fechaNasa],
    ),
    humedadSuperficialIndice: limpiarValor(parametros.GWETTOP?.[fechaNasa]),
  }));
}

function obtenerFechasDisponibles(parametros) {
  const serieBase =
    parametros.T2M ??
    parametros.PRECTOTCORR ??
    parametros.T2M_MAX ??
    {};

  return Object.keys(serieBase)
    .filter((fecha) => /^\d{8}$/.test(fecha))
    .sort();
}

function calcularResumenHistorico(registros) {
  const precipitaciones = obtenerValores(registros, "precipitacionMm");
  const temperaturas = obtenerValores(registros, "temperaturaMediaC");
  const maximas = obtenerValores(registros, "temperaturaMaximaC");
  const minimas = obtenerValores(registros, "temperaturaMinimaC");
  const humedadRelativa = obtenerValores(
    registros,
    "humedadRelativaPorcentaje",
  );
  const humedadSuperficial = obtenerValores(
    registros,
    "humedadSuperficialIndice",
  );
  const radiacion = obtenerValores(registros, "radiacionMjM2Dia");
  const viento = obtenerValores(registros, "velocidadVientoMs");

  const precipitacionPorAnio = agruparPrecipitacionPorAnio(registros);
  const totalesAnuales = Object.values(precipitacionPorAnio);

  return {
    temperaturaMediaHistoricaC: redondear(promedio(temperaturas)),
    temperaturaMaximaAbsolutaC: redondear(maximo(maximas)),
    temperaturaMinimaAbsolutaC: redondear(minimo(minimas)),
    precipitacionMediaAnualMm: redondear(promedio(totalesAnuales)),
    humedadRelativaMediaPorcentaje: redondear(promedio(humedadRelativa)),
    humedadSuperficialHistorica: redondear(
      promedio(humedadSuperficial),
      3,
    ),
    radiacionMediaMjM2Dia: redondear(promedio(radiacion)),
    vientoMedioMs: redondear(promedio(viento)),
    promedioDiasCalor35PorAnio: calcularPromedioEventosPorAnio(
      registros,
      (registro) =>
        registro.temperaturaMaximaC !== null &&
        registro.temperaturaMaximaC >= 35,
    ),
    promedioDiasCalor40PorAnio: calcularPromedioEventosPorAnio(
      registros,
      (registro) =>
        registro.temperaturaMaximaC !== null &&
        registro.temperaturaMaximaC >= 40,
    ),
    promedioDiasConLluviaPorAnio: calcularPromedioEventosPorAnio(
      registros,
      (registro) =>
        registro.precipitacionMm !== null && registro.precipitacionMm >= 1,
    ),
    rachaSecaMaximaDias: calcularRachaSecaMaxima(registros),
  };
}

function calcularResumenMensual(registros) {
  const nombres = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return nombres.map((nombre, indiceMes) => {
    const registrosMes = registros.filter(
      (registro) => registro.fecha.getMonth() === indiceMes,
    );

    const cantidadAniosMes = new Set(
      registrosMes.map((registro) => registro.fecha.getFullYear()),
    ).size;

    const precipitaciones = obtenerValores(
      registrosMes,
      "precipitacionMm",
    );

    return {
      numero: indiceMes + 1,
      nombre,
      precipitacionMediaMensualMm: redondear(
        cantidadAniosMes > 0
          ? suma(precipitaciones) / cantidadAniosMes
          : null,
      ),
      temperaturaMediaC: redondear(
        promedio(obtenerValores(registrosMes, "temperaturaMediaC")),
      ),
      temperaturaMaximaMediaC: redondear(
        promedio(obtenerValores(registrosMes, "temperaturaMaximaC")),
      ),
      temperaturaMinimaMediaC: redondear(
        promedio(obtenerValores(registrosMes, "temperaturaMinimaC")),
      ),
      humedadRelativaMediaPorcentaje: redondear(
        promedio(
          obtenerValores(registrosMes, "humedadRelativaPorcentaje"),
        ),
      ),
      humedadSuperficialHistorica: redondear(
        promedio(
          obtenerValores(registrosMes, "humedadSuperficialIndice"),
        ),
        3,
      ),
      radiacionMediaMjM2Dia: redondear(
        promedio(obtenerValores(registrosMes, "radiacionMjM2Dia")),
      ),
    };
  });
}

function agruparPrecipitacionPorAnio(registros) {
  const resultado = {};

  for (const registro of registros) {
    if (registro.precipitacionMm === null) {
      continue;
    }

    const anio = registro.fecha.getFullYear();
    resultado[anio] ??= 0;
    resultado[anio] += registro.precipitacionMm;
  }

  return resultado;
}

function calcularRachaSecaMaxima(registros) {
  let rachaActual = 0;
  let rachaMaxima = 0;

  for (const registro of registros) {
    if (registro.precipitacionMm === null) {
      rachaActual = 0;
      continue;
    }

    if (registro.precipitacionMm < 1) {
      rachaActual += 1;
      rachaMaxima = Math.max(rachaMaxima, rachaActual);
    } else {
      rachaActual = 0;
    }
  }

  return rachaMaxima;
}

function calcularPromedioEventosPorAnio(registros, condicion) {
  const eventosPorAnio = {};

  for (const registro of registros) {
    const anio = registro.fecha.getFullYear();
    eventosPorAnio[anio] ??= 0;

    if (condicion(registro)) {
      eventosPorAnio[anio] += 1;
    }
  }

  return redondear(promedio(Object.values(eventosPorAnio)));
}

function validarCoordenadas(latitud, longitud) {
  if (!Number.isFinite(latitud) || latitud < -90 || latitud > 90) {
    throw new Error("La latitud debe estar entre -90 y 90.");
  }

  if (!Number.isFinite(longitud) || longitud < -180 || longitud > 180) {
    throw new Error("La longitud debe estar entre -180 y 180.");
  }
}

function validarAnios(anioInicio, anioFin) {
  if (!Number.isInteger(anioInicio) || !Number.isInteger(anioFin)) {
    throw new Error("Los anios deben ser numeros enteros.");
  }

  if (anioInicio < 1981) {
    throw new Error("NASA POWER diario debe consultarse desde 1981 en adelante.");
  }

  if (anioInicio > anioFin) {
    throw new Error("El anio inicial no puede superar al anio final.");
  }
}

function convertirFecha(fechaNasa) {
  const anio = Number(fechaNasa.slice(0, 4));
  const mes = Number(fechaNasa.slice(4, 6));
  const dia = Number(fechaNasa.slice(6, 8));

  return new Date(anio, mes - 1, dia);
}

function limpiarNumero(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

function limpiarValor(valor) {
  const numero = limpiarNumero(valor);

  if (numero === null || numero === VALOR_FALTANTE_NASA) {
    return null;
  }

  return numero;
}

function obtenerValores(registros, propiedad) {
  return registros
    .map((registro) => registro[propiedad])
    .filter((valor) => Number.isFinite(valor));
}

function suma(valores) {
  return valores.reduce((acumulado, valor) => acumulado + valor, 0);
}

function promedio(valores) {
  if (!Array.isArray(valores) || valores.length === 0) {
    return null;
  }

  return suma(valores) / valores.length;
}

function maximo(valores) {
  return valores.length > 0 ? Math.max(...valores) : null;
}

function minimo(valores) {
  return valores.length > 0 ? Math.min(...valores) : null;
}

function redondear(valor, decimales = 2) {
  if (!Number.isFinite(valor)) {
    return null;
  }

  return Number(valor.toFixed(decimales));
}

function crearMensajeHttp(codigo) {
  if (codigo === 400) {
    return "NASA POWER recibio una solicitud incorrecta.";
  }

  if (codigo === 422) {
    return "NASA POWER rechazo las coordenadas, las fechas o los parametros.";
  }

  if (codigo === 429) {
    return "NASA POWER recibio demasiadas consultas. Intente nuevamente mas tarde.";
  }

  if (codigo >= 500) {
    return "NASA POWER no esta disponible temporalmente.";
  }

  return `NASA POWER respondio con el estado ${codigo}.`;
}
