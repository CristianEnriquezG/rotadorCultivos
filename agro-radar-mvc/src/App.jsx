import { useLoteController } from './Controller/useLoteController';
import { LoteView } from './View/loteView';

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
      onAnalizarGPS={analizarUbicacionGPS}
      onProbarFernandez={() => analizarCoordenadas(-27.9150, -63.8550)}
      onEscuchar={reproducirAudio}
    />
  );
}