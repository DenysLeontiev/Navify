import L from "leaflet";
import { environment } from "../../environments/environment.development";

let mapboxAccessToken: string = environment.mapboxAccessToken;

export let tileLayers = {
    street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }),
    satellite: L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '© Google Satellite'
    }),
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CartoDB</a>'
    }),
    terrain: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
        attribution: '© Mapbox © OpenStreetMap contributors'
    }),

    light: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
        attribution: '© Mapbox © OpenStreetMap contributors'
    }),

    satelliteStreets: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
        attribution: '© Mapbox © OpenStreetMap contributors'
    }),

    navigation: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/navigation-preview-day-v3/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
        attribution: '© Mapbox © OpenStreetMap contributors'
    }),

    traffic: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/traffic-day-v3/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
        attribution: '© Mapbox © OpenStreetMap contributors'
    }),

    highContrast: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/high-contrast-v10/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
        attribution: '© Mapbox © OpenStreetMap contributors'
    }),

    pirate: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/pirate-v2/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
        attribution: '© Mapbox © OpenStreetMap contributors'
    }),

    trafficNight: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/traffic-night-v3/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
        attribution: '© Mapbox © OpenStreetMap contributors'
    }),

    outdoors: L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
        attribution: '© Mapbox © OpenStreetMap contributors'
    }),
};