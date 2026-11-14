export class SueloModel {
  static async obtenerDiagnostico(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=soil_moisture_0_to_1cm,soil_moisture_9_to_27cm`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('No se pudo conectar con el servicio satelital.');
    }

    const data = await response.json();
    const humSuperficial = +(data.current.soil_moisture_0_to_1cm * 100).toFixed(1);
    const humProfunda = +(data.current.soil_moisture_9_to_27cm * 100).toFixed(1);

    return this.evaluarReglasAgronomicas({
      humSuperficial,
      humProfunda,
      altitud: data.elevation,
    });
  }

  static evaluarReglasAgronomicas({ humSuperficial, humProfunda, altitud }) {
    if (humSuperficial >= 22 && humProfunda >= 20) {
      return {
        semaforo: 'VERDE',
        color: '#2e7d32',
        titulo: 'Suelo listo para sembrar',
        mensaje: `Tenes ${humSuperficial}% de humedad arriba y ${humProfunda}% abajo. Buen momento para entrar con maíz o rotar el lote.`,
        metricas: { humSuperficial, humProfunda, altitud },
      };
    }

    if (humSuperficial < 18 && humProfunda >= 20) {
      return {
        semaforo: 'AMARILLO',
        color: '#ed6c02',
        titulo: 'Seco arriba, con reserva abajo',
        mensaje: `Arriba hay poca humedad (${humSuperficial}%), pero abajo conserva ${humProfunda}%. Conviene esperar una lluvia chica antes de sembrar.`,
        metricas: { humSuperficial, humProfunda, altitud },
      };
    }

    return {
      semaforo: 'ROJO',
      color: '#d32f2f',
      titulo: 'Suelo seco: cuidar el lote',
      mensaje: `Humedad baja en todo el perfil (${humSuperficial}% arriba y ${humProfunda}% abajo). No arriesgar semilla; conviene esperar lluvias.`,
      metricas: { humSuperficial, humProfunda, altitud },
    };
  }
}