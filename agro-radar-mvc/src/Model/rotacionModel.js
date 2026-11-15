export const CATALOGO_CULTIVOS = [
  { id: "soja", nombre: "Soja", icono: "🌱" },
  { id: "maiz", nombre: "Maíz", icono: "🌽" },
  { id: "trigo_soja", nombre: "Trigo / Soja 2da", icono: "🌾" },
  { id: "algodon", nombre: "Algodón", icono: "☁️" },
  { id: "girasol", nombre: "Girasol", icono: "🌻" },
  { id: "pastura", nombre: "Alfalfa / Pastura", icono: "🍀" },
];

const REGLAS_CULTIVOS = {
  soja: {
    nombre: "Soja (1ra)",
    icono: "🌱",
    consumoAgua: "450 - 700 mm (ETc ~860 mm/año)",
    kcPromedio: 0.79,
    desgasteBase: 75,
    semaforo: "ROJO",
    color: "#d32f2f",
    balanceNitrogeno: "Positivo (+ Fijación biológica)",
    balanceCarbono: "Negativo (- Poco rastrojo protector)",
    efectoNapa: "Recarga freática (ciclo corto; riesgo de ascenso de napa).",
    resumenDesgaste:
      "Deja poco rastrojo y desprotege el suelo contra la evaporación. Repetir soja agota la materia orgánica y multiplica malezas resistentes.",
    siHayHumedad: {
      cultivo: "Maíz o Doble Cultivo (Trigo / Soja 2da)",
      icono: "🌽",
      motivo:
        "Buena reserva hídrica en el perfil. El maíz o el trigo aprovecharán el nitrógeno dejado por la soja, consumirán el excedente de agua y devolverán rastrojo (carbono) al lote.",
    },
    siEstaSeco: {
      cultivo: "Sorgo o Cultivo de Cobertura (Centeno / Vicia)",
      icono: "🌾",
      motivo:
        "Con baja humedad en el suelo, el sorgo (450-650 mm, Kc 0.78) o un cultivo de cobertura aportan raíces y protegen el suelo sin arriesgar capital.",
    },
  },
  maiz: {
    nombre: "Maíz",
    icono: "🌽",
    consumoAgua: "500 - 800 mm (ETc ~725 mm/año)",
    kcPromedio: 0.82,
    desgasteBase: 45,
    semaforo: "AMARILLO",
    color: "#ef6c00",
    balanceNitrogeno: "Negativo (- Alta extracción de N)",
    balanceCarbono: "Positivo (+ Abundante cobertura / rastrojo)",
    efectoNapa: "Equilibrado (buen consumo estival; deprime la napa en verano).",
    resumenDesgaste:
      "Excelente aporte de rastrojo que mejora la infiltración del agua, pero deja el suelo con baja reserva de nitrógeno.",
    siHayHumedad: {
      cultivo: "Soja o Maní",
      icono: "🌱",
      motivo:
        "Rotación ideal tras gramínea: la leguminosa fijará nitrógeno biológicamente para compensar la extracción del maíz sobre una excelente cama de siembra.",
    },
    siEstaSeco: {
      cultivo: "Poroto (Frijol) o Garbanzo",
      icono: "🫘",
      motivo:
        "Leguminosas de menor requerimiento hídrico (300-500 mm) que reponen nitrógeno en el lote sin exigir reservas profundas.",
    },
  },
  trigo_soja: {
    nombre: "Doble Cultivo (Trigo / Soja 2da)",
    icono: "🌾",
    consumoAgua: "890 - 980 mm/año",
    kcPromedio: 0.80,
    desgasteBase: 35,
    semaforo: "VERDE",
    color: "#2e7d32",
    balanceNitrogeno: "Equilibrado (Trigo extrae N / Soja repone parcial)",
    balanceCarbono: "Positivo (+ Raíces vivas y rastrojo todo el año)",
    efectoNapa: "Deprime la napa (~35 cm más abajo que un cultivo simple).",
    resumenDesgaste:
      "Cuida la estructura física y controla napas altas, pero consume entre 150 y 500 mm adicionales de agua, dejando el perfil exigido.",
    siHayHumedad: {
      cultivo: "Maíz Temprano",
      icono: "🌽",
      motivo:
        "El perfil ya recuperó humedad suficiente para aprovechar la buena estructura física dejada por la secuencia Trigo/Soja.",
    },
    siEstaSeco: {
      cultivo: "Maíz Tardío (Diciembre) o Sorgo",
      icono: "⏳",
      motivo:
        "Como el doble cultivo secó el perfil profundo, atrasar la siembra permite recargar agua con las lluvias de primavera.",
    },
  },
  algodon: {
    nombre: "Algodón",
    icono: "☁️",
    consumoAgua: "700 - 1300 mm",
    kcPromedio: 0.82,
    desgasteBase: 80,
    semaforo: "ROJO",
    color: "#d32f2f",
    balanceNitrogeno: "Negativo (- Alta extracción nutricional)",
    balanceCarbono: "Negativo (- Poca cobertura superficial remanente)",
    efectoNapa: "Alto consumo profundo durante su ciclo largo.",
    resumenDesgaste:
      "Desgaste elevado de agua y nutrientes con escaso rastrojo en superficie, exponiendo el suelo al planchado por lluvias.",
    siHayHumedad: {
      cultivo: "Maíz o Trigo de Cobertura",
      icono: "🌽",
      motivo:
        "Es prioritario incorporar una gramínea de alto volumen de rastrojo para devolver carbono y porosidad al lote.",
    },
    siEstaSeco: {
      cultivo: "Sorgo / Mijo o Cultivo de Servicio",
      icono: "🌾",
      motivo:
        "El sorgo tolera la escasez de agua dejada por el algodón y genera la cobertura que el lote necesita urgentemente.",
    },
  },
  girasol: {
    nombre: "Girasol",
    icono: "🌻",
    consumoAgua: "600 - 1000 mm",
    kcPromedio: 0.79,
    desgasteBase: 65,
    semaforo: "AMARILLO",
    color: "#ef6c00",
    balanceNitrogeno: "Negativo (- Extracción moderada/alta)",
    balanceCarbono: "Bajo (- Tallos gruesos pero poca cobertura fina)",
    efectoNapa: "Seca los estratos profundos por su raíz pivotante.",
    resumenDesgaste:
      "Consume humedad profunda y deja poca cobertura fina en superficie. Requiere cortar el ciclo de enfermedades de oleaginosas.",
    siHayHumedad: {
      cultivo: "Trigo + Soja 2da o Maíz",
      icono: "🌾",
      motivo:
        "Las gramíneas cortan el ciclo de hongos del girasol y cubren rápidamente la superficie del suelo.",
    },
    siEstaSeco: {
      cultivo: "Poroto o Cultivo de Cobertura Invernal",
      icono: "🫘",
      motivo:
        "Baja demanda de agua (300-500 mm) y fijación biológica de nitrógeno para recuperar el lote.",
    },
  },
  pastura: {
    nombre: "Alfalfa / Pastura Perenne",
    icono: "🍀",
    consumoAgua: "904 - 2000 mm/año",
    kcPromedio: 1.0,
    desgasteBase: 15,
    semaforo: "VERDE",
    color: "#2e7d32",
    balanceNitrogeno: "Muy Positivo (++ Máxima fijación de N)",
    balanceCarbono: "Muy Positivo (++ Regenera estructura e infiltración)",
    efectoNapa: "Deprime fuertemente la napa (>2 m), evitando salinización.",
    resumenDesgaste:
      "Suelo regenerado en estructura y nitrógeno, aunque con reservas hídricas profundas consumidas por la pradera.",
    siHayHumedad: {
      cultivo: "Maíz de Alta Producción o Trigo",
      icono: "🌽",
      motivo:
        "El lote tiene su máxima fertilidad nitrogenada y física; con buena humedad superficial alcanzará su techo de rinde.",
    },
    siEstaSeco: {
      cultivo: "Barbecho ➔ Sorgo o Maíz Tardío",
      icono: "🌾",
      motivo:
        "Conviene acumular lluvias en primavera antes de sembrar para reponer el agua profunda que consumió la alfalfa.",
    },
  },
};

