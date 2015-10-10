Template.add_ticket.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(45.5575, 18.6796),
        zoom: 11
      };
    }
  }
});


Template.add_ticket.onCreated(function() {
  var markers = [];
  GoogleMaps.ready('map', function(map) {
     console.log("I'm ready!");
      google.maps.event.addListener(map.instance, 'click', function(event) {
        // Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        console.log(event.latLng);
        if (markers.length == 0) {
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: event.latLng,
            map: map.instance,
          });
          markers.push(marker);
        }
        console.log(google.maps);
        console.log(document.getElementById('my_lat'));
        console.log(document.getElementById('my_lng'));

      });
  });
});