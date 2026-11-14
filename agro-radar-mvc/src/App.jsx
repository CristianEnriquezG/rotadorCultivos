import { useLoteController } from './Controller/useLoteController';
import { LoteView } from './View/LoteView';

export default function App() {
  const {
    diagnostico,
    ubicacion,
    cargando,
    error,
    analizarUbicacionGPS,
    reproducirAudio,
  } = useLoteController();

  return (
    <LoteView
      diagnostico={diagnostico}
      ubicacion={ubicacion}
      cargando={cargando}
      error={error}
      onAnalizarGPS={(modo) => analizarUbicacionGPS(modo)}
      onEscuchar={reproducirAudio}
    />
  );
}