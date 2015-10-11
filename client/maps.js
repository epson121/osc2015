

Template.map_evts.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(45.5575, 18.6796),
          zoom: 11,
          mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
          }
        };
      }
    }
});

Template.map_evts.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
      if (Session.get('events')) {
        var events = Session.get('events');
        for (var i = 0; i < events.length; i++) {
          var myLatLng = new google.maps.LatLng(events[i].latitude, events[i].longitude);
          var marker = new google.maps.Marker({
            draggable: false,
            position: myLatLng,
            map: map.instance,
          });
        }
      }
    });
});
