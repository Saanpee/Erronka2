/**
 * Produkzio ingurunea - ElorAdmin
 */

export const environment = {
  production: true,

  // API zerbitzariaren URLa
  apiUrl: 'https://api.eloradmin.eus/api',

  // Mapbox Access Token - Reemplazar con tu token de producción
  mapboxToken: 'pk.eyJ1IjoiMjRhc2llciIsImEiOiJjbWtndmhvdHowYmd4M2VzY2JnYnE5M2ZnIn0.Fo4eMP8RYWyGywPCUFgLfg',

  // OpenData Euskadi API
  openDataUrl: 'https://opendata.euskadi.eus/contenidos/ds_centros_702/centros_702/opendata',

  // Elorrieta-Erreka Mari lehenetsi
  defaultCenter: {
    lat: 43.2838054054815,
    lng: -2.9647425296213408
  },

  // Zoom konfigurazioa
  defaultZoom: 13, // Zoom lehenetsia
  minZoom: 9,      // Zoom minimoa
  maxZoom: 18,     // Zoom maximoa

  // Sesioa iraungitzeko denbora (minututan)
  sessionTimeout: 60
};
