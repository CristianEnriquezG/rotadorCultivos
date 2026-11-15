import { useLoteController } from "./Controller/useLoteController.js";
import { LoteView } from "./View/LoteView.jsx";

export default function App() {
  const {
    ubicacion,
    ubicacionNoDeterminada,
    mostrarMapa,
    setMostrarMapa,
    diagnostico,
    cargando,
    error,
    detectarGPSNavegador,
    seleccionarUbicacionManual,
    analizarLote,
    reproducirAudio,
    usarHumedadManual,
    setUsarHumedadManual,
    humedadManual,
    actualizarHumedadManual,
  } = useLoteController();

  return (
    <LoteView
      ubicacion={ubicacion}
      ubicacionNoDeterminada={ubicacionNoDeterminada}
      mostrarMapa={mostrarMapa}
      onToggleMapa={setMostrarMapa}
      onReintentarGPS={detectarGPSNavegador}
      onSeleccionarPuntoMapa={seleccionarUbicacionManual}
      diagnostico={diagnostico}
      cargando={cargando}
      error={error}
      onAnalizar={analizarLote}
      onEscuchar={reproducirAudio}
      usarHumedadManual={usarHumedadManual}
      onCambiarUsoHumedadManual={setUsarHumedadManual}
      humedadManual={humedadManual}
      onCambiarHumedadManual={actualizarHumedadManual}
    />
  );
}
