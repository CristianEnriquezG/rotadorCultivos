import { useState } from "react";
import { useLoteController } from "./Controller/useLoteController";
import { TEXTOS, traducirTextoDinamico } from "./Model/textosIdioma";
import { LayoutApp } from "./View/layoutApp";
import { LandingView } from "./View/landingView";
import { LoteView } from "./View/LoteView";

export default function App() {
  const controller = useLoteController();

  const [idioma, setIdioma] = useState("en");
  const [vistaActual, setVistaActual] = useState("LANDING"); // "LANDING" | "LOTE"
  const [modoInstrumentos, setModoInstrumentos] = useState(false);
  const [humedadManualLocal, setHumedadManualLocal] = useState({
    arriba: "",
    abajo: "",
    fecha: "",
    metodo: "sensor",
  });

  const textos = TEXTOS[idioma];

  const irAMedicionAproximada = () => {
    setModoInstrumentos(false);
    controller.setUsarHumedadManual?.(false);
    controller.onCambiarUsoHumedadManual?.(false);
    setVistaActual("LOTE");
  };

  const irAMedicionInstrumentos = () => {
    setModoInstrumentos(true);
    controller.setUsarHumedadManual?.(true);
    controller.onCambiarUsoHumedadManual?.(true);
    setVistaActual("LOTE");
  };

  const manejarCambioHumedadManual = (campo, valor) => {
    setHumedadManualLocal((prev) => ({ ...prev, [campo]: valor }));
    const fnController =
      controller.actualizarHumedadManual ||
      controller.onCambiarHumedadManual ||
      controller.cambiarHumedadManual;
    if (fnController) {
      fnController(campo, valor);
    }
  };

  const manejarAnalizar = (modo) => {
    const fnAnalizar =
      controller.analizarLote ||
      controller.analizarUbicacionGPS ||
      controller.onAnalizar;
    if (fnAnalizar) {
      fnAnalizar(modo);
    }
  };

  const escucharEnIdiomaActual = () => {
    if (idioma === "es" && controller.reproducirAudio) {
      controller.reproducirAudio();
      return;
    }
    if (controller.diagnostico && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const titulo = traducirTextoDinamico(controller.diagnostico.titulo, idioma);
      const mensaje = traducirTextoDinamico(controller.diagnostico.mensaje, idioma);
      const voz = new SpeechSynthesisUtterance(`${titulo}. ${mensaje}`);
      voz.lang = idioma === "en" ? "en-US" : "es-AR";
      window.speechSynthesis.speak(voz);
    }
  };

  return (
    <LayoutApp
      idioma={idioma}
      onCambiarIdioma={setIdioma}
      textos={textos}
    >
      {vistaActual === "LANDING" ? (
        <LandingView
          textos={textos}
          onSeleccionarAproximada={irAMedicionAproximada}
          onSeleccionarInstrumentos={irAMedicionInstrumentos}
        />
      ) : (
        <LoteView
          idioma={idioma}
          textos={textos}
          onVolverLanding={() => setVistaActual("LANDING")}
          ubicacion={controller.ubicacion}
          ubicacionNoDeterminada={controller.ubicacionNoDeterminada}
          mostrarMapa={controller.mostrarMapa}
          onToggleMapa={controller.setMostrarMapa || controller.onToggleMapa}
          onReintentarGPS={
            controller.detectarGPSNavegador || controller.onReintentarGPS
          }
          onSeleccionarPuntoMapa={
            controller.seleccionarUbicacionManual ||
            controller.onSeleccionarPuntoMapa
          }
          diagnostico={controller.diagnostico}
          cargando={controller.cargando}
          error={controller.error}
          onAnalizar={manejarAnalizar}
          onEscuchar={escucharEnIdiomaActual}
          usarHumedadManual={modoInstrumentos}
          humedadManual={controller.humedadManual || humedadManualLocal}
          onCambiarHumedadManual={manejarCambioHumedadManual}
        />
      )}
    </LayoutApp>
  );
}