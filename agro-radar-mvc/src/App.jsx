import { useLoteController } from './Controller/useLoteController';
import { LoteView } from './View/LoteView';

export default function App() {
  const {
    diagnostico,
    cargando,
    error,
    analizarUbicacionGPS,
    analizarCoordenadas,
    reproducirAudio,
  } = useLoteController();

  return (
    <LoteView
      diagnostico={diagnostico}
      cargando={cargando}
      error={error}
      onAnalizarGPS={(modo) => analizarUbicacionGPS(modo)}
      onProbarFernandez={(modo) => analizarCoordenadas(-27.9150, -63.8550, modo)}
      onEscuchar={reproducirAudio}
    />
  );
}