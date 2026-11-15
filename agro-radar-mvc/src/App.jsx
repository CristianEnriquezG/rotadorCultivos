import { useEffect, useState } from "react";
import { useLoteController } from "./Controller/useLoteController";
import { TEXTOS } from "./Model/textosIdioma";
import { LayoutApp } from "./View/layoutApp";
import { LandingView } from "./View/landingView";
import { LoteView } from "./View/LoteView";

export default function App() {
  const [idioma, setIdioma] = useState("en");
  const controller = useLoteController({ idioma });

  const [vistaActual, setVistaActual] = useState("LANDING"); // "LANDING" | "LOTE"
  const [modoInstrumentos, setModoInstrumentos] = useState(false);

  const textos = TEXTOS[idioma];

  // Mantiene el atributo lang del documento sincronizado (accesibilidad / lectores de pantalla)
  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  const irAMedicionAproximada = () => {
    setModoInstrumentos(false);
    controller.setUsarHumedadManual(false);
    setVistaActual("LOTE");
  };

  const irAMedicionInstrumentos = () => {
    setModoInstrumentos(true);
    controller.setUsarHumedadManual(true);
    setVistaActual("LOTE");
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
          onToggleMapa={controller.setMostrarMapa}
          onReintentarGPS={controller.detectarGPSNavegador}
          onSeleccionarPuntoMapa={controller.seleccionarUbicacionManual}
          diagnostico={controller.diagnostico}
          cargando={controller.cargando}
          error={controller.error}
          onAnalizar={controller.analizarLote}
          onEscuchar={controller.reproducirAudio}
          usarHumedadManual={modoInstrumentos}
          humedadManual={controller.humedadManual}
          onCambiarHumedadManual={controller.actualizarHumedadManual}
          cultivoAnterior={controller.cultivoAnterior}
          onCambiarCultivoAnterior={controller.cambiarCultivoAnterior}
          evaluacionRotacion={controller.evaluacionRotacion}
          onEscucharRotacion={controller.reproducirAudioRotacion}
        />
      )}
    </LayoutApp>
  );
}