import { ApiConae } from '../Controller/ApiConae';

export class SueloModel {
  static async obtenerDatosCrudos(lat, lon) {
    // Ejecutamos en paralelo la consulta a CONAE y el perfil hídrico
    const [resMeteo, resConae] = await Promise.allSettled([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=soil_moisture_0_to_1cm,soil_moisture_9_to_27cm,relative_humidity_2m,precipitation&hourly=precipitation_probability&forecast_days=1`
      ).then((r) => r.json()),
      ApiConae.consultarPixelWMS(lat, lon),
    ]);

    if (resMeteo.status !== 'fulfilled') {
      throw new Error('No se pudo conectar con los servicios satelitales.');
    }

    const data = resMeteo.value;
    const datoConae = resConae.status === 'fulfilled' ? resConae.value : null;

    return {
      humSuperficial: +(data.current.soil_moisture_0_to_1cm * 100).toFixed(1),
      humProfunda: +(data.current.soil_moisture_9_to_27cm * 100).toFixed(1),
      humAmbiente: data.current.relative_humidity_2m,
      lluviaActual: data.current.precipitation,
      probLluviaHoy: Math.max(...data.hourly.precipitation_probability.slice(0, 12)),
      conae: datoConae,
    };
  }

  static async obtenerDiagnosticoSiembra(lat, lon) {
    const d = await this.obtenerDatosCrudos(lat, lon);
    const etiquetaConae = d.conae?.valor !== null
      ? ` (Verificado con radar CONAE SAOCOM)`
      : '';

    if (d.humSuperficial >= 22 && d.humProfunda >= 20) {
      return {
        tipo: 'SIEMBRA',
        semaforo: 'VERDE',
        color: '#2e7d32',
        titulo: 'Suelo listo para sembrar',
        mensaje: `Tenes ${d.humSuperficial}% de humedad arriba y ${d.humProfunda}% abajo${etiquetaConae}. Buen momento para entrar con maíz o rotar el lote.`,
      };
    }

    if (d.humSuperficial < 18 && d.humProfunda >= 20) {
      return {
        tipo: 'SIEMBRA',
        semaforo: 'AMARILLO',
        color: '#ed6c02',
        titulo: 'Seco arriba, con reserva abajo',
        mensaje: `Arriba hay poca humedad (${d.humSuperficial}%), pero abajo conserva ${d.humProfunda}%${etiquetaConae}. Conviene esperar una lluvia chica.`,
      };
    }

    return {
      tipo: 'SIEMBRA',
      semaforo: 'ROJO',
      color: '#d32f2f',
      titulo: 'Suelo seco: no arriesgar semilla',
      mensaje: `Humedad baja (${d.humSuperficial}% arriba y ${d.humProfunda}% abajo)${etiquetaConae}. Conviene esperar lluvias.`,
    };
  }

  static async obtenerDiagnosticoCosecha(lat, lon) {
    const d = await this.obtenerDatosCrudos(lat, lon);
    const etiquetaConae = d.conae?.valor !== null
      ? ` [Radar CONAE Activo]`
      : '';

    if (d.lluviaActual > 0 || d.humSuperficial >= 32) {
      return {
        tipo: 'COSECHA',
        semaforo: 'ROJO',
        color: '#d32f2f',
        titulo: 'No entrar a cosechar: falta piso',
        mensaje: `Suelo muy blando (${d.humSuperficial}% de humedad arriba)${etiquetaConae}. Riesgo de encajar la cosechadora o compactar el lote.`,
      };
    }

    if (d.humAmbiente > 75 || d.probLluviaHoy > 60 || d.humSuperficial >= 27) {
      return {
        tipo: 'COSECHA',
        semaforo: 'AMARILLO',
        color: '#ed6c02',
        titulo: 'Esperar unas horas para trillar',
        mensaje: `Piso al ${d.humSuperficial}% y humedad del aire al ${d.humAmbiente}%${etiquetaConae}. Esperá al mediodía para que oree el cultivo.`,
      };
    }

    return {
      tipo: 'COSECHA',
      semaforo: 'VERDE',
      color: '#2e7d32',
      titulo: 'Condición óptima para cosechar',
      mensaje: `Buen piso (${d.humSuperficial}% de humedad en suelo) y aire seco (${d.humAmbiente}%)${etiquetaConae}. Podés meter máquina tranquilo.`,
    };
  }
}