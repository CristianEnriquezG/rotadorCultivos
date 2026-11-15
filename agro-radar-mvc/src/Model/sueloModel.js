export class SueloModel {
  static async obtenerDatosCrudos(lat, lon) {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=soil_moisture_0_to_1cm,soil_moisture_9_to_27cm,relative_humidity_2m,precipitation&hourly=precipitation_probability&forecast_days=1`
    );

    if (!response.ok) {
      throw new Error('No se pudo conectar con OpenWeather.');
    }

    const data = await response.json();
    const humSuperficial = +(data.current.soil_moisture_0_to_1cm * 100).toFixed(1);
    const humProfunda = +(data.current.soil_moisture_9_to_27cm * 100).toFixed(1);

    return {
      humSuperficial,
      humProfunda,
      humAmbiente: data.current.relative_humidity_2m,
      lluviaActual: data.current.precipitation,
      probLluviaHoy: Math.max(...data.hourly.precipitation_probability.slice(0, 12)),
      humedadUtilizada: {
        arriba: humSuperficial,
        abajo: humProfunda,
        fuente: 'OpenWeather',
      },
      fuentes: ['OpenWeather', 'NASA POWER'],
    };
  }

  static async obtenerDiagnosticoSiembra(lat, lon) {
    const d = await this.obtenerDatosCrudos(lat, lon);
    const base = {
      tipo: 'SIEMBRA',
      humedadUtilizada: d.humedadUtilizada,
      fuentes: d.fuentes,
    };

    if (d.humSuperficial >= 22 && d.humProfunda >= 20) {
      return {
        ...base,
        semaforo: 'VERDE',
        color: '#2e7d32',
        titulo: 'Suelo listo para sembrar',
        mensaje: `Tenés ${d.humSuperficial}% de humedad arriba y ${d.humProfunda}% abajo. Buen momento para entrar con maíz o rotar el lote.`,
      };
    }

    if (d.humSuperficial < 18 && d.humProfunda >= 20) {
      return {
        ...base,
        semaforo: 'AMARILLO',
        color: '#ed6c02',
        titulo: 'Seco arriba, con reserva abajo',
        mensaje: `Arriba hay poca humedad (${d.humSuperficial}%), pero abajo conserva ${d.humProfunda}%. Conviene esperar una lluvia chica.`,
      };
    }

    return {
      ...base,
      semaforo: 'ROJO',
      color: '#d32f2f',
      titulo: 'Suelo seco: no arriesgar semilla',
      mensaje: `Humedad baja (${d.humSuperficial}% arriba y ${d.humProfunda}% abajo). Conviene esperar lluvias.`,
    };
  }

  static async obtenerDiagnosticoCosecha(lat, lon) {
    const d = await this.obtenerDatosCrudos(lat, lon);
    const base = {
      tipo: 'COSECHA',
      humedadUtilizada: d.humedadUtilizada,
      fuentes: d.fuentes,
    };

    if (d.lluviaActual > 0 || d.humSuperficial >= 32) {
      return {
        ...base,
        semaforo: 'ROJO',
        color: '#d32f2f',
        titulo: 'No entrar a cosechar: falta piso',
        mensaje: `Suelo muy blando (${d.humSuperficial}% de humedad arriba). Riesgo de encajar la cosechadora o compactar el lote.`,
      };
    }

    if (d.humAmbiente > 75 || d.probLluviaHoy > 60 || d.humSuperficial >= 27) {
      return {
        ...base,
        semaforo: 'AMARILLO',
        color: '#ed6c02',
        titulo: 'Esperar unas horas para trillar',
        mensaje: `Piso al ${d.humSuperficial}% y humedad del aire al ${d.humAmbiente}%. Esperá al mediodía para que oree el cultivo.`,
      };
    }

    return {
      ...base,
      semaforo: 'VERDE',
      color: '#2e7d32',
      titulo: 'Condición óptima para cosechar',
      mensaje: `Buen piso (${d.humSuperficial}% de humedad en suelo) y aire seco (${d.humAmbiente}%). Podés meter máquina tranquilo.`,
    };
  }
}