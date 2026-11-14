import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/conae-wms': {
        target: 'https://geoservicios.conae.gov.ar',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/conae-wms/, '/geoserver/wms'),
      },
    },
  },
})