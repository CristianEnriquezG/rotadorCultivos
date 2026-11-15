export const CATALOGO_CULTIVOS = [
  { id: "soja", nombre: { es: "Soja", en: "Soybean" }, icono: "🌱" },
  { id: "maiz", nombre: { es: "Maíz", en: "Corn" }, icono: "🌽" },
  { id: "trigo_soja", nombre: { es: "Trigo / Soja 2da", en: "Wheat / 2nd Soybean" }, icono: "🌾" },
  { id: "algodon", nombre: { es: "Algodón", en: "Cotton" }, icono: "☁️" },
  { id: "girasol", nombre: { es: "Girasol", en: "Sunflower" }, icono: "🌻" },
  { id: "pastura", nombre: { es: "Alfalfa / Pastura", en: "Alfalfa / Pasture" }, icono: "🍀" },
];

/**
 * Datos agronómicos por cultivo.
 * Los valores numéricos son comunes; los textos están en `es` y `en`.
 */
const REGLAS_CULTIVOS = {
  soja: {
    icono: "🌱",
    kcPromedio: 0.79,
    desgasteBase: 75,
    semaforo: "ROJO",
    color: "#d32f2f",
    carbonoNegativo: true,
    iconoSiHumedad: "🌽",
    iconoSiSeco: "🌾",
    es: {
      nombre: "Soja (1ra)",
      consumoAgua: "450 - 700 mm (ETc ~860 mm/año)",
      balanceNitrogeno: "Positivo (+ Fijación biológica)",
      balanceCarbono: "Negativo (- Poco rastrojo protector)",
      efectoNapa: "Recarga freática (ciclo corto; riesgo de ascenso de napa).",
      resumenDesgaste:
        "Deja poco rastrojo y desprotege el suelo contra la evaporación. Repetir soja agota la materia orgánica y multiplica malezas resistentes.",
      siHayHumedad: {
        cultivo: "Maíz o Doble Cultivo (Trigo / Soja 2da)",
        motivo:
          "Buena reserva hídrica en el perfil. El maíz o el trigo aprovecharán el nitrógeno dejado por la soja, consumirán el excedente de agua y devolverán rastrojo (carbono) al lote.",
      },
      siEstaSeco: {
        cultivo: "Sorgo o Cultivo de Cobertura (Centeno / Vicia)",
        motivo:
          "Con baja humedad en el suelo, el sorgo (450-650 mm, Kc 0.78) o un cultivo de cobertura aportan raíces y protegen el suelo sin arriesgar capital.",
      },
    },
    en: {
      nombre: "Soybean (1st)",
      consumoAgua: "450 - 700 mm (ETc ~860 mm/year)",
      balanceNitrogeno: "Positive (+ Biological fixation)",
      balanceCarbono: "Negative (- Little protective residue)",
      efectoNapa: "Recharges groundwater (short cycle; risk of rising water table).",
      resumenDesgaste:
        "Leaves little residue and exposes the soil to evaporation. Repeating soybean depletes organic matter and multiplies resistant weeds.",
      siHayHumedad: {
        cultivo: "Corn or Double Crop (Wheat / 2nd Soybean)",
        motivo:
          "Good water reserve in the profile. Corn or wheat will use the nitrogen left by the soybean, consume the excess water and return residue (carbon) to the field.",
      },
      siEstaSeco: {
        cultivo: "Sorghum or Cover Crop (Rye / Vetch)",
        motivo:
          "With low soil moisture, sorghum (450-650 mm, Kc 0.78) or a cover crop adds roots and protects the soil without risking capital.",
      },
    },
  },
  maiz: {
    icono: "🌽",
    kcPromedio: 0.82,
    desgasteBase: 45,
    semaforo: "AMARILLO",
    color: "#ef6c00",
    carbonoNegativo: false,
    iconoSiHumedad: "🌱",
    iconoSiSeco: "🫘",
    es: {
      nombre: "Maíz",
      consumoAgua: "500 - 800 mm (ETc ~725 mm/año)",
      balanceNitrogeno: "Negativo (- Alta extracción de N)",
      balanceCarbono: "Positivo (+ Abundante cobertura / rastrojo)",
      efectoNapa: "Equilibrado (buen consumo estival; deprime la napa en verano).",
      resumenDesgaste:
        "Excelente aporte de rastrojo que mejora la infiltración del agua, pero deja el suelo con baja reserva de nitrógeno.",
      siHayHumedad: {
        cultivo: "Soja o Maní",
        motivo:
          "Rotación ideal tras gramínea: la leguminosa fijará nitrógeno biológicamente para compensar la extracción del maíz sobre una excelente cama de siembra.",
      },
      siEstaSeco: {
        cultivo: "Poroto (Frijol) o Garbanzo",
        motivo:
          "Leguminosas de menor requerimiento hídrico (300-500 mm) que reponen nitrógeno en el lote sin exigir reservas profundas.",
      },
    },
    en: {
      nombre: "Corn",
      consumoAgua: "500 - 800 mm (ETc ~725 mm/year)",
      balanceNitrogeno: "Negative (- High N extraction)",
      balanceCarbono: "Positive (+ Abundant cover / residue)",
      efectoNapa: "Balanced (good summer uptake; lowers the water table in summer).",
      resumenDesgaste:
        "Excellent residue contribution that improves water infiltration, but leaves the soil with a low nitrogen reserve.",
      siHayHumedad: {
        cultivo: "Soybean or Peanut",
        motivo:
          "Ideal rotation after a grass crop: the legume will fix nitrogen biologically to offset the corn's extraction on an excellent seedbed.",
      },
      siEstaSeco: {
        cultivo: "Dry Bean or Chickpea",
        motivo:
          "Legumes with lower water requirements (300-500 mm) that replenish nitrogen in the field without demanding deep reserves.",
      },
    },
  },
  trigo_soja: {
    icono: "🌾",
    kcPromedio: 0.8,
    desgasteBase: 35,
    semaforo: "VERDE",
    color: "#2e7d32",
    carbonoNegativo: false,
    iconoSiHumedad: "🌽",
    iconoSiSeco: "⏳",
    es: {
      nombre: "Doble Cultivo (Trigo / Soja 2da)",
      consumoAgua: "890 - 980 mm/año",
      balanceNitrogeno: "Equilibrado (Trigo extrae N / Soja repone parcial)",
      balanceCarbono: "Positivo (+ Raíces vivas y rastrojo todo el año)",
      efectoNapa: "Deprime la napa (~35 cm más abajo que un cultivo simple).",
      resumenDesgaste:
        "Cuida la estructura física y controla napas altas, pero consume entre 150 y 500 mm adicionales de agua, dejando el perfil exigido.",
      siHayHumedad: {
        cultivo: "Maíz Temprano",
        motivo:
          "El perfil ya recuperó humedad suficiente para aprovechar la buena estructura física dejada por la secuencia Trigo/Soja.",
      },
      siEstaSeco: {
        cultivo: "Maíz Tardío (Diciembre) o Sorgo",
        motivo:
          "Como el doble cultivo secó el perfil profundo, atrasar la siembra permite recargar agua con las lluvias de primavera.",
      },
    },
    en: {
      nombre: "Double Crop (Wheat / 2nd Soybean)",
      consumoAgua: "890 - 980 mm/year",
      balanceNitrogeno: "Balanced (Wheat extracts N / Soybean partially replenishes)",
      balanceCarbono: "Positive (+ Living roots and residue all year)",
      efectoNapa: "Lowers the water table (~35 cm deeper than a single crop).",
      resumenDesgaste:
        "Protects soil structure and controls high water tables, but uses an extra 150 to 500 mm of water, leaving the profile depleted.",
      siHayHumedad: {
        cultivo: "Early Corn",
        motivo:
          "The profile has already recovered enough moisture to take advantage of the good soil structure left by the Wheat/Soybean sequence.",
      },
      siEstaSeco: {
        cultivo: "Late Corn (December) or Sorghum",
        motivo:
          "Since the double crop dried the deep profile, delaying planting lets spring rains recharge the soil water.",
      },
    },
  },
  algodon: {
    icono: "☁️",
    kcPromedio: 0.82,
    desgasteBase: 80,
    semaforo: "ROJO",
    color: "#d32f2f",
    carbonoNegativo: true,
    iconoSiHumedad: "🌽",
    iconoSiSeco: "🌾",
    es: {
      nombre: "Algodón",
      consumoAgua: "700 - 1300 mm",
      balanceNitrogeno: "Negativo (- Alta extracción nutricional)",
      balanceCarbono: "Negativo (- Poca cobertura superficial remanente)",
      efectoNapa: "Alto consumo profundo durante su ciclo largo.",
      resumenDesgaste:
        "Desgaste elevado de agua y nutrientes con escaso rastrojo en superficie, exponiendo el suelo al planchado por lluvias.",
      siHayHumedad: {
        cultivo: "Maíz o Trigo de Cobertura",
        motivo:
          "Es prioritario incorporar una gramínea de alto volumen de rastrojo para devolver carbono y porosidad al lote.",
      },
      siEstaSeco: {
        cultivo: "Sorgo / Mijo o Cultivo de Servicio",
        motivo:
          "El sorgo tolera la escasez de agua dejada por el algodón y genera la cobertura que el lote necesita urgentemente.",
      },
    },
    en: {
      nombre: "Cotton",
      consumoAgua: "700 - 1300 mm",
      balanceNitrogeno: "Negative (- High nutrient extraction)",
      balanceCarbono: "Negative (- Little remaining surface cover)",
      efectoNapa: "High deep water use during its long cycle.",
      resumenDesgaste:
        "Heavy water and nutrient depletion with little surface residue, leaving the soil exposed to crusting from rain.",
      siHayHumedad: {
        cultivo: "Corn or Wheat Cover Crop",
        motivo:
          "Priority is to add a high-residue grass crop to return carbon and porosity to the field.",
      },
      siEstaSeco: {
        cultivo: "Sorghum / Millet or Service Crop",
        motivo:
          "Sorghum tolerates the water shortage left by cotton and produces the cover the field urgently needs.",
      },
    },
  },
  girasol: {
    icono: "🌻",
    kcPromedio: 0.79,
    desgasteBase: 65,
    semaforo: "AMARILLO",
    color: "#ef6c00",
    carbonoNegativo: false,
    iconoSiHumedad: "🌾",
    iconoSiSeco: "🫘",
    es: {
      nombre: "Girasol",
      consumoAgua: "600 - 1000 mm",
      balanceNitrogeno: "Negativo (- Extracción moderada/alta)",
      balanceCarbono: "Bajo (- Tallos gruesos pero poca cobertura fina)",
      efectoNapa: "Seca los estratos profundos por su raíz pivotante.",
      resumenDesgaste:
        "Consume humedad profunda y deja poca cobertura fina en superficie. Requiere cortar el ciclo de enfermedades de oleaginosas.",
      siHayHumedad: {
        cultivo: "Trigo + Soja 2da o Maíz",
        motivo:
          "Las gramíneas cortan el ciclo de hongos del girasol y cubren rápidamente la superficie del suelo.",
      },
      siEstaSeco: {
        cultivo: "Poroto o Cultivo de Cobertura Invernal",
        motivo:
          "Baja demanda de agua (300-500 mm) y fijación biológica de nitrógeno para recuperar el lote.",
      },
    },
    en: {
      nombre: "Sunflower",
      consumoAgua: "600 - 1000 mm",
      balanceNitrogeno: "Negative (- Moderate/high extraction)",
      balanceCarbono: "Low (- Thick stalks but little fine cover)",
      efectoNapa: "Dries deep soil layers due to its taproot.",
      resumenDesgaste:
        "Uses deep moisture and leaves little fine surface cover. The oilseed disease cycle needs to be broken.",
      siHayHumedad: {
        cultivo: "Wheat + 2nd Soybean or Corn",
        motivo:
          "Grass crops break the sunflower's fungal disease cycle and quickly cover the soil surface.",
      },
      siEstaSeco: {
        cultivo: "Dry Bean or Winter Cover Crop",
        motivo:
          "Low water demand (300-500 mm) and biological nitrogen fixation to restore the field.",
      },
    },
  },
  pastura: {
    icono: "🍀",
    kcPromedio: 1.0,
    desgasteBase: 15,
    semaforo: "VERDE",
    color: "#2e7d32",
    carbonoNegativo: false,
    iconoSiHumedad: "🌽",
    iconoSiSeco: "🌾",
    es: {
      nombre: "Alfalfa / Pastura Perenne",
      consumoAgua: "904 - 2000 mm/año",
      balanceNitrogeno: "Muy Positivo (++ Máxima fijación de N)",
      balanceCarbono: "Muy Positivo (++ Regenera estructura e infiltración)",
      efectoNapa: "Deprime fuertemente la napa (>2 m), evitando salinización.",
      resumenDesgaste:
        "Suelo regenerado en estructura y nitrógeno, aunque con reservas hídricas profundas consumidas por la pradera.",
      siHayHumedad: {
        cultivo: "Maíz de Alta Producción o Trigo",
        motivo:
          "El lote tiene su máxima fertilidad nitrogenada y física; con buena humedad superficial alcanzará su techo de rinde.",
      },
      siEstaSeco: {
        cultivo: "Barbecho ➔ Sorgo o Maíz Tardío",
        motivo:
          "Conviene acumular lluvias en primavera antes de sembrar para reponer el agua profunda que consumió la alfalfa.",
      },
    },
    en: {
      nombre: "Alfalfa / Perennial Pasture",
      consumoAgua: "904 - 2000 mm/year",
      balanceNitrogeno: "Very Positive (++ Maximum N fixation)",
      balanceCarbono: "Very Positive (++ Restores structure and infiltration)",
      efectoNapa: "Strongly lowers the water table (>2 m), preventing salinization.",
      resumenDesgaste:
        "Soil restored in structure and nitrogen, although the pasture has used up the deep water reserves.",
      siHayHumedad: {
        cultivo: "High-Yield Corn or Wheat",
        motivo:
          "The field is at its peak nitrogen and physical fertility; with good surface moisture it will reach its yield ceiling.",
      },
      siEstaSeco: {
        cultivo: "Fallow ➔ Sorghum or Late Corn",
        motivo:
          "Better to store spring rainfall before planting to replenish the deep water used by the alfalfa.",
      },
    },
  },
};

