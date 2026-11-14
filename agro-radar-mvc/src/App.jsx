import { useLoteController } from './Controller/useLoteController';
import { LoteView } from './View/LoteView';

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
    />
  );
}