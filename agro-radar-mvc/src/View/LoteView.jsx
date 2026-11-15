import { MapaSelector } from "./mapaSelector";
import {
  traducirTextoDinamico,
  traducirContextoClimatico,
} from "../Model/textosIdioma";
import { RotacionView } from "./rotacionView";

export function LoteView({
  idioma = "es",
  textos = {},
  onVolverLanding,
  ubicacion,
  ubicacionNoDeterminada,
  mostrarMapa,
  onToggleMapa,
  onReintentarGPS,
  onSeleccionarPuntoMapa,
  diagnostico,
  cargando,
  error,
  onAnalizar,
  onEscuchar,
  usarHumedadManual,
  humedadManual = { arriba: "", abajo: "", fecha: "", metodo: "sensor" },
  onCambiarHumedadManual,
  cultivoAnterior,
  onCambiarCultivoAnterior,
  evaluacionRotacion,
  onEscucharRotacion,
  audioActivo = null,
  onDetenerAudio,
}) {
  const t = textos;
  const fuentesLimpias = [
    ...new Set((diagnostico?.fuentes ?? []).map((f) => normalizarFuente(f, idioma))),
  ];
  const advertenciasLimpias = diagnostico?.advertencias ?? [];
  const tituloTraducido = diagnostico
    ? traducirTextoDinamico(diagnostico.titulo, idioma)
    : "";
  const mensajeTraducido = diagnostico
    ? traducirTextoDinamico(diagnostico.mensaje, idioma)
    : "";

  return (
    <div style={{ width: "100%", fontFamily: "sans-serif" }}>
      {/* Botón para volver al inicio */}
      {onVolverLanding && (
        <button
          type="button"
          onClick={onVolverLanding}
          style={{
            marginBottom: "14px",
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#ffffff",
            color: "#1e293b",
            cursor: "pointer",
          }}
        >
          ⬅ {t.volverInicio}
        </button>
      )}

      {/* Tarjeta de Ubicación */}
      <div
        style={{
          marginBottom: "16px",
          padding: "14px 16px",
          borderRadius: "10px",
          backgroundColor: ubicacionNoDeterminada ? "#fff3e0" : "#f5f5f5",
          borderLeft: ubicacionNoDeterminada
            ? "6px solid #ef6c00"
            : "6px solid #1976d2",
          color: "#111111",
          textAlign: "left",
        }}
      >
        <div style={{ fontSize: "17px", fontWeight: "bold" }}>
          {ubicacion
            ? `📍 ${traducirTextoDinamico(ubicacion.nombreCorto, idioma)}`
            : ubicacionNoDeterminada
            ? `⚠️ ${t.ubicacionNoDeterminada}`
            : `📍 ${t.detectandoGPS}`}
        </div>

        {ubicacion && (
          <div style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>
            {t.coordenadas}: {ubicacion.lat}, {ubicacion.lon}
          </div>
        )}

        {!ubicacion && ubicacionNoDeterminada && (
          <div style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>
            {t.ubicacionNoDeterminadaDesc}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {onToggleMapa && (
            <button
              type="button"
              onClick={() => onToggleMapa(!mostrarMapa)}
              style={botonUbicacion}
            >
              🗺️ {mostrarMapa ? t.ocultarMapa : t.elegirEnMapa}
            </button>
          )}
          {onReintentarGPS && (
            <button
              type="button"
              onClick={onReintentarGPS}
              style={{ ...botonUbicacion, backgroundColor: "#455a64" }}
            >
              📡 {t.usarGPS}
            </button>
          )}
        </div>
      </div>

      {/* Selector de Mapa */}
      {mostrarMapa && (
        <div style={{ marginBottom: "16px" }}>
          <MapaSelector
            coordenadasActuales={ubicacion}
            textos={t}
            onSeleccionarPunto={onSeleccionarPuntoMapa}
          />
        </div>
      )}

      {/* Formulario de Medición con Instrumentos (si eligió el botón derecho en el Landing) */}
      {usarHumedadManual && (
        <div
          style={{
            marginBottom: "16px",
            padding: "14px",
            borderRadius: "10px",
            backgroundColor: "#eef2f6",
            border: "1px solid #cbd5e1",
            color: "#111",
            textAlign: "left",
          }}
        >
          <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#0f172a" }}>
            📟 {t.tituloInstrumentos}
          </h3>
          <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#475569", lineHeight: 1.4 }}>
            {t.descInstrumentos}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Campo etiqueta={t.humedadSuperficial} ayuda={t.ayudaSuperficial}>
              <input
                type="number"
                step="0.1"
                placeholder={`${t.ejemplo} 24`}
                value={humedadManual.arriba}
                onChange={(e) => onCambiarHumedadManual?.("arriba", e.target.value)}
                style={control}
              />
            </Campo>
            <Campo etiqueta={t.humedadProfunda} ayuda={t.ayudaProfunda}>
              <input
                type="number"
                step="0.1"
                placeholder={`${t.ejemplo} 22`}
                value={humedadManual.abajo}
                onChange={(e) => onCambiarHumedadManual?.("abajo", e.target.value)}
                style={control}
              />
            </Campo>
            <Campo etiqueta={t.fechaHora}>
              <input
                type="datetime-local"
                lang={idioma === "en" ? "en-US" : "es-AR"}
                value={humedadManual.fecha}
                onChange={(e) => onCambiarHumedadManual?.("fecha", e.target.value)}
                style={control}
              />
            </Campo>
            <Campo etiqueta={t.metodoUtilizado}>
              <select
                value={humedadManual.metodo}
                onChange={(e) => onCambiarHumedadManual?.("metodo", e.target.value)}
                style={control}
              >
                <option value="sensor">{t.metodoSensor}</option>
                <option value="gravimetrico">{t.metodoGravimetrico}</option>
                <option value="estimacion">{t.metodoEstimacion}</option>
              </select>
            </Campo>
          </div>
        </div>
      )}

      {/* Botones de Acción: Siembra y Cosecha (el emoji ya viene en el texto) */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
        <button
          type="button"
          onClick={() => onAnalizar?.("SIEMBRA")}
          disabled={cargando}
          style={{ ...botonAccion, backgroundColor: "#2e7d32" }}
        >
          {t.btnSembrar}
        </button>

        <button
          type="button"
          onClick={() => onAnalizar?.("COSECHA")}
          disabled={cargando}
          style={{ ...botonAccion, backgroundColor: "#1565c0" }}
        >
          {t.btnCosechar}
        </button>
      </div>

      {cargando && (
        <p style={{ textAlign: "center", fontSize: "16px", marginTop: "12px" }}>
          {t.cargando}
        </p>
      )}

      {error && (
        <p style={{ color: "#d32f2f", fontSize: "15px", marginTop: "12px", textAlign: "center", fontWeight: "bold" }}>
          ⚠️ {traducirTextoDinamico(error, idioma)}
        </p>
      )}

      {/* Resultado del Semáforo de Siembra / Cosecha */}
      {diagnostico && !cargando && (
        <div
          style={{
            marginTop: "16px",
            padding: "18px",
            borderRadius: "12px",
            backgroundColor: colorPorTipo(diagnostico.semaforo || diagnostico.tipo),
            color: "white",
            textAlign: "left",
          }}
        >
          <h2 style={{ margin: "0 0 8px 0", fontSize: "21px", color: "#ffffff" }}>{tituloTraducido}</h2>
          <p style={{ fontSize: "16px", lineHeight: 1.4, margin: "0 0 12px" }}>
            {mensajeTraducido}
          </p>

          {diagnostico.humedadUtilizada && (
            <BloqueResultado titulo={t.humedadUtilizada}>
              <p style={parrafoDetalle}>
                {t.superficial}:{" "}
                {formatearPorcentaje(
                  diagnostico.humedadUtilizada.arriba ??
                    extraerPorcentajesDeMensaje(diagnostico.mensaje).arriba,
                  t.noDisponible
                )}
              </p>
              <p style={parrafoDetalle}>
                {t.profunda}:{" "}
                {formatearPorcentaje(
                  diagnostico.humedadUtilizada.abajo ??
                    extraerPorcentajesDeMensaje(diagnostico.mensaje).abajo,
                  t.noDisponible
                )}
              </p>
              <p style={parrafoDetalle}>
                {t.fuente}:{" "}
                {normalizarFuente(diagnostico.humedadUtilizada.fuente, idioma)}
              </p>
            </BloqueResultado>
          )}

          {diagnostico.contextoClimatico && (
            <BloqueResultado titulo={t.contextoClimatico}>
              <p style={parrafoDetalle}>
                {traducirContextoClimatico(
                  diagnostico.contextoClimatico.explicacion,
                  idioma
                )}
              </p>
              {diagnostico.contextoClimatico.periodo && (
                <p style={parrafoDetalle}>
                  {t.periodo}: {diagnostico.contextoClimatico.periodo}
                </p>
              )}
              {diagnostico.contextoClimatico.fuente && (
                <p style={parrafoDetalle}>
                  {t.fuente}: {diagnostico.contextoClimatico.fuente}
                </p>
              )}
            </BloqueResultado>
          )}

          {fuentesLimpias.length > 0 && (
            <BloqueResultado titulo={t.fuentesUtilizadas}>
              <p style={parrafoDetalle}>{fuentesLimpias.join(" + ")}</p>
            </BloqueResultado>
          )}

          {advertenciasLimpias.length > 0 && (
            <BloqueResultado titulo={t.advertencias}>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {advertenciasLimpias.map((advertencia, indice) => (
                  <li
                    key={`${advertencia}-${indice}`}
                    style={{ marginBottom: "6px" }}
                  >
                    {traducirTextoDinamico(advertencia, idioma)}
                  </li>
                ))}
              </ul>
            </BloqueResultado>
          )}

          <p
            style={{
              margin: "14px 0 0",
              fontSize: "12px",
              lineHeight: 1.4,
              color: "#ffffff",
            }}
          >
            {t.notaOrientativa}
          </p>

          <button
            type="button"
            onClick={audioActivo === "diagnostico" ? onDetenerAudio : onEscuchar}
            aria-pressed={audioActivo === "diagnostico"}
            style={{
              marginTop: "14px",
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: audioActivo === "diagnostico" ? "2px solid #c62828" : "none",
              backgroundColor: "white",
              color: audioActivo === "diagnostico" ? "#c62828" : "#111111",
              cursor: "pointer",
            }}
          >
            {audioActivo === "diagnostico" ? t.detenerAudio : t.escuchar}
          </button>
        </div>
      )}

      {/* Rotación de Cultivo y Aproximación de Desgaste */}
      <RotacionView
        idioma={idioma}
        textos={t}
        cultivoAnterior={cultivoAnterior}
        onCambiarCultivoAnterior={onCambiarCultivoAnterior}
        evaluacionRotacion={evaluacionRotacion}
        onEscucharRotacion={onEscucharRotacion}
        leyendo={audioActivo === "rotacion"}
        onDetenerAudio={onDetenerAudio}
      />
    </div>
  );
}

function normalizarFuente(fuente, idioma = "es") {
  if (!fuente) return "OpenWeather";
  const texto = String(fuente).toUpperCase();
  if (texto.includes("CONAE") || texto.includes("OPEN-METEO")) {
    return "OpenWeather";
  }
  if (texto.includes("MANUAL")) {
    const metodos = {
      SENSOR: { es: "Sensor de humedad", en: "Moisture sensor" },
      GRAVIMETRICO: { es: "Método gravimétrico", en: "Gravimetric method" },
      ESTIMACION: { es: "Estimación manual", en: "Manual estimation" },
    };
    const clave = Object.keys(metodos).find((m) => texto.includes(m));
    const lang = idioma === "en" ? "en" : "es";
    const prefijo = lang === "en" ? "Field measurement" : "Medición a campo";
    return clave ? `${prefijo} – ${metodos[clave][lang]}` : prefijo;
  }
  return fuente;
}

function extraerPorcentajesDeMensaje(mensaje = "") {
  const coincidencias = [...String(mensaje).matchAll(/(\d+(?:\.\d+)?)\s*%/g)];
  return {
    arriba: coincidencias[0] ? Number(coincidencias[0][1]) : null,
    abajo: coincidencias[1] ? Number(coincidencias[1][1]) : null,
  };
}

function Campo({ etiqueta, ayuda, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <span style={{ fontSize: "13px", fontWeight: "bold" }}>{etiqueta}</span>
      {children}
      {ayuda && <span style={{ fontSize: "11px", color: "#666" }}>{ayuda}</span>}
    </label>
  );
}

function BloqueResultado({ titulo, children }) {
  return (
    <div
      style={{
        marginTop: "10px",
        padding: "10px 12px",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        color: "#1e293b",
      }}
    >
      <h3 style={{ margin: "0 0 6px", fontSize: "15px", color: "#0f172a" }}>{titulo}</h3>
      {children}
    </div>
  );
}

function formatearPorcentaje(valor, noDisponible = "No disponible") {
  return Number.isFinite(valor) ? `${valor.toFixed(1)} %` : noDisponible;
}

function colorPorTipo(tipo) {
  if (tipo === "FAVORABLE" || tipo === "VERDE") return "#2e7d32";
  if (tipo === "HUMEDO" || tipo === "AMARILLO") return "#b45309";
  return "#d32f2f";
}

const botonUbicacion = {
  marginTop: "10px",
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: "bold",
  borderRadius: "6px",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const botonAccion = {
  flex: 1,
  padding: "16px 10px",
  fontSize: "17px",
  fontWeight: "bold",
  borderRadius: "10px",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const control = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #aeb7c2",
  backgroundColor: "white",
  color: "#111",
};

const parrafoDetalle = {
  margin: "4px 0",
  fontSize: "13px",
  lineHeight: 1.4,
  color: "#1e293b",
};