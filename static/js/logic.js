// Initialize map
var myMap = L.map('map').setView([37.09, -95.71], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

// GeoJSON feed URL for "Significant Earthquakes from the Past 30 Days"
var earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

// Fetch and plot earthquake data
fetch(earthquakeDataUrl)
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];
      var color = depthColor(depth); 
      var radius = magnitude * 10000; 

      L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        color: color,
        fillColor: color,
        fillOpacity: 0.75,
        radius: radius
      })
      .bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth}</p>`)
      .addTo(myMap);
    });
  });

// Function to determine color based on depth
function depthColor(depth) {
  if (depth < 10) return '#a3f600';
  if (depth < 30) return '#dcf400';
  if (depth < 50) return '#f7db11';
  if (depth < 70) return '#fdb72a';
  if (depth < 90) return '#fca35d';
  return '#ff5f65';
}

// Add a legend to the map
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 30, 50, 70, 90];  
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i class="legend-color" style="background:' + depthColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);