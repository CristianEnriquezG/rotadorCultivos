export class SueloModel {
  static async obtenerDatosCrudos(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=soil_moisture_0_to_1cm,soil_moisture_9_to_27cm,relative_humidity_2m,precipitation&hourly=precipitation_probability&forecast_days=1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('No se pudo conectar con el servicio satelital.');
    }

    const data = await response.json();
    return {
      humSuperficial: +(data.current.soil_moisture_0_to_1cm * 100).toFixed(1),
      humProfunda: +(data.current.soil_moisture_9_to_27cm * 100).toFixed(1),
      humAmbiente: data.current.relative_humidity_2m,
      lluviaActual: data.current.precipitation,
      probLluviaHoy: Math.max(...data.hourly.precipitation_probability.slice(0, 12)),
      altitud: data.elevation,
    };
  }

  // MODO 1: Diagnóstico para SIEMBRA
  static async obtenerDiagnosticoSiembra(lat, lon) {
    const d = await this.obtenerDatosCrudos(lat, lon);

    if (d.humSuperficial >= 22 && d.humProfunda >= 20) {
      return {
        tipo: 'SIEMBRA',
        semaforo: 'VERDE',
        color: '#2e7d32',
        titulo: 'Suelo listo para sembrar',
        mensaje: `Tenes ${d.humSuperficial}% de humedad arriba y ${d.humProfunda}% abajo. Buen momento para entrar con maíz o rotar el lote.`,
      };
    }

    if (d.humSuperficial < 18 && d.humProfunda >= 20) {
      return {
        tipo: 'SIEMBRA',
        semaforo: 'AMARILLO',
        color: '#ed6c02',
        titulo: 'Seco arriba, con reserva abajo',
        mensaje: `Arriba hay poca humedad (${d.humSuperficial}%), pero abajo conserva ${d.humProfunda}%. Conviene esperar una lluvia chica antes de sembrar.`,
      };
    }

    return {
      tipo: 'SIEMBRA',
      semaforo: 'ROJO',
      color: '#d32f2f',
      titulo: 'Suelo seco: no arriesgar semilla',
      mensaje: `Humedad baja (${d.humSuperficial}% arriba y ${d.humProfunda}% abajo). Conviene esperar lluvias.`,
    };
  }

  // MODO 2: Diagnóstico para COSECHA (Piso firme + Grano seco)
  static async obtenerDiagnosticoCosecha(lat, lon) {
    const d = await this.obtenerDatosCrudos(lat, lon);

    // 1. Si está lloviendo o el suelo está muy blando (> 32% humedad superficial), riesgo de encajadura
    if (d.lluviaActual > 0 || d.humSuperficial >= 32) {
      return {
        tipo: 'COSECHA',
        semaforo: 'ROJO',
        color: '#d32f2f',
        titulo: 'No entrar a cosechar: falta piso',
        mensaje: `El suelo está muy blando (${d.humSuperficial}% de humedad arriba). Si metes la cosechadora vas a compactar el lote o encajarte.`,
      };
    }

    // 2. Si hay buen piso pero mucha humedad ambiente (> 75%) o alta chance de lluvia inmediata
    if (d.humAmbiente > 75 || d.probLluviaHoy > 60 || d.humSuperficial >= 27) {
      return {
        tipo: 'COSECHA',
        semaforo: 'AMARILLO',
        color: '#ed6c02',
        titulo: 'Esperar unas horas para trillar',
        mensaje: `Humedad del suelo al ${d.humSuperficial}% y humedad del aire al ${d.humAmbiente}%. Conviene esperar que el sol oree el cultivo al mediodía.`,
      };
    }

    // 3. Piso firme (< 27% arriba), aire seco y sin lluvias a la vista
    return {
      tipo: 'COSECHA',
      semaforo: 'VERDE',
      color: '#2e7d32',
      titulo: 'Condición óptima para cosechar',
      mensaje: `Hay buen piso (${d.humSuperficial}% de humedad en suelo) y aire seco (${d.humAmbiente}%). Podés meter máquina sin compactar el lote.`,
    };
  }
}