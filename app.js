
import { useLoteController } from './controllers/useLoteController';
import { LoteView } from './views/LoteView';

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