const TEXTOS_CONDICION = {
  es: {
    conReserva: "Con reserva de humedad en el lote",
    baja: "Con baja humedad medida en el lote",
    estandar: "Estimación estándar (analizá el lote arriba para ajustar por humedad real)",
    alertaNitrato:
      "Alerta de lixiviación: la alta humedad sobre suelo con poco rastrojo acelera el lavado de nitratos (N-NO3).",
  },
  en: {
    conReserva: "With moisture reserve in the field",
    baja: "With low measured moisture in the field",
    estandar: "Standard estimate (analyze the field above to adjust for actual moisture)",
    alertaNitrato:
      "Leaching alert: high moisture on soil with little residue speeds up nitrate (N-NO3) leaching.",
  },
};

export class RotacionModel {
  /**
   * Calcula el desgaste aproximado y la rotación sugerida cruzando
   * el cultivo anterior con la humedad actual del lote (si existe diagnóstico).
   * @param {string} cultivoAnteriorId
   * @param {object|null} diagnosticoSuelo
   * @param {"es"|"en"} idioma
   */
  static evaluarRotacion(cultivoAnteriorId = "soja", diagnosticoSuelo = null, idioma = "es") {
    const regla = REGLAS_CULTIVOS[cultivoAnteriorId] || REGLAS_CULTIVOS.soja;
    const lang = idioma === "en" ? "en" : "es";
    const txt = regla[lang];
    const cond = TEXTOS_CONDICION[lang];

    // Humedad profunda o superficial del diagnóstico actual del lote (si ya se midió)
    const humProfunda = numeroONull(diagnosticoSuelo?.humedadUtilizada?.abajo);
    const humSuperficial = numeroONull(diagnosticoSuelo?.humedadUtilizada?.arriba);

    // Si aún no midió el lote, asumimos condición intermedia; si ya midió, >= 20% se considera buena reserva
    const buenaHumedad =
      humProfunda !== null
        ? humProfunda >= 20
        : humSuperficial !== null
        ? humSuperficial >= 22
        : true;

    let desgasteCalculado = regla.desgasteBase;
    let alertaNitrato = null;

    // Exceso de humedad superficial (>=30%) en un cultivo de bajo rastrojo: sube el desgaste por lavado de N
    if (humSuperficial !== null && humSuperficial >= 30 && regla.carbonoNegativo) {
      desgasteCalculado = Math.min(100, desgasteCalculado + 12);
      alertaNitrato = cond.alertaNitrato;
    }

    const sugerencia = buenaHumedad
      ? { ...txt.siHayHumedad, icono: regla.iconoSiHumedad }
      : { ...txt.siEstaSeco, icono: regla.iconoSiSeco };

    const hayMedicion = humProfunda !== null || humSuperficial !== null;

    return {
      cultivoAnteriorId,
      nombreAnterior: txt.nombre,
      iconoAnterior: regla.icono,
      consumoAgua: txt.consumoAgua,
      kcPromedio: regla.kcPromedio,
      desgastePorcentaje: desgasteCalculado,
      semaforo: regla.semaforo,
      color: regla.color,
      balanceNitrogeno: txt.balanceNitrogeno,
      balanceCarbono: txt.balanceCarbono,
      efectoNapa: txt.efectoNapa,
      resumenDesgaste: txt.resumenDesgaste,
      alertaNitrato,
      condicionHidricaTexto: hayMedicion
        ? buenaHumedad
          ? cond.conReserva
          : cond.baja
        : cond.estandar,
      recomendacion: sugerencia,
    };
  }
}

function numeroONull(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}