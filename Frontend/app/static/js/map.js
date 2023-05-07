document.addEventListener('DOMContentLoaded', function() {
  // Make the API request to get the station data
  fetch('/api/v1/stations')
    .then(response => response.json())
    .then(data => {
      // Define an empty array to store the coordinates of the points
      var coordinates = [];
      // Define an empty array to store the station names
      var names = [];

      // Loop through the data and add the coordinates and names to the arrays
      data.forEach(station => {
        var lat = station.lat;
        var lon = station.lon;
        coordinates.push([lat, lon]);
        names.push(station.nome);
      });

      // Create the map
      var map = L.map('map').fitBounds(coordinates);

      // Add the OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Add the points to the map
      for (var i = 0; i < coordinates.length; i++) {
        var marker = L.marker(coordinates[i], {title: names[i]}).addTo(map);
        marker.on('click', function(e) {
          alert(e.target.options.title);
        });
        marker.on('mouseover', function(e) {
          marker.bindTooltip(e.target.options.title).openTooltip();
        });
        marker.on('mouseout', function(e) {
          marker.unbindTooltip();
        });
      }
    })
    .catch(error => {
      console.error('Error fetching station data:', error);
    });
});
