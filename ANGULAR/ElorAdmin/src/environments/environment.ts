export const environment = {
  production: false,

  // API zerbitzariaren URLa
  apiUrl: 'http://10.5.104.191:3000/api', 

  // Mapbox Access Token
  mapboxToken: 'pk.eyJ1IjoiMjRhc2llciIsImEiOiJjbWtndmhvdHowYmd4M2VzY2JnYnE5M2ZnIn0.Fo4eMP8RYWyGywPCUFgLfg',

  // OpenData Euskadi API
  openDataUrl: 'https://opendata.euskadi.eus/contenidos/ds_centros_702/centros_702/opendata',

  // Elorrieta-Erreka Mari lehenetsi
  defaultCenter: {
    lat: 43.2838054054815,
    lng: -2.9647425296213408
  },

  defaultZoom: 13,
  minZoom: 9,
  maxZoom: 18,

  sessionTimeout: 60
};
