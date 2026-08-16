const script = document.getElementById('search-js');
// wait for the Mapbox Search JS script to load before using it
script.onload = function () {
  const mapboxAccessToken = 'pk.eyJ1IjoibWF0dG9udGhlbW9vbiIsImEiOiJjbXNqOG5oNjYwZHg5MzRweTdybGd6amx1In0.EOwmeU1s_Tw118I1f8sf2Q';

  const bounds = [
          [-79.11545466088057, 36.833508231745355], // Southwest coordinates
          [-70, 44.133618] // Northeast coordinates
      ];

  const map = new mapboxgl.Map({
    accessToken: 'pk.eyJ1IjoibWF0dG9udGhlbW9vbiIsImEiOiJjbXNqOG5oNjYwZHg5MzRweTdybGd6amx1In0.EOwmeU1s_Tw118I1f8sf2Q',
    container: 'map', // container ID
    style: 'style.json',
    maxBounds: bounds, // Set the map's geographical boundaries.
    center: [-74.5, 40.3], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 8,
  });

  // map.on("sourcedata", function(e) {
  //   if (map.getSource('mapbox://mattonthemoon.65dqzqtnqg64', {sourceLayer: '3a7246e4498ccb53d918'}) && map.isSourceLoaded('mapbox://mattonthemoon.65dqzqtnqg64', {sourceLayer: '3a7246e4498ccb53d918'})) {
  //     console.log('source loaded!');
  //     var features = map.querySourceFeatures('mapbox://mattonthemoon.65dqzqtnqg64', {sourceLayer: '3a7246e4498ccb53d918'});
  //   }
  //   console.log(features);
  // });

  // const geolocate = new mapboxgl.GeolocateControl({
  //     positionOptions: {
  //         enableHighAccuracy: true
  //     },
  //     trackUserLocation: true
  // });
  // // Add the control to the map.
  // map.addControl(geolocate);
  // // Wait until the control is set up before triggering it.
  // geolocate.once('ready', () => {
  //     geolocate.trigger();
  //     console.log('A geolocate event has occurred.');
      
  //     function success(pos) {
  //       const crd = pos.coords;
  //       const coordinate = [crd.longitude, crd.latitude];
  //       const point = map.project(coordinate);

  //       console.log(point);
  //       console.log("Your current position is:");
  //       console.log(`Latitude: ${crd.latitude}`);
  //       console.log(`Longitude: ${crd.longitude}`);
  //       console.log(`More or less ${crd.accuracy} meters.`);
  //     }

  //     function error(err) {
  //       console.warn(`ERROR(${err.code}): ${err.message}`);
  //     }

  //     navigator.geolocation.getCurrentPosition(success, error);
  // });

  // // instantiate a new search box instance
  // const searchBox = new mapboxsearch.MapboxSearchBox()

  // // set the mapbox access token, search box API options
  // searchBox.accessToken = mapboxAccessToken
  // searchBox.options = {
  //   language: 'en',
  //   limit: 5,
  //   proximity: [-73.99209, 40.68933]
  // }

  // // set the mapboxgl library to use for markers and enable the marker functionality
  // searchBox.mapboxgl = mapboxgl
  // searchBox.marker = true

  // // add the search box instance to the Map Control interface
  // map.addControl(searchBox);
  
  // // disable map rotation using right click + drag
  // map.dragRotate.disable();
  // // disable map rotation using touch rotation gesture
  // map.touchZoomRotate.disableRotation();

  // // Creates a new scale control to measure the map
  // const scale = new mapboxgl.ScaleControl({
  //     maxWidth: 120, // the max pixel width of the scale bar to be rendered on the map (default is 100 pixels)
  //     unit: 'imperial' // The type of measurement displayed, options are: 'imperial', 'metric', 'nautical' (default it metric)
  // });

  // // Adds the new scale control to the map
  // map.addControl(scale);

  // map.addControl(new mapboxgl.FullscreenControl());

  // map.addControl(
  //     new MapboxDirections({
  //         accessToken: 'pk.eyJ1IjoibWF0dG9udGhlbW9vbiIsImEiOiJjbXNqOG5oNjYwZHg5MzRweTdybGd6amx1In0.EOwmeU1s_Tw118I1f8sf2Q'
  //     }),
  //     'top-left'
  // );

    // Holds visible airport features for filtering
    let airports = [];

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: false
    });

    const filterEl = document.getElementById('feature-filter');
    const listingEl = document.getElementById('feature-listing');

    function renderListings(features) {
        const empty = document.createElement('p');
        // Clear any existing listings
        listingEl.innerHTML = '';
        if (features.length) {
            for (const feature of features) {
                const itemLink = document.createElement('a');
                const label = `${feature.properties.name} (${feature.properties.abbrev})`;
                itemLink.href = feature.properties.wikipedia;
                itemLink.target = '_blank';
                itemLink.textContent = label;
                itemLink.addEventListener('mouseover', () => {
                    // Highlight corresponding feature on the map
                    popup
                        .setLngLat(feature.geometry.coordinates)
                        .addTo(map);
                });
                listingEl.appendChild(itemLink);
            }

            // Show the filter input
            filterEl.parentNode.style.display = 'block';
        } else if (features.length === 0 && filterEl.value !== '') {
            empty.textContent = 'No results found';
            listingEl.appendChild(empty);
        } else {
            empty.textContent = 'Drag the map to populate results';
            listingEl.appendChild(empty);

            // Hide the filter input
            filterEl.parentNode.style.display = 'none';

            // remove features filter
            // map.setFilter('airport', ['has', 'abbrev']);
        }
    }

    // function normalize(string) {
    //     return string.trim().toLowerCase();
    // }

    // Because features come from tiled vector data,
    // feature geometries may be split
    // or duplicated across tile boundaries.
    // As a result, features may appear
    // multiple times in query results.
    function getUniqueFeatures(features, comparatorProperty) {
        const uniqueIds = new Set();
        const uniqueFeatures = [];
        for (const feature of features) {
            const id = feature.properties[comparatorProperty];
            if (!uniqueIds.has(id)) {
                uniqueIds.add(id);
                uniqueFeatures.push(feature);
            }
        }
        return uniqueFeatures;
    }

    map.on('load', () => {
        map.addSource('airports', {
            'type': 'vector',
            'url': 'mapbox://mapbox.04w69w5j'
        });
        map.addLayer({
            'id': 'airport',
            'source': 'airports',
            'source-layer': 'ne_10m_airports',
            'type': 'circle',
            'paint': {
                'circle-color': '#4264fb',
                'circle-radius': 4,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        });

        map.on('movestart', () => {
            // reset features filter as the map starts moving
            map.setFilter('airport', ['has', 'abbrev']);
        });

        map.on('moveend', () => {
            const features = map.queryRenderedFeatures({ layers: ['airport'] });

            if (features) {
                const uniqueFeatures = getUniqueFeatures(features, 'iata_code');
                // Populate features for the listing overlay.
                renderListings(uniqueFeatures);

                // Clear the input container
                filterEl.value = '';

                // Store the current features in sn `airports` variable to
                // later use for filtering on `keyup`.
                airports = uniqueFeatures;
            }
        });

        map.on('mousemove', 'airport', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Populate the popup and set its coordinates based on the feature.
            const feature = e.features[0];
            popup
                .setLngLat(feature.geometry.coordinates)
                .setText(
                    `${feature.properties.name} (${feature.properties.abbrev})`
                )
                .addTo(map);
        });

        map.on('mouseleave', 'airport', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });

        filterEl.addEventListener('keyup', (e) => {
            const value = normalize(e.target.value);

            // Filter visible features that match the input value.
            const filtered = [];
            for (const feature of airports) {
                const name = normalize(feature.properties.name);
                const code = normalize(feature.properties.abbrev);
                if (name.includes(value) || code.includes(value)) {
                    filtered.push(feature);
                }
            }

            // Populate the sidebar with filtered results
            renderListings(filtered);

            // Set the filter to populate features into the layer.
            if (filtered.length) {
                map.setFilter('airport', [
                    'match',
                    ['get', 'abbrev'],
                    filtered.map((feature) => {
                        return feature.properties.abbrev;
                    }),
                    true,
                    false
                ]);
            }
        });

        // Call this function on initialization
        // passing an empty array to render an empty state
        renderListings([]);
    });
}