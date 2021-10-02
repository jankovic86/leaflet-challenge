var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
    console.log(data)
});

function createFeatures(earthquakeData) {


    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>`);
    }


    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            let radius = feature.properties.mag * 10;

            if (feature.properties.mag > 5) {
                fillColor = "#1a9850";
            }
            else if (feature.properties.mag >= 4) {
                fillColor = "#91cf60";
            }
            else if (feature.properties.mag >= 3) {
                fillColor = "#d9ef8b";
            }
            else if (feature.properties.mag >= 2) {
                fillColor = "#fee08b";
            }
            else if (feature.properties.mag >= 1) {
                fillColor = "#fc8d59";
            }
            else fillColor = "#d73027";

            return new L.CircleMarker(latlng, {
                fillOpacity: 0.75,
                color: "white",
                fillColor: fillColor,
                radius: radius
            });
        },
    });



    createMap(earthquakes);
}

function createMap(earthquakes) {

    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var baseMaps = {
        "Street Map": street,
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 3
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    function getColor(d) {
        return d > 5 ? "#1a9850" :
            d > 4 ? "#91cf60" :
                d > 3 ? "#d9ef8b" :
                    d > 2 ? "#fee08b" :
                        d > 1 ? "#fc8d59" :
                            "#d73027";
    }

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "info legend"),
            magnitudes = [0, 1, 2, 3, 4, 5],
            labels = [];

        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
}


