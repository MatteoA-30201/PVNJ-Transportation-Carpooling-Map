const script = document.getElementById("search-js");
// wait for the Mapbox Search JS script to load before using it
script.onload = function () {
  const mapboxAccessToken =
    "pk.eyJ1IjoibWF0dG9udGhlbW9vbiIsImEiOiJjbXNqOG5oNjYwZHg5MzRweTdybGd6amx1In0.EOwmeU1s_Tw118I1f8sf2Q";

  const bounds = [
    [-79.11545466088057, 36.833508231745355], // Southwest coordinates
    [-70, 44.133618], // Northeast coordinates
  ];

  const map = new mapboxgl.Map({
    accessToken:
      "pk.eyJ1IjoibWF0dG9udGhlbW9vbiIsImEiOiJjbXNqOG5oNjYwZHg5MzRweTdybGd6amx1In0.EOwmeU1s_Tw118I1f8sf2Q",
    container: "map", // container ID
    style: "mapbox://styles/mattonthemoon/cmsja28wx00k001s9ehrd8s16",
    maxBounds: bounds, // Set the map's geographical boundaries.
    center: [-74.5, 40.3], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 8,
  });

  map.addControl(new mapboxgl.FullscreenControl());

  // disable map rotation using right click + drag
  map.dragRotate.disable();
  // disable map rotation using touch rotation gesture
  map.touchZoomRotate.disableRotation();

  // Creates a new scale control to measure the map
  const scale = new mapboxgl.ScaleControl({
    maxWidth: 120, // the max pixel width of the scale bar to be rendered on the map (default is 100 pixels)
    unit: "imperial", // The type of measurement displayed, options are: 'imperial', 'metric', 'nautical' (default it metric)
  });

  // Adds the new scale control to the map
  map.addControl(scale);

  //  instantiate a new search box instance
  const searchBox = new mapboxsearch.MapboxSearchBox();

  // set the mapboxgl library to use for markers and enable the marker functionality
  searchBox.mapboxgl = mapboxgl;
  searchBox.marker = true;

  // add the search box instance to the Map Control interface
  map.addControl(searchBox);

  map.on("sourcedata", function (e) {
    if (
      map.getSource("mapbox://mattonthemoon.65dqzqtnqg64", {
        sourceLayer: "fbe4f741907debe366fe",
      }) &&
      map.isSourceLoaded("mapbox://mattonthemoon.65dqzqtnqg64", {
        sourceLayer: "fbe4f741907debe366fe",
      })
    ) {
      console.log("source loaded!");
      var features = map.querySourceFeatures(
        "mapbox://mattonthemoon.65dqzqtnqg64",
        { sourceLayer: "fbe4f741907debe366fe" },
      );

      for (let i = 0; i < features.length; i++) {
        const point = [features[i]._x, features[i]._y];
        const featureCoordinate = map.unproject(point);
        console.log(featureCoordinate);
        console.log(features);
        // const distance = ruler.distance([coordinate], [featureCoordinate]);
      }
    }
  });

  //  const geolocate = new mapboxgl.GeolocateControl({
  //      positionOptions: {
  //          enableHighAccuracy: true
  //      },
  //      trackUserLocation: true
  //  });
  //   //  Add the control to the map.
  //  map.addControl(geolocate);
  //   //  Wait until the control is set up before triggering it.
  //  geolocate.once('ready', () => {
  //      geolocate.trigger();
  //      console.log('A geolocate event has occurred.');

  //      function success(pos) {
  //        const crd = pos.coords;
  //        const coordinate = [crd.longitude, crd.latitude];
  //        const point = map.project(coordinate);

  //        console.log(point);
  //        console.log("Your current position is:");
  //        console.log(`Latitude: ${crd.latitude}`);
  //        console.log(`Longitude: ${crd.longitude}`);
  //        console.log(`More or less ${crd.accuracy} meters.`);
  //      }

  //      function error(err) {
  //        console.warn(`ERROR(${err.code}): ${err.message}`);
  //      }

  //      navigator.geolocation.getCurrentPosition(success, error);
  //  });

  const options = {
    enableHighAccuracy: true,
  };

  function success(pos) {
    console.log("A geolocate event has occurred.");
    const crd = pos.coords;
    const coordinate = [crd.longitude, crd.latitude];
    const point = map.project(coordinate);

    console.log("Your current position is:");
    console.log(`Latitude: ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    console.log(coordinate);
    console.log(point);

    //  set the mapbox access token, search box API options
    searchBox.accessToken = mapboxAccessToken;
    searchBox.options = {
      language: "en",
      limit: 5,
      proximity: [coordinate],
    };
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
};
