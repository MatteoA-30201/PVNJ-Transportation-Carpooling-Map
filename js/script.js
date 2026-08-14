

const bounds = [
        [-77.11545466088057, 38.833508231745355], // Southwest coordinates
        [-72, 44.133618] // Northeast coordinates
    ];


const map = new mapboxgl.Map({
  accessToken: 'pk.eyJ1IjoibWF0dG9udGhlbW9vbiIsImEiOiJjbXNqOG5oNjYwZHg5MzRweTdybGd6amx1In0.EOwmeU1s_Tw118I1f8sf2Q',
  container: 'map', // container ID
  style: 'style.json',
  maxBounds: bounds, // Set the map's geographical boundaries.
  center: [-74.5, 40.3], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 8,
});

// disable map rotation using right click + drag
map.dragRotate.disable();
// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

// Creates a new scale control to measure the map
const scale = new mapboxgl.ScaleControl({
    maxWidth: 120, // the max pixel width of the scale bar to be rendered on the map (default is 100 pixels)
    unit: 'imperial' // The type of measurement displayed, options are: 'imperial', 'metric', 'nautical' (default it metric)
});

// Adds the new scale control to the map
map.addControl(scale);

map.addControl(new mapboxgl.FullscreenControl());

const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});
// Add the control to the map.
map.addControl(geolocate);
// Set an event listener that fires
// when a geolocate event occurs.
geolocate.on('geolocate', () => {
    console.log('A geolocate event has occurred.');
    
    function success(pos) {
      const crd = pos.coords;
      const coordinate = [crd.longitude, crd.latitude];
      const point = map.project(coordinate);

      console.log(point);
      console.log("Your current position is:");
      console.log(`Latitude: ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error);
});

map.addControl(
  new MapboxDirections({
    accessToken: 'pk.eyJ1IjoibWF0dG9udGhlbW9vbiIsImEiOiJjbXNqOG5oNjYwZHg5MzRweTdybGd6amx1In0.EOwmeU1s_Tw118I1f8sf2Q'
  }),
  'top-left'
);

map.on("sourcedata", function(e) {
    if (map.getSource('mapbox://mattonthemoon.65dqzqtnqg64', {sourceLayer: '3a7246e4498ccb53d918'}) && map.isSourceLoaded('mapbox://mattonthemoon.65dqzqtnqg64', {sourceLayer: '3a7246e4498ccb53d918'})) {
        console.log('source loaded!');
        var features = map.querySourceFeatures('mapbox://mattonthemoon.65dqzqtnqg64', {sourceLayer: '3a7246e4498ccb53d918'});
        console.log(features);
    }
});