export class RotacionModel {
  /**
   * Calcula el desgaste aproximado y la rotación sugerida cruzando
   * el cultivo anterior con la humedad actual del lote (si existe diagnóstico).
   */
  static evaluarRotacion(cultivoAnteriorId = "soja", diagnosticoSuelo = null) {
    const regla = REGLAS_CULTIVOS[cultivoAnteriorId] || REGLAS_CULTIVOS.soja;

    // Extraemos la humedad profunda o superficial del diagnóstico actual del lote (si ya se midió)
    const humProfunda = diagnosticoSuelo?.humedadUtilizada?.abajo ?? null;
    const humSuperficial = diagnosticoSuelo?.humedadUtilizada?.arriba ?? null;

    // Si aún no midió el lote, asumimos condición intermedia; si ya midió, >= 20% se considera buena reserva
    const buenaHumedad =
      humProfunda !== null
        ? humProfunda >= 20
        : humSuperficial !== null
        ? humSuperficial >= 22
        : true;

    let desgasteCalculado = regla.desgasteBase;
    let alertaNitrato = null;

    // Si hay exceso de humedad superficial (>30%) en un cultivo de bajo rastrojo, sube el desgaste por lavado de N
    if (humSuperficial !== null && humSuperficial >= 30 && regla.balanceCarbono.includes("Negativo")) {
      desgasteCalculado = Math.min(100, desgasteCalculado + 12);
      alertaNitrato =
        "Alerta de lixiviación: la alta humedad sobre suelo con poco rastrojo acelera el lavado de nitratos (N-NO3).";
    }

    const sugerencia = buenaHumedad ? regla.siHayHumedad : regla.siEstaSeco;

    return {
      cultivoAnteriorId,
      nombreAnterior: regla.nombre,
      iconoAnterior: regla.icono,
      consumoAgua: regla.consumoAgua,
      kcPromedio: regla.kcPromedio,
      desgastePorcentaje: desgasteCalculado,
      semaforo: regla.semaforo,
      color: regla.color,
      balanceNitrogeno: regla.balanceNitrogeno,
      balanceCarbono: regla.balanceCarbono,
      efectoNapa: regla.efectoNapa,
      resumenDesgaste: regla.resumenDesgaste,
      alertaNitrato,
      condicionHidricaTexto:
        humProfunda !== null || humSuperficial !== null
          ? buenaHumedad
            ? "Con reserva de humedad en el lote"
            : "Con baja humedad medida en el lote"
          : "Estimación estándar (analizá el lote arriba para ajustar por humedad real)",
      recomendacion: sugerencia,
    };
  }
}