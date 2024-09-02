//creating map object 
let myMap = L.map("map", {
    center: [0.411289, 91.274260],
    zoom: 3
});

// adding tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

//using link to get the GeoJSON data. 
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

 // style function 
 function getColor(magnitude) {
    return magnitude > 5 ? '#351c75' :
           magnitude > 4 ? '#674ea7' :
           magnitude > 3 ? '#ad2323' :
           magnitude > 2 ? '#e06666' :
           magnitude > 1 ? '#ffa500' :
                           '#ffd966';
};

// Function to set style based on properties
function style(feature) {
    return {
        radius: 4 + feature.properties.mag * 2, // Increase size with magnitude
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 1
    };
};


//adding new markers
function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, style(feature));
};

//adding popup
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.place && feature.properties.mag) {
        layer.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}`);
    }
};

//getting geoJSON data 
d3.json(link).then(function(data) {
    //creating a GeoJSON layer with the retrieved data 
    L.geoJson(data, {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature 
    }).addTo(myMap);
});

// Adding a legend to the map
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'legend'),
            magnitudes = [0, 1, 2, 3, 4, 5],
            labels = [];

// Loop through our magnitude intervals and generate a label with a colored square for each interval
    for (let i